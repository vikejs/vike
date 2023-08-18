export { getVikeConfig }
export { reloadVikeConfig }
export { vikeConfigDependencies }
export { isVikeConfigFile }

import {
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  toPosixPath,
  assertWarning,
  addFileExtensionsToRequireResolve,
  assertDefaultExportUnknown,
  assertDefaultExportObject,
  objectEntries,
  hasProp,
  arrayIncludes,
  objectKeys,
  assertIsNotProductionRuntime,
  getMostSimilar,
  isNpmPackageImport,
  joinEnglish,
  lowerFirst,
  scriptFileExtensions
} from '../../../utils.js'
import path from 'path'
import type {
  ConfigElement,
  PageConfigData,
  PageConfigGlobalData,
  ConfigElementSource,
  ConfigEnvPrivate
} from '../../../../../shared/page-configs/PageConfig.js'
import { configDefinitionsBuiltIn, type ConfigDefinition } from './getVikeConfig/configDefinitionsBuiltIn.js'
import glob from 'fast-glob'
import type { ExtensionResolved } from '../../../../../shared/ConfigVps.js'
import {
  getLocationId,
  getRouteFilesystem,
  getRouteFilesystemDefinedBy,
  isInherited,
  sortAfterInheritanceOrder,
  isGlobalLocation,
  applyFilesystemRoutingRootEffect
} from './getVikeConfig/filesystemRouting.js'
import { isTmpFile, transpileAndExecuteFile } from './transpileAndExecuteFile.js'
import { ImportData, parseImportData } from './replaceImportStatements.js'
import { isConfigInvalid, isConfigInvalid_set } from '../../../../runtime/renderPage/isConfigInvalid.js'
import { getViteDevServer } from '../../../../runtime/globalContext.js'
import { logConfigError, logConfigErrorRecover } from '../../../shared/loggerNotProd.js'
import {
  removeSuperfluousViteLog_enable,
  removeSuperfluousViteLog_disable
} from '../../../shared/loggerVite/removeSuperfluousViteLog.js'
import { type FilePath, getFilePathToShowToUser } from './getFilePathToShowToUser.js'
import type { ConfigNameBuiltIn } from '../../../../../shared/page-configs/Config.js'
import { createRequire } from 'module'
// @ts-ignore Shimed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

assertIsNotProductionRuntime()

type InterfaceFile = InterfaceConfigFile | InterfaceValueFile
type InterfaceFileCommons = {
  filePath: FilePath
  configMap: Record<ConfigName, { configValue?: unknown }>
}
type InterfaceConfigFile = InterfaceFileCommons & {
  isConfigFile: true
  isValueFile: false
  extendsFilePaths: string[]
  isConfigExtend: boolean
}
type InterfaceValueFile = InterfaceFileCommons & {
  isConfigFile: false
  isValueFile: true
  configNameDefault: string
  // All value files are +someConfig.js file living in user-land => filePathRelativeToUserRootDir is always defined
  filePath: UserFilePath
}
type ConfigName = string
type LocationId = string
type InterfaceFilesByLocationId = Record<LocationId, InterfaceFile[]>

type VikeConfig = {
  pageConfigsData: PageConfigData[]
  pageConfigGlobal: PageConfigGlobalData
  globalVikeConfig: Record<string, unknown>
}

type ConfigDefinitionsIncludingCustom = Record<string, ConfigDefinition>

type ConfigNameGlobal =
  | 'onPrerenderStart'
  | 'onBeforeRoute'
  | 'prerender'
  | 'extensions'
  | 'disableAutoFullBuild'
  | 'includeAssetsImportedByServer'
  | 'baseAssets'
  | 'baseServer'
const configDefinitionsBuiltInGlobal: Record<ConfigNameGlobal, ConfigDefinition> = {
  onPrerenderStart: {
    env: 'server-only'
  },
  onBeforeRoute: {
    env: '_routing-eager'
  },
  prerender: {
    env: 'config-only'
  },
  extensions: { env: 'config-only' },
  disableAutoFullBuild: { env: 'config-only' },
  includeAssetsImportedByServer: { env: 'config-only' },
  baseAssets: { env: 'config-only' },
  baseServer: { env: 'config-only' }
}

let devServerIsCorrupt = false
let wasConfigInvalid: boolean | null = null
let vikeConfigPromise: Promise<VikeConfig> | null = null
const vikeConfigDependencies: Set<string> = new Set()
const codeFilesEnv: Map<string, { configEnv: ConfigEnvPrivate; configName: string }[]> = new Map()
function reloadVikeConfig(userRootDir: string, extensions: ExtensionResolved[]) {
  vikeConfigDependencies.clear()
  codeFilesEnv.clear()
  vikeConfigPromise = loadVikeConfig_withErrorHandling(userRootDir, true, extensions, true)
  handleReloadSideEffects()
}
async function handleReloadSideEffects() {
  wasConfigInvalid = isConfigInvalid
  const vikeConfigPromisePrevious = vikeConfigPromise
  try {
    await vikeConfigPromise
  } catch (err) {
    // handleReloadSideEffects() is only called in dev.
    // In dev, if loadVikeConfig_withErrorHandling() throws an error, then it's a vite-plugin-ssr bug.
    console.error(err)
    assert(false)
  }
  if (vikeConfigPromise !== vikeConfigPromisePrevious) {
    // Let the next handleReloadSideEffects() call handle side effects
    return
  }
  if (!isConfigInvalid) {
    if (wasConfigInvalid) {
      wasConfigInvalid = false
      logConfigErrorRecover()
    }
    if (devServerIsCorrupt) {
      devServerIsCorrupt = false
      const viteDevServer = getViteDevServer()
      assert(viteDevServer)
      removeSuperfluousViteLog_enable()
      await viteDevServer.restart(true)
      removeSuperfluousViteLog_disable()
    }
  }
}
async function getVikeConfig(
  userRootDir: string,
  isDev: boolean,
  extensions: ExtensionResolved[],
  tolerateInvalidConfig = false
): Promise<VikeConfig> {
  if (!vikeConfigPromise) {
    vikeConfigPromise = loadVikeConfig_withErrorHandling(userRootDir, isDev, extensions, tolerateInvalidConfig)
  }
  return await vikeConfigPromise
}

async function loadInterfaceFiles(
  userRootDir: string,
  isDev: boolean,
  extensions: ExtensionResolved[]
): Promise<InterfaceFilesByLocationId> {
  const plusFiles = await findPlusFiles(userRootDir, isDev, extensions)
  const configFiles: UserFilePath[] = []
  const valueFiles: UserFilePath[] = []
  plusFiles.forEach((f) => {
    if (getConfigName(f.filePathRelativeToUserRootDir) === 'config') {
      configFiles.push(f)
    } else {
      valueFiles.push(f)
    }
  })

  let interfaceFilesByLocationId: InterfaceFilesByLocationId = {}

  // Config files
  await Promise.all(
    configFiles.map(async ({ filePathAbsolute, filePathRelativeToUserRootDir }) => {
      const configFilePath = {
        filePathAbsolute: filePathAbsolute,
        filePathRelativeToUserRootDir: filePathRelativeToUserRootDir
      }
      const { configFile, extendsConfigs } = await loadConfigFile(configFilePath, userRootDir, [])
      const interfaceFile = getInterfaceFileFromConfigFile(configFile, false)

      const locationId = getLocationId(filePathRelativeToUserRootDir)
      interfaceFilesByLocationId[locationId] = interfaceFilesByLocationId[locationId] ?? []
      interfaceFilesByLocationId[locationId]!.push(interfaceFile)
      extendsConfigs.forEach((extendsConfig) => {
        const interfaceFile = getInterfaceFileFromConfigFile(extendsConfig, true)
        interfaceFilesByLocationId[locationId]!.push(interfaceFile)
      })
    })
  )

  // Value files
  await Promise.all(
    valueFiles.map(async ({ filePathAbsolute, filePathRelativeToUserRootDir }) => {
      const configNameDefault = getConfigName(filePathRelativeToUserRootDir)
      assert(configNameDefault)
      const interfaceFile: InterfaceValueFile = {
        filePath: {
          filePathRelativeToUserRootDir,
          filePathAbsolute
        },
        configMap: {
          [configNameDefault]: {}
        },
        isConfigFile: false,
        isValueFile: true,
        configNameDefault
      }
      {
        // We don't have access to custom config definitions yet
        //  - We load +someCustomConifg.js later
        //  - But we do need to eagerly load +meta.js (to get all the custom config definitions)
        const configDef = getConfigDefinitionOptional(configDefinitionsBuiltIn, configNameDefault)
        if (configDef?.env === 'config-only') {
          await loadValueFile(interfaceFile, configNameDefault, userRootDir)
        }
      }
      {
        const locationId = getLocationId(filePathRelativeToUserRootDir)
        interfaceFilesByLocationId[locationId] = interfaceFilesByLocationId[locationId] ?? []
        interfaceFilesByLocationId[locationId]!.push(interfaceFile)
      }
    })
  )

  return interfaceFilesByLocationId
}
function getConfigDefinition(
  configDefinitionsRelevant: Record<string, ConfigDefinition>,
  configName: string,
  definedByFile: string
): ConfigDefinition {
  const configDef = configDefinitionsRelevant[configName]
  assertConfigExists(configName, Object.keys(configDefinitionsRelevant), definedByFile)
  assert(configDef)
  return configDef
}
function getConfigDefinitionOptional(
  configDefinitions: Record<string, ConfigDefinition>,
  configName: string
): null | ConfigDefinition {
  return configDefinitions[configName] ?? null
}
async function loadValueFile(interfaceValueFile: InterfaceValueFile, configNameDefault: string, userRootDir: string) {
  const { fileExports } = await transpileAndExecuteFile(interfaceValueFile.filePath, true, userRootDir)
  assertDefaultExportUnknown(fileExports, getFilePathToShowToUser(interfaceValueFile.filePath))
  Object.entries(fileExports).forEach(([configName, configValue]) => {
    if (configName === 'default') {
      configName = configNameDefault
    }
    interfaceValueFile.configMap[configName] = { configValue }
  })
}
function getInterfaceFileFromConfigFile(configFile: ConfigFile, isConfigExtend: boolean): InterfaceFile {
  const { fileExports, filePath, extendsFilePaths } = configFile
  const interfaceFile: InterfaceConfigFile = {
    filePath,
    configMap: {},
    isConfigFile: true,
    isValueFile: false,
    isConfigExtend,
    extendsFilePaths
  }
  const interfaceFilePathToShowToUser = getFilePathToShowToUser(filePath)
  assertDefaultExportObject(fileExports, interfaceFilePathToShowToUser)
  Object.entries(fileExports.default).forEach(([configName, configValue]) => {
    interfaceFile.configMap[configName] = { configValue }
  })
  return interfaceFile
}

async function loadVikeConfig_withErrorHandling(
  userRootDir: string,
  isDev: boolean,
  extensions: ExtensionResolved[],
  tolerateInvalidConfig: boolean
): Promise<VikeConfig> {
  let hasError = false
  let ret: VikeConfig | undefined
  let err: unknown
  try {
    ret = await loadVikeConfig(userRootDir, isDev, extensions)
  } catch (err_) {
    hasError = true
    err = err_
  }
  if (!hasError) {
    assert(ret)
    assert(err === undefined)
    isConfigInvalid_set(false)
    return ret
  } else {
    assert(ret === undefined)
    assert(err)
    isConfigInvalid_set(true)
    if (!isDev) {
      assert(getViteDevServer() === null)
      throw err
    } else {
      logConfigError(err)
      if (!tolerateInvalidConfig) {
        devServerIsCorrupt = true
      }
      const dummyData: VikeConfig = {
        pageConfigsData: [],
        pageConfigGlobal: {
          onPrerenderStart: null,
          onBeforeRoute: null
        },
        globalVikeConfig: {}
      }
      return dummyData
    }
  }
}
async function loadVikeConfig(
  userRootDir: string,
  isDev: boolean,
  extensions: ExtensionResolved[]
): Promise<VikeConfig> {
  const interfaceFilesByLocationId = await loadInterfaceFiles(userRootDir, isDev, extensions)

  const { globalVikeConfig, pageConfigGlobal } = getGlobalConfigs(interfaceFilesByLocationId, userRootDir)

  const pageConfigsData: PageConfigData[] = await Promise.all(
    Object.entries(interfaceFilesByLocationId)
      .filter(([_pageId, interfaceFiles]) => isDefiningPage(interfaceFiles))
      .map(async ([locationId]) => {
        const interfaceFilesRelevant = getInterfaceFilesRelevant(interfaceFilesByLocationId, locationId)

        const configDefinitionsRelevant = getConfigDefinitions(interfaceFilesRelevant)

        // Load value files of custom config-only configs
        await Promise.all(
          getInterfaceFileList(interfaceFilesRelevant).map(async (interfaceFile) => {
            if (!interfaceFile.isValueFile) return
            const { configNameDefault } = interfaceFile
            if (isGlobalConfig(configNameDefault)) return
            const configDef = getConfigDefinition(
              configDefinitionsRelevant,
              configNameDefault,
              getFilePathToShowToUser(interfaceFile.filePath)
            )
            if (configDef.env !== 'config-only') return
            const isAlreadyLoaded = interfacefileIsAlreaydLoaded(interfaceFile)
            if (isAlreadyLoaded) return
            // Value files for built-in confg-only configs should have already been loaded at loadInterfaceFiles()
            assert(!(configNameDefault in configDefinitionsBuiltIn))
            await loadValueFile(interfaceFile, configNameDefault, userRootDir)
          })
        )

        let configElements: PageConfigData['configElements'] = {}
        objectEntries(configDefinitionsRelevant)
          .filter(([configName]) => !isGlobalConfig(configName))
          .forEach(([configName, configDef]) => {
            const configElement = resolveConfigElement(configName, configDef, interfaceFilesRelevant, userRootDir)
            if (!configElement) return
            configElements[configName as ConfigNameBuiltIn] = configElement
          })

        const { routeFilesystem, routeFilesystemDefinedBy, isErrorPage } = determineRouteFilesystem(
          locationId,
          configElements.filesystemRoutingRoot
        )

        const pageConfigData: PageConfigData = {
          pageId: locationId,
          isErrorPage,
          routeFilesystemDefinedBy,
          routeFilesystem: isErrorPage ? null : routeFilesystem,
          configElements
        }

        applyEffects(configElements, configDefinitionsRelevant)
        applyComputed(pageConfigData, configDefinitionsRelevant)

        return pageConfigData
      })
  )

  // Show error message upon unknown config
  Object.entries(interfaceFilesByLocationId).forEach(([locationId, interfaceFiles]) => {
    const interfaceFilesRelevant = getInterfaceFilesRelevant(interfaceFilesByLocationId, locationId)
    const configDefinitionsRelevant = getConfigDefinitions(interfaceFilesRelevant)
    interfaceFiles.forEach((interfaceFile) => {
      Object.keys(interfaceFile.configMap).forEach((configName) => {
        assertConfigExists(
          configName,
          Object.keys(configDefinitionsRelevant),
          getFilePathToShowToUser(interfaceFile.filePath)
        )
      })
    })
  })
  return { pageConfigsData, pageConfigGlobal, globalVikeConfig }
}

function interfacefileIsAlreaydLoaded(interfaceFile: InterfaceFile): boolean {
  const configMapValues = Object.values(interfaceFile.configMap)
  const isAlreadyLoaded = configMapValues.some((conf) => 'configValue' in conf)
  if (isAlreadyLoaded) {
    assert(configMapValues.every((conf) => 'configValue' in conf))
  }
  return isAlreadyLoaded
}

function getInterfaceFilesRelevant(
  interfaceFilesByLocationId: InterfaceFilesByLocationId,
  locationIdPage: string
): InterfaceFilesByLocationId {
  const interfaceFilesRelevant = Object.fromEntries(
    Object.entries(interfaceFilesByLocationId)
      .filter(([locationId]) => {
        return isInherited(locationId, locationIdPage)
      })
      .sort(([locationId1], [locationId2]) => sortAfterInheritanceOrder(locationId1, locationId2, locationIdPage))
  )
  return interfaceFilesRelevant
}

function getInterfaceFileList(interfaceFilesByLocationId: InterfaceFilesByLocationId): InterfaceFile[] {
  const interfaceFiles: InterfaceFile[] = []
  Object.values(interfaceFilesByLocationId).forEach((interfaceFiles_) => {
    interfaceFiles.push(...interfaceFiles_)
  })
  return interfaceFiles
}

function getGlobalConfigs(interfaceFilesByLocationId: InterfaceFilesByLocationId, userRootDir: string) {
  const locationIds = Object.keys(interfaceFilesByLocationId)
  const interfaceFilesGlobal = Object.fromEntries(
    Object.entries(interfaceFilesByLocationId).filter(([locationId]) => {
      return isGlobalLocation(locationId, locationIds)
    })
  )

  // Validate that global configs live in global interface files
  {
    const interfaceFilesGlobalUserPaths: string[] = []
    Object.entries(interfaceFilesGlobal).forEach(([locationId, interfaceFiles]) => {
      assert(isGlobalLocation(locationId, locationIds))
      interfaceFiles.forEach(({ filePath: { filePathRelativeToUserRootDir } }) => {
        if (filePathRelativeToUserRootDir) {
          interfaceFilesGlobalUserPaths.push(filePathRelativeToUserRootDir)
        }
      })
    })
    Object.entries(interfaceFilesByLocationId).forEach(([locationId, interfaceFiles]) => {
      interfaceFiles.forEach((interfaceFile) => {
        Object.keys(interfaceFile.configMap).forEach((configName) => {
          if (!isGlobalLocation(locationId, locationIds) && isGlobalConfig(configName)) {
            assertUsage(
              false,
              [
                `${getFilePathToShowToUser(
                  interfaceFile.filePath
                )} defines the config '${configName}' which is global:`,
                interfaceFilesGlobalUserPaths.length
                  ? `define '${configName}' in ${joinEnglish(interfaceFilesGlobalUserPaths, 'or')} instead`
                  : `create a global config (e.g. /pages/+config.js) and define '${configName}' there instead`
              ].join(' ')
            )
          }
        })
      })
    })
  }

  const globalVikeConfig: Record<string, unknown> = {}
  const pageConfigGlobal: PageConfigGlobalData = {
    onBeforeRoute: null,
    onPrerenderStart: null
  }
  objectEntries(configDefinitionsBuiltInGlobal).forEach(([configName, configDef]) => {
    const configElement = resolveConfigElement(configName, configDef, interfaceFilesGlobal, userRootDir)
    if (!configElement) return
    if (arrayIncludes(objectKeys(pageConfigGlobal), configName)) {
      assert(!('configValue' in configElement))
      pageConfigGlobal[configName] = configElement
    } else {
      assert('configValue' in configElement)
      if (configName === 'prerender' && typeof configElement.configValue === 'boolean') return
      assertWarning(
        false,
        `Being able to define config '${configName}' in ${configElement.configDefinedByFile} is experimental and will likely be removed. Define the config '${configName}' in vite-plugin-ssr's Vite plugin options instead.`,
        { onlyOnce: true }
      )
      globalVikeConfig[configName] = configElement.configValue
    }
  })

  return { pageConfigGlobal, globalVikeConfig }
}

function resolveConfigElement(
  configName: string,
  configDef: ConfigDefinition,
  interfaceFilesRelevant: InterfaceFilesByLocationId,
  userRootDir: string
): null | ConfigElement {
  // interfaceFilesRelevant is sorted by sortAfterInheritanceOrder()
  for (const interfaceFiles of Object.values(interfaceFilesRelevant)) {
    const interfaceFilesDefiningConfig = interfaceFiles.filter((interfaceFile) => interfaceFile.configMap[configName])
    if (interfaceFilesDefiningConfig.length === 0) continue

    // Main resolution logic
    {
      const interfaceValueFiles = interfaceFilesDefiningConfig
        .filter(
          (interfaceFile) =>
            interfaceFile.isValueFile &&
            // We consider side-effect exports (e.g. `export { frontmatter }` of .mdx files) later (i.e. with less priority)
            interfaceFile.configNameDefault === configName
        )
        .sort(makeOrderDeterministic)
      const interfaceConfigFiles = interfaceFilesDefiningConfig
        .filter(
          (interfaceFile) =>
            interfaceFile.isConfigFile &&
            // We consider value from extended configs (e.g. vike-react) later (i.e. with less priority)
            !interfaceFile.isConfigExtend
        )
        .sort(makeOrderDeterministic)
      const interfaceValueFile = interfaceValueFiles[0]
      const interfaceConfigFile = interfaceConfigFiles[0]
      // Make this value:
      //   /pages/some-page/+someConfig.js > `export default`
      // override that value:
      //   /pages/some-page/+config > `export default { someConfig }`
      const interfaceFileWinner = interfaceValueFile ?? interfaceConfigFile
      if (interfaceFileWinner) {
        const interfaceFilesOverriden = [...interfaceValueFiles, ...interfaceConfigFiles].filter(
          (f) => f !== interfaceFileWinner
        )
        // A user-land conflict of interfaceFiles with the same locationId means that the user has superfluously defined the config twice; the user should remove such redundancy making things unnecessarily ambiguous
        warnOverridenConfigValues(interfaceFileWinner, interfaceFilesOverriden, configName, configDef, userRootDir)
        return getConfigElement(configName, interfaceFileWinner, configDef, userRootDir)
      }
    }

    // Side-effect configs such as `export { frontmatter }` in .mdx files
    {
      const interfaceValueFiles = interfaceFilesDefiningConfig.filter((interfaceFile) => interfaceFile.isValueFile)
      const interfaceValueFileSideEffect = interfaceValueFiles[0]
      if (interfaceValueFileSideEffect) {
        assert(
          interfaceValueFileSideEffect.isValueFile && interfaceValueFileSideEffect.configNameDefault !== configName
        )
        return getConfigElement(configName, interfaceValueFileSideEffect, configDef, userRootDir)
      }
    }

    // extends
    assert(
      interfaceFilesDefiningConfig.every((interfaceFile) => interfaceFile.isConfigFile && interfaceFile.isConfigExtend)
    )
    // extended config files are already sorted by inheritance order
    const interfaceFile = interfaceFilesDefiningConfig[0]
    assert(interfaceFile)
    return getConfigElement(configName, interfaceFile, configDef, userRootDir)
  }

  return null
}
function makeOrderDeterministic(interfaceFile1: InterfaceFile, interfaceFile2: InterfaceFile): 0 | -1 | 1 {
  return lowerFirst<InterfaceFile>((interfaceFile) => {
    const { filePathRelativeToUserRootDir } = interfaceFile.filePath
    assert(isInterfaceFileUserLand(interfaceFile))
    assert(filePathRelativeToUserRootDir)
    return filePathRelativeToUserRootDir.length
  })(interfaceFile1, interfaceFile2)
}
function warnOverridenConfigValues(
  interfaceFileWinner: InterfaceFile,
  interfaceFilesOverriden: InterfaceFile[],
  configName: string,
  configDef: ConfigDefinition,
  userRootDir: string
) {
  interfaceFilesOverriden.forEach((interfaceFileLoser) => {
    const configElementWinner = getConfigElement(configName, interfaceFileWinner, configDef, userRootDir)
    const configElementLoser = getConfigElement(configName, interfaceFileLoser, configDef, userRootDir)
    assertWarning(
      false,
      `${configElementLoser.configDefinedAt} overriden by ${configElementWinner.configDefinedAt}, remove one of the two`,
      { onlyOnce: false }
    )
  })
}

function isInterfaceFileUserLand(interfaceFile: InterfaceFile) {
  return (interfaceFile.isConfigFile && !interfaceFile.isConfigExtend) || interfaceFile.isValueFile
}

function getConfigElement(
  configName: string,
  interfaceFile: InterfaceFile,
  configDef: ConfigDefinition,
  userRootDir: string
): ConfigElement {
  // TODO: rethink file paths of ConfigElement
  const configFilePath = interfaceFile.filePath.filePathRelativeToUserRootDir ?? interfaceFile.filePath.filePathAbsolute
  const conf = interfaceFile.configMap[configName]
  assert(conf)
  const configEnv = configDef.env
  if (interfaceFile.isConfigFile) {
    assert('configValue' in conf)
    const { configValue } = conf
    const codeFile = getCodeFilePath(configValue, interfaceFile.filePath, userRootDir)
    if (codeFile) {
      const { codeFilePath, codeFileExport } = codeFile
      assertCodeFileEnv(codeFilePath, configEnv, configName)
      const configElement = {
        plusConfigFilePath: configFilePath,
        codeFilePath,
        codeFileExport,
        configDefinedAt: getConfigDefinedAt(codeFilePath, codeFileExport),
        configDefinedByFile: codeFilePath,
        configEnv
      }
      return configElement
    } else {
      const configElement: ConfigElement = {
        plusConfigFilePath: configFilePath,
        configDefinedAt: getConfigDefinedAt(configFilePath, configName, true),
        configDefinedByFile: configFilePath,
        codeFilePath: null,
        codeFileExport: null,
        configEnv,
        configValue
      }
      return configElement
    }
  } else if (interfaceFile.isValueFile) {
    // TODO: rethink file paths of ConfigElement
    const codeFilePath = interfaceFile.filePath.filePathRelativeToUserRootDir ?? interfaceFile.filePath.filePathAbsolute
    const codeFileExport = configName === interfaceFile.configNameDefault ? 'default' : configName
    const configElement: ConfigElement = {
      configEnv,
      codeFilePath,
      codeFileExport,
      plusConfigFilePath: null,
      configDefinedAt: getConfigDefinedAt(codeFilePath, codeFileExport),
      configDefinedByFile: codeFilePath
    }
    if ('configValue' in conf) {
      configElement.configValue = conf.configValue
    } else {
      assert(configEnv !== 'config-only')
    }
    return configElement
  }
  assert(false)
}

function assertCodeFileEnv(codeFilePath: string, configEnv: ConfigEnvPrivate, configName: string) {
  if (!codeFilesEnv.has(codeFilePath)) {
    codeFilesEnv.set(codeFilePath, [])
  }
  const codeFileEnv = codeFilesEnv.get(codeFilePath)!
  codeFileEnv.push({ configEnv, configName })
  const configDifferentEnv = codeFileEnv.filter((c) => c.configEnv !== configEnv)[0]
  if (configDifferentEnv) {
    assertUsage(
      false,
      [
        `${codeFilePath} defines the value of configs living in different environments:`,
        ...[configDifferentEnv, { configName, configEnv }].map(
          (c) => `  - config '${c.configName}' which value lives in environment '${c.configEnv}'`
        ),
        'Defining config values in the same file is allowed only if they live in the same environment, see https://vite-plugin-ssr.com/header-file/import-from-same-file'
      ].join('\n')
    )
  }
}

/* Use the type once we moved all dist/ to ESM
type ConfigDefinedAt = ReturnType<typeof getConfigDefinedAt>
*/
function getConfigDefinedAt(filePath: string, exportName: string, isDefaultExportObject?: true) {
  if (isDefaultExportObject) {
    assert(exportName !== 'default')
    return `${filePath} > \`export default { ${exportName} }` as const
  } else {
    if (exportName === '*') {
      return `${filePath} > \`export *\`` as const
    } else if (exportName === 'default') {
      return `${filePath} > \`export default\`` as const
    } else {
      return `${filePath} > \`export { ${exportName} }\`` as const
    }
  }
}

function isDefiningPage(interfaceFiles: InterfaceFile[]): boolean {
  for (const interfaceFile of interfaceFiles) {
    const configNames = Object.keys(interfaceFile.configMap)
    if (configNames.some((configName) => isDefiningPageConfig(configName))) {
      return true
    }
  }
  return false
}
function isDefiningPageConfig(configName: string): boolean {
  return ['Page', 'route'].includes(configName)
}

function getCodeFilePath(
  configValue: unknown,
  configFilePath: FilePath,
  userRootDir: string
): null | { codeFilePath: string; codeFileExport: string } {
  if (typeof configValue !== 'string') {
    return null
  }
  const importData = parseImportData(configValue)
  if (!importData) {
    return null
  }
  const { importPath, importExportName } = importData

  let codeFilePath = importPath

  if (codeFilePath.startsWith('.')) {
    // We need to resolve relative paths into absolute paths. Because the import paths are included in virtual files:
    // ```
    // [vite] Internal server error: Failed to resolve import "./onPageTransitionHooks" from "virtual:vite-plugin-ssr:importPageCode:client:/pages/index". Does the file exist?
    // ```
    codeFilePath = resolveRelativeCodeFilePath(importData, configFilePath, userRootDir)
  } else {
    // codeFilePath can be:
    //  - an npm package import
    //  - a path alias
  }

  return {
    // TODO: rename?
    codeFilePath,
    codeFileExport: importExportName
  }
}

function resolveRelativeCodeFilePath(importData: ImportData, configFilePath: FilePath, userRootDir: string) {
  let codeFilePath = resolveImport(importData, configFilePath)

  // Make it a Vite path
  assertPosixPath(userRootDir)
  assertPosixPath(codeFilePath)
  if (codeFilePath.startsWith(userRootDir)) {
    codeFilePath = getVitePathFromAbsolutePath(codeFilePath, userRootDir)
  } else {
    assertUsage(
      false,
      `${getFilePathToShowToUser(configFilePath)} imports from a relative path '${
        importData.importPath
      }' outside of ${userRootDir} which is forbidden: import from a relative path inside ${userRootDir}, or import from a dependency's package.json#exports entry instead`
    )
    // None of the following works. Seems to be a Vite bug?
    // /*
    // assert(codeFilePath.startsWith('/'))
    // codeFilePath = `/@fs${codeFilePath}`
    // /*/
    // codeFilePath = path.posix.relative(userRootDir, codeFilePath)
    // assert(codeFilePath.startsWith('../'))
    // codeFilePath = '/' + codeFilePath
    // //*/
  }

  assertPosixPath(codeFilePath)
  assert(codeFilePath.startsWith('/'))
  return codeFilePath
}

function getVitePathFromAbsolutePath(filePathAbsolute: string, root: string): string {
  assertPosixPath(filePathAbsolute)
  assertPosixPath(root)
  assert(filePathAbsolute.startsWith(root))
  let vitePath = path.posix.relative(root, filePathAbsolute)
  assert(!vitePath.startsWith('/') && !vitePath.startsWith('.'))
  vitePath = '/' + vitePath
  return vitePath
}

function getConfigDefinitions(interfaceFilesRelevant: InterfaceFilesByLocationId): ConfigDefinitionsIncludingCustom {
  const configDefinitions: ConfigDefinitionsIncludingCustom = { ...configDefinitionsBuiltIn }
  Object.values(interfaceFilesRelevant).forEach((interfaceFiles) => {
    const configEntry = getConfigEntry('meta', interfaceFiles)
    if (!configEntry.configIsDefined) return
    assert('configValue' in configEntry)
    const metaVal = configEntry.configValue
    const { interfaceFile } = configEntry
    assertMetaValue(metaVal, getFilePathToShowToUser(interfaceFile.filePath))
    objectEntries(metaVal).forEach(([configName, configDefinition]) => {
      // User can override an existing config definition
      configDefinitions[configName] = {
        ...configDefinitions[configName],
        ...configDefinition
      }
    })
  })
  return configDefinitions
}

function getConfigEntry(
  configName: string,
  interfaceFiles: InterfaceFile[]
): { configIsDefined: true; configValue?: unknown; interfaceFile: InterfaceFile } | { configIsDefined: false } {
  const interfaceFilesForConfig = interfaceFiles.filter((interfaceFile) => configName in interfaceFile.configMap)
  if (interfaceFilesForConfig.length === 0) return { configIsDefined: false }
  const interfaceFile = interfaceFilesForConfig[0]!
  const val = interfaceFile.configMap[configName]
  assert(val)
  return { configIsDefined: true, interfaceFile, ...val }
}

function assertMetaValue(metaVal: unknown, definedByFile: string): asserts metaVal is Record<string, ConfigDefinition> {
  assertUsage(
    isObject(metaVal),
    `${definedByFile} sets the config 'meta' to a value with an invalid type \`${typeof metaVal}\`: it should be an object instead.`
  )
  objectEntries(metaVal).forEach(([configName, def]) => {
    assertUsage(
      isObject(def),
      `${definedByFile} sets meta.${configName} to a value with an invalid type \`${typeof def}\`: it should be an object instead.`
    )

    // env
    {
      const envValues = ['client-only', 'server-only', 'server-and-client', 'config-only']
      const hint = [
        'Set the value of `env` to ',
        joinEnglish(
          envValues.map((s) => `'${s}'`),
          'or'
        ),
        '.'
      ].join('')
      assertUsage('env' in def, `${definedByFile} doesn't set meta.${configName}.env but it's required. ${hint}`)
      assertUsage(
        hasProp(def, 'env', 'string'),
        `${definedByFile} > meta.${configName}.env has an invalid type \`${typeof def.env}\`. ${hint}`
      )
      assertUsage(
        envValues.includes(def.env),
        `${definedByFile} > meta.${configName}.env has an invalid value '${def.env}'. ${hint}`
      )
    }

    // effect
    if ('effect' in def) {
      assertUsage(
        hasProp(def, 'effect', 'function'),
        `${definedByFile} > meta.${configName}.effect has an invalid type \`${typeof def.effect}\`: it should be a function instead`
      )
      assertUsage(
        def.env === 'config-only',
        `${definedByFile} > meta.${configName}.effect is only supported if meta.${configName}.env is 'config-only' (but it's '${def.env}')`
      )
    }
  })
}

type ConfigElements = Record<string, ConfigElement>
function applyEffects(configElements: ConfigElements, configDefinitionsRelevant: ConfigDefinitionsIncludingCustom) {
  objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
    if (!configDef.effect) return
    assert(configDef.env === 'config-only')
    const configElement = configElements[configName]
    if (!configElement) return
    assert('configValue' in configElement)
    const { configValue, configDefinedAt } = configElement
    const configFromEffect = configDef.effect({
      configValue,
      configDefinedAt
    })
    if (!configFromEffect) return
    applyEffect(configFromEffect, configElement, configElements, configDefinitionsRelevant)
  })
}
function applyEffect(
  configFromEffect: Record<string, Partial<ConfigDefinition>>,
  configElement: ConfigElement,
  configElements: ConfigElements,
  configDefinitionsRelevant: ConfigDefinitionsIncludingCustom
) {
  const configDefinedAtWithEffect = `${configElement.configDefinedAt} > effect()`
  objectEntries(configFromEffect).forEach(([configName, configValue]) => {
    if (configName === 'meta') {
      assertMetaValue(configValue, configDefinedAtWithEffect)
      objectEntries(configValue).forEach(([configTargetName, configTargetDef]) => {
        const keys = Object.keys(configTargetDef)
        assert(keys.includes('env'))
        assert(keys.length === 1)
        const configTargetElement = configElements[configTargetName]
        if (configTargetElement) {
          configTargetElement.configEnv = configTargetDef.env
        }
      })
    } else {
      // AFAIK we don't use this, nor do we need it?
      assertWarning(
        false,
        `${configDefinedAtWithEffect} is modifying a config value; this is an experimental functionality; reach out to a maintainer if you want to use this in production`,
        { onlyOnce: true }
      )
      /* We're completely overriding any previous configElement
      const configElementTargetOriginal = configElements[configName]
      */
      const configDef = getConfigDefinition(configDefinitionsRelevant, configName, configDefinedAtWithEffect)
      configElements[configName] = {
        configValue,
        configEnv: configDef.env,
        ...getConfigElementSource(configElement),
        configDefinedAt: configDefinedAtWithEffect,
        configDefinedByFile: configElement.configDefinedByFile
      }
    }
  })
}

function applyComputed(pageConfigData: PageConfigData, configDefinitionsRelevant: ConfigDefinitionsIncludingCustom) {
  objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
    const computed = configDef._computed
    if (!computed) return
    const configValue = computed(pageConfigData)
    if (configValue === undefined) return
    pageConfigData.configElements[configName] = {
      configValue,
      configEnv: configDef.env,
      configDefinedAt: 'TODO',
      configDefinedByFile: 'TODO',
      plusConfigFilePath: 'TODO',
      codeFilePath: null,
      codeFileExport: null
    }
  })
}

function getConfigElementSource(configElement: ConfigElement): ConfigElementSource {
  const { plusConfigFilePath, codeFilePath, codeFileExport }: ConfigElementSource = configElement
  const configElementSource = { plusConfigFilePath, codeFilePath, codeFileExport } as ConfigElementSource
  return configElementSource
}

async function findPlusFiles(userRootDir: string, isDev: boolean, extensions: ExtensionResolved[]) {
  const timeBase = new Date().getTime()
  assertPosixPath(userRootDir)
  const result = await glob(`**/+*.${scriptFileExtensions}`, {
    ignore: [
      '**/node_modules/**',
      // Allow:
      // ```
      // +Page.js
      // +Page.telefunc.js
      // ```
      '**/*.telefunc.*'
    ],
    cwd: userRootDir,
    dot: false
  })
  const time = new Date().getTime() - timeBase
  if (isDev) {
    // We only warn in dev, because while building it's expected to take a long time as fast-glob is competing for resources with other tasks
    assertWarning(
      time < 2 * 1000,
      `Crawling your user files took an unexpected long time (${time}ms). Create a new issue on vite-plugin-ssr's GitHub.`,
      {
        onlyOnce: 'slow-page-files-search'
      }
    )
  }

  const plusFiles = result.map((p) => {
    p = toPosixPath(p)
    const filePathRelativeToUserRootDir = path.posix.join('/', p)
    const filePathAbsolute = path.posix.join(userRootDir, p)
    return { filePathRelativeToUserRootDir, filePathAbsolute }
  })

  extensions.forEach((extension) => {
    extension.pageConfigsDistFiles?.forEach((pageConfigDistFile) => {
      // TODO/v1-release: remove
      if (!pageConfigDistFile.importPath.includes('+')) return
      assert(pageConfigDistFile.importPath.includes('+'))
      assert(path.posix.basename(pageConfigDistFile.importPath).startsWith('+'))
      const { importPath, filePath } = pageConfigDistFile
      plusFiles.push({
        filePathRelativeToUserRootDir: importPath,
        filePathAbsolute: filePath
      })
    })
  })

  return plusFiles
}

function getConfigName(filePath: string): string | null {
  assertPosixPath(filePath)
  if (isTmpFile(filePath)) return null
  const fileName = path.posix.basename(filePath)
  assertNoUnexpectedPlusSign(filePath, fileName)
  const basename = fileName.split('.')[0]!
  if (!basename.startsWith('+')) {
    return null
  } else {
    const configName = basename.slice(1)
    return configName
  }
}
function assertNoUnexpectedPlusSign(filePath: string, fileName: string) {
  const dirs = path.posix.dirname(filePath).split('/')
  dirs.forEach((dir, i) => {
    const dirPath = dirs.slice(0, i + 1).join('/')
    assertUsage(
      !dir.includes('+'),
      `Character '+' is a reserved character: remove '+' from the directory name ${dirPath}/`
    )
  })
  assertUsage(
    !fileName.slice(1).includes('+'),
    `Character '+' is only allowed at the beginning of filenames: make sure ${filePath} doesn't contain any '+' in its filename other than its first letter`
  )
}

type ConfigFile = {
  fileExports: Record<string, unknown>
  filePath: FilePath
  extendsFilePaths: string[]
}

async function loadConfigFile(
  configFilePath: FilePath,
  userRootDir: string,
  visited: string[]
): Promise<{ configFile: ConfigFile; extendsConfigs: ConfigFile[] }> {
  const { filePathAbsolute, filePathRelativeToUserRootDir } = configFilePath
  assertNoInfiniteLoop(visited, filePathAbsolute)
  const { fileExports } = await transpileAndExecuteFile(configFilePath, false, userRootDir)
  const { extendsConfigs, extendsFilePaths } = await loadExtendsConfigs(fileExports, configFilePath, userRootDir, [
    ...visited,
    filePathAbsolute
  ])

  const configFile: ConfigFile = {
    fileExports,
    filePath: {
      filePathRelativeToUserRootDir,
      filePathAbsolute
    },
    extendsFilePaths
  }
  return { configFile, extendsConfigs }
}
function assertNoInfiniteLoop(visited: string[], filePathAbsolute: string) {
  const idx = visited.indexOf(filePathAbsolute)
  if (idx === -1) return
  const loop = visited.slice(idx)
  assert(loop[0] === filePathAbsolute)
  assertUsage(idx === -1, `Infinite extends loop ${[...loop, filePathAbsolute].join('>')}`)
}

async function loadExtendsConfigs(
  configFileExports: Record<string, unknown>,
  configFilePath: FilePath,
  userRootDir: string,
  visited: string[]
) {
  const extendsImportData = getExtendsImportData(configFileExports, configFilePath)
  const extendsConfigFiles: FilePath[] = []
  extendsImportData.map((importData) => {
    const { importPath } = importData
    // TODO
    //  - validate extends configs
    const filePathAbsolute = resolveImport(importData, configFilePath)
    assertExtendsImportPath(importPath, filePathAbsolute, configFilePath)
    extendsConfigFiles.push({
      filePathAbsolute,
      // - filePathRelativeToUserRootDir has no functionality beyond nicer error messages for user
      // - Using importPath would be visually nicer but it's ambigous => we rather pick filePathAbsolute for added clarity
      filePathRelativeToUserRootDir: determineFilePathRelativeToUserDir(filePathAbsolute, userRootDir)
    })
  })

  const extendsConfigs: ConfigFile[] = []
  await Promise.all(
    extendsConfigFiles.map(async (configFilePath) => {
      const result = await loadConfigFile(configFilePath, userRootDir, visited)
      extendsConfigs.push(result.configFile)
      extendsConfigs.push(...result.extendsConfigs)
    })
  )

  const extendsFilePaths = extendsConfigFiles.map((f) => f.filePathAbsolute)

  return { extendsConfigs, extendsFilePaths }
}

function determineFilePathRelativeToUserDir(filePathAbsolute: string, userRootDir: string): null | string {
  assertPosixPath(filePathAbsolute)
  assertPosixPath(userRootDir)
  if (!filePathAbsolute.startsWith(userRootDir)) {
    return null
  }
  let filePathRelativeToUserRootDir = filePathAbsolute.slice(userRootDir.length)
  if (!filePathRelativeToUserRootDir.startsWith('/'))
    filePathRelativeToUserRootDir = '/' + filePathRelativeToUserRootDir
  return filePathRelativeToUserRootDir
}

function assertExtendsImportPath(importPath: string, filePath: string, configFilePath: FilePath) {
  if (isNpmPackageImport(importPath)) {
    const fileDir = path.posix.dirname(filePath) + '/'
    const fileName = path.posix.basename(filePath)
    const fileNameBaseCorrect = '+config'
    const [fileNameBase, ...fileNameRest] = fileName.split('.')
    const fileNameCorrect = [fileNameBaseCorrect, ...fileNameRest].join('.')
    assertWarning(fileNameBase === fileNameBaseCorrect, `Rename ${fileName} to ${fileNameCorrect} in ${fileDir}`, {
      onlyOnce: true
    })
  } else {
    assertWarning(
      false,
      `${getFilePathToShowToUser(
        configFilePath
      )} uses 'extends' to inherit from '${importPath}' which is a user-land file: this is experimental and may be remove at any time. Reach out to a maintainer if you need this feature.`,
      { onlyOnce: true }
    )
  }
}

function getExtendsImportData(configFileExports: Record<string, unknown>, configFilePath: FilePath): ImportData[] {
  const filePathToShowToUser = getFilePathToShowToUser(configFilePath)
  assertDefaultExportObject(configFileExports, filePathToShowToUser)
  const configValues = configFileExports.default
  const wrongUsage = `${filePathToShowToUser} set the config 'extends' to an invalid value, see https://vite-plugin-ssr.com/extends`
  let extendList: string[]
  if (!('extends' in configValues)) {
    return []
  } else if (hasProp(configValues, 'extends', 'string')) {
    extendList = [configValues.extends]
  } else if (hasProp(configValues, 'extends', 'string[]')) {
    extendList = configValues.extends
  } else {
    assertUsage(false, wrongUsage)
  }
  const extendsImportData = extendList.map((importDataSerialized) => {
    const importData = parseImportData(importDataSerialized)
    assertUsage(importData, wrongUsage)
    return importData
  })
  return extendsImportData
}

type UserFilePath = {
  filePathAbsolute: string
  filePathRelativeToUserRootDir: string
}

// TODO: re-use this
function handleUserFileError(err: unknown, isDev: boolean) {
  // Properly handle error during transpilation so that we can use assertUsage() during transpilation
  if (isDev) {
    throw err
  } else {
    // Avoid ugly error format:
    // ```
    // [vite-plugin-ssr:importUserCode] Could not load virtual:vite-plugin-ssr:importUserCode:server: [vite-plugin-ssr@0.4.70][Wrong Usage] /pages/+config.ts sets the config 'onRenderHtml' to the value './+config/onRenderHtml-i-dont-exist.js' but no file was found at /home/rom/code/vite-plugin-ssr/examples/v1/pages/+config/onRenderHtml-i-dont-exist.js
    // Error: [vite-plugin-ssr@0.4.70][Wrong Usage] /pages/+config.ts sets the config 'onRenderHtml' to the value './+config/onRenderHtml-i-dont-exist.js' but no file was found at /home/rom/code/vite-plugin-ssr/examples/v1/pages/+config/onRenderHtml-i-dont-exist.js
    //     at ...
    //     at ...
    //     at ...
    //     at ...
    //     at ...
    //     at ...
    //   code: 'PLUGIN_ERROR',
    //   plugin: 'vite-plugin-ssr:importUserCode',
    //   hook: 'load',
    //   watchFiles: [
    //     '/home/rom/code/vite-plugin-ssr/vite-plugin-ssr/dist/esm/node/importBuild.js',
    //     '\x00virtual:vite-plugin-ssr:importUserCode:server'
    //   ]
    // }
    //  ELIFECYCLE  Command failed with exit code 1.
    // ```
    console.log('')
    console.error(err)
    process.exit(1)
  }
}

function isGlobalConfig(configName: string): configName is ConfigNameGlobal {
  if (configName === 'prerender') return false
  const configNamesGlobal = Object.keys(configDefinitionsBuiltInGlobal)
  return arrayIncludes(configNamesGlobal, configName)
}

function assertConfigExists(configName: string, configsDefined: string[], definedByFile: string) {
  if (isGlobalConfig(configName)) return
  if (configsDefined.includes(configName)) return
  let errMsg = `${definedByFile} defines an unknown config '${configName}'`
  const configNameSimilar = getMostSimilar(configName, configsDefined)
  if (configNameSimilar) {
    assert(configNameSimilar !== configName)
    errMsg = `${errMsg}, did you mean to define '${configNameSimilar}' instead?`
  }
  assertUsage(false, errMsg)
}

function determineRouteFilesystem(locationId: string, configFilesystemRoutingRoot: undefined | ConfigElement) {
  let routeFilesystem = getRouteFilesystem(locationId)
  if (determineIsErrorPage(routeFilesystem)) {
    return { isErrorPage: true, routeFilesystem: null, routeFilesystemDefinedBy: null }
  }
  let routeFilesystemDefinedBy = getRouteFilesystemDefinedBy(locationId) // for log404()
  if (configFilesystemRoutingRoot) {
    const routingRoot = getFilesystemRoutingRootEffect(configFilesystemRoutingRoot)
    if (routingRoot) {
      const { filesystemRoutingRootEffect, filesystemRoutingRootDefinedAt } = routingRoot
      const debugInfo = { locationId, routeFilesystem, configFilesystemRoutingRoot }
      assert(routeFilesystem.startsWith(filesystemRoutingRootEffect.before), debugInfo)
      routeFilesystem = applyFilesystemRoutingRootEffect(routeFilesystem, filesystemRoutingRootEffect)
      assert(filesystemRoutingRootDefinedAt.includes('export'))
      routeFilesystemDefinedBy = `${routeFilesystemDefinedBy} (with ${filesystemRoutingRootDefinedAt})`
    }
  }
  assert(routeFilesystem.startsWith('/'))
  return { routeFilesystem, routeFilesystemDefinedBy, isErrorPage: false }
}
function getFilesystemRoutingRootEffect(configFilesystemRoutingRoot: ConfigElement) {
  assert(configFilesystemRoutingRoot.configEnv === 'config-only')
  // Eagerly loaded since it's config-only
  assert('configValue' in configFilesystemRoutingRoot)
  const { configValue } = configFilesystemRoutingRoot
  assertUsage(typeof configValue === 'string', `${configFilesystemRoutingRoot.configDefinedAt} should be a string`)
  const { configDefinedAt } = configFilesystemRoutingRoot
  assertUsage(
    configValue.startsWith('/'),
    `${configDefinedAt} is '${configValue}' but it should start with a leading slash '/'`
  )
  const { configDefinedByFile } = configFilesystemRoutingRoot
  const before = getRouteFilesystem(getLocationId(configDefinedByFile))
  const after = configValue
  const filesystemRoutingRootEffect = { before, after }
  return { filesystemRoutingRootEffect, filesystemRoutingRootDefinedAt: configDefinedAt }
}
function determineIsErrorPage(routeFilesystem: string) {
  assertPosixPath(routeFilesystem)
  return routeFilesystem.split('/').includes('_error')
}

function resolveImport(importData: ImportData, importerFilePath: FilePath): string {
  const { filePathAbsolute } = importerFilePath
  assertPosixPath(filePathAbsolute)
  let plusConfigFilDirPathAbsolute = path.posix.dirname(filePathAbsolute)
  const clean = addFileExtensionsToRequireResolve()
  let importedFile: string | null
  try {
    importedFile = require_.resolve(importData.importPath, { paths: [plusConfigFilDirPathAbsolute] })
  } catch {
    importedFile = null
  } finally {
    clean()
  }
  assertImport(importedFile, importData, importerFilePath)
  importedFile = toPosixPath(importedFile)
  return importedFile
}
function assertImport(
  importedFile: string | null,
  importData: ImportData,
  importerFilePath: FilePath
): asserts importedFile is string {
  const { importPath, importWasGenerated, importDataString } = importData
  const filePathToShowToUser = getFilePathToShowToUser(importerFilePath)

  if (!importedFile) {
    const errIntro = importWasGenerated
      ? (`The import '${importPath}' in ${filePathToShowToUser}` as const)
      : (`'${importDataString}' defined in ${filePathToShowToUser}` as const)
    const errIntro2 = `${errIntro} couldn't be resolved: does '${importPath}'` as const
    if (importPath.startsWith('.')) {
      assertUsage(false, `${errIntro2} point to an existing file?`)
    } else {
      assertUsage(false, `${errIntro2} exist?`)
    }
  }
}

function isVikeConfigFile(filePath: string): boolean {
  return !!getConfigName(filePath)
}
