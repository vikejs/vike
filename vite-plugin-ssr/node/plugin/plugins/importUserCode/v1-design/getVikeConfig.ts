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
  scriptFileExtensions,
  mergeCumulativeValues
} from '../../../utils.js'
import path from 'path'
import type {
  PageConfigGlobalData,
  ConfigEnvInternal,
  ConfigValueSource,
  ConfigValueSources,
  ConfigValue,
  ConfigEnv,
  PageConfigBuildTime,
  ConfigValues,
  DefinedAtInfo
} from '../../../../../shared/page-configs/PageConfig.js'
import type { Config } from '../../../../../shared/page-configs/Config.js'
import {
  configDefinitionsBuiltIn,
  type ConfigDefinitionInternal,
  configDefinitionsBuiltInGlobal,
  type ConfigNameGlobal
} from './getVikeConfig/configDefinitionsBuiltIn.js'
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
import pc from '@brillout/picocolors'
import { createRequire } from 'module'
import { getConfigDefinedAtString } from '../../../../../shared/page-configs/utils.js'
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
  pageConfigs: PageConfigBuildTime[]
  pageConfigGlobal: PageConfigGlobalData
  globalVikeConfig: Record<string, unknown>
}

type ConfigDefinitionsIncludingCustom = Record<string, ConfigDefinitionInternal>

let devServerIsCorrupt = false
let wasConfigInvalid: boolean | null = null
let vikeConfigPromise: Promise<VikeConfig> | null = null
const vikeConfigDependencies: Set<string> = new Set()
const codeFilesEnv: Map<string, { configEnv: ConfigEnvInternal; configName: string }[]> = new Map()
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
  configDefinitionsRelevant: Record<string, ConfigDefinitionInternal>,
  configName: string,
  definedByFile: string
): ConfigDefinitionInternal {
  const configDef = configDefinitionsRelevant[configName]
  assertConfigExists(configName, Object.keys(configDefinitionsRelevant), definedByFile)
  assert(configDef)
  return configDef
}
function getConfigDefinitionOptional(
  configDefinitions: Record<string, ConfigDefinitionInternal>,
  configName: string
): null | ConfigDefinitionInternal {
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
        pageConfigs: [],
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

  const pageConfigs: PageConfigBuildTime[] = await Promise.all(
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

        const configValueSources: ConfigValueSources = {}
        objectEntries(configDefinitionsRelevant)
          .filter(([configName]) => !isGlobalConfig(configName))
          .forEach(([configName, configDef]) => {
            const sources = resolveConfigValueSources(configName, configDef, interfaceFilesRelevant, userRootDir)
            if (!sources) return
            configValueSources[configName] = sources
          })

        const { routeFilesystem, routeFilesystemDefinedBy, isErrorPage } = determineRouteFilesystem(
          locationId,
          configValueSources
        )

        const pageConfig: PageConfigBuildTime = {
          pageId: locationId,
          isErrorPage,
          routeFilesystemDefinedBy,
          routeFilesystem: isErrorPage ? null : routeFilesystem,
          configValueSources,
          configValues: getConfigValues(configValueSources, configDefinitionsRelevant)
        }

        applyEffects(pageConfig, configDefinitionsRelevant)
        pageConfig.configValues = getConfigValues(configValueSources, configDefinitionsRelevant)

        applyComputed(pageConfig, configDefinitionsRelevant)
        pageConfig.configValues = getConfigValues(configValueSources, configDefinitionsRelevant)

        return pageConfig
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
  return { pageConfigs, pageConfigGlobal, globalVikeConfig }
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
    const interfaceFilesGlobalPaths: string[] = []
    Object.entries(interfaceFilesGlobal).forEach(([locationId, interfaceFiles]) => {
      assert(isGlobalLocation(locationId, locationIds))
      interfaceFiles.forEach(({ filePath: { filePathRelativeToUserRootDir } }) => {
        if (filePathRelativeToUserRootDir) {
          interfaceFilesGlobalPaths.push(filePathRelativeToUserRootDir)
        }
      })
    })
    const globalPaths = Array.from(new Set(interfaceFilesGlobalPaths.map((p) => path.posix.dirname(p))))
    Object.entries(interfaceFilesByLocationId).forEach(([locationId, interfaceFiles]) => {
      interfaceFiles.forEach((interfaceFile) => {
        Object.keys(interfaceFile.configMap).forEach((configName) => {
          if (!isGlobalLocation(locationId, locationIds) && isGlobalConfig(configName)) {
            assertUsage(
              false,
              [
                `${getFilePathToShowToUser(interfaceFile.filePath)} defines the config ${pc.cyan(
                  configName
                )} which is global:`,
                globalPaths.length
                  ? `define ${pc.cyan(configName)} in ${joinEnglish(globalPaths, 'or')} instead`
                  : `create a global config (e.g. /pages/+config.js) and define ${pc.cyan(configName)} there instead`
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
    const sources = resolveConfigValueSources(configName, configDef, interfaceFilesGlobal, userRootDir)
    const configValueSource = sources?.[0]
    if (!configValueSource) return
    if (arrayIncludes(objectKeys(pageConfigGlobal), configName)) {
      assert(!('value' in configValueSource))
      pageConfigGlobal[configName] = configValueSource
    } else {
      assert('value' in configValueSource)
      if (configName === 'prerender' && typeof configValueSource.value === 'boolean') return
      assert(!configValueSource.isComputed)
      assertWarning(
        false,
        `Being able to define config ${pc.cyan(configName)} in ${
          configValueSource.definedAtInfo.filePath
        } is experimental and will likely be removed. Define the config ${pc.cyan(
          configName
        )} in vite-plugin-ssr's Vite plugin options instead.`,
        { onlyOnce: true }
      )
      globalVikeConfig[configName] = configValueSource.value
    }
  })

  return { pageConfigGlobal, globalVikeConfig }
}

function resolveConfigValueSources(
  configName: string,
  configDef: ConfigDefinitionInternal,
  interfaceFilesRelevant: InterfaceFilesByLocationId,
  userRootDir: string
): null | ConfigValueSource[] {
  let sources: ConfigValueSource[] | null = null

  // interfaceFilesRelevant is sorted by sortAfterInheritanceOrder()
  for (const interfaceFiles of Object.values(interfaceFilesRelevant)) {
    const interfaceFilesDefiningConfig = interfaceFiles.filter((interfaceFile) => interfaceFile.configMap[configName])
    if (interfaceFilesDefiningConfig.length === 0) continue
    sources = sources ?? []
    const visited = new WeakSet<InterfaceFile>()
    const add = (interfaceFile: InterfaceFile) => {
      assert(!visited.has(interfaceFile))
      visited.add(interfaceFile)
      const configValueSource = getConfigValueSource(configName, interfaceFile, configDef, userRootDir)
      sources!.push(configValueSource)
    }

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
        ;[interfaceFileWinner, ...interfaceFilesOverriden].forEach((interfaceFile) => {
          add(interfaceFile)
        })
      }
    }

    // Side-effect configs such as `export { frontmatter }` in .mdx files
    interfaceFilesDefiningConfig
      .filter(
        (interfaceFile) =>
          interfaceFile.isValueFile &&
          // Is side-effect export
          interfaceFile.configNameDefault !== configName
      )
      .forEach((interfaceValueFileSideEffect) => {
        add(interfaceValueFileSideEffect)
      })

    // extends
    interfaceFilesDefiningConfig
      .filter((interfaceFile) => interfaceFile.isConfigFile && interfaceFile.isConfigExtend)
      // extended config files are already sorted by inheritance order
      .forEach((interfaceFile) => {
        add(interfaceFile)
      })

    interfaceFilesDefiningConfig.forEach((interfaceFile) => {
      assert(visited.has(interfaceFile))
    })
  }

  assert(sources === null || sources.length > 0)
  return sources
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
  configDef: ConfigDefinitionInternal,
  userRootDir: string
) {
  interfaceFilesOverriden.forEach((interfaceFileLoser) => {
    const configValueSourceWinner = getConfigValueSource(configName, interfaceFileWinner, configDef, userRootDir)
    const configValueSourceLoser = getConfigValueSource(configName, interfaceFileLoser, configDef, userRootDir)
    assertWarning(
      false,
      `${getConfigDefinedAtString(
        configName,
        configValueSourceLoser,
        true
      )} overriden by another ${getConfigDefinedAtString(
        configName,
        configValueSourceWinner,
        false
      )}, remove one of the two`,
      { onlyOnce: false }
    )
  })
}

function isInterfaceFileUserLand(interfaceFile: InterfaceFile) {
  return (interfaceFile.isConfigFile && !interfaceFile.isConfigExtend) || interfaceFile.isValueFile
}

function getConfigValueSource(
  configName: string,
  interfaceFile: InterfaceFile,
  configDef: ConfigDefinitionInternal,
  userRootDir: string
): ConfigValueSource {
  // TODO: rethink file paths of ConfigElement
  const configFilePath = interfaceFile.filePath.filePathRelativeToUserRootDir ?? interfaceFile.filePath.filePathAbsolute
  const conf = interfaceFile.configMap[configName]
  assert(conf)
  const configEnv = configDef.env

  const definedAtInfoConfigFile = {
    filePath: configFilePath,
    fileExportPath: ['default', configName]
  }

  if (configDef._valueIsFilePath) {
    let filePath: string
    if (interfaceFile.isConfigFile) {
      const { configValue } = conf
      const codeFile = getCodeFilePath(configValue, interfaceFile.filePath, userRootDir)
      const configDefinedAt = getConfigDefinedAtString(configName, { definedAtInfo: definedAtInfoConfigFile }, true)
      assertUsage(codeFile, `${configDefinedAt} should be an import`)
      filePath = codeFile.importFilePath
    } else {
      assert(interfaceFile.isValueFile)
      filePath =
        interfaceFile.filePath.filePathRelativeToUserRootDir ??
        // Experimental: is this needed? Would it work?
        interfaceFile.filePath.filePathAbsolute
    }
    const configValueSource: ConfigValueSource = {
      value: filePath,
      valueIsFilePath: true,
      configEnv,
      valueIsImportedAtRuntime: true,
      isComputed: false,
      definedAtInfo: {
        filePath,
        fileExportPath: []
      }
    }
    return configValueSource
  }

  if (interfaceFile.isConfigFile) {
    assert('configValue' in conf)
    const { configValue } = conf
    const codeFile = getCodeFilePath(configValue, interfaceFile.filePath, userRootDir)
    if (codeFile) {
      const { importFilePath, codeFileExport } = codeFile
      assertCodeFileEnv(importFilePath, configEnv, configName)
      const configValueSource: ConfigValueSource = {
        configEnv,
        valueIsImportedAtRuntime: true,
        isComputed: false,
        definedAtInfo: {
          filePath: importFilePath,
          fileExportPath: [codeFileExport]
        }
      }
      return configValueSource
    } else {
      const configValueSource: ConfigValueSource = {
        value: configValue,
        configEnv,
        valueIsImportedAtRuntime: false,
        isComputed: false,
        definedAtInfo: definedAtInfoConfigFile
      }
      return configValueSource
    }
  } else if (interfaceFile.isValueFile) {
    // TODO: rethink file paths of ConfigElement
    const importFilePath = interfaceFile.filePath.filePathRelativeToUserRootDir ?? interfaceFile.filePath.filePathAbsolute
    const codeFileExport = configName === interfaceFile.configNameDefault ? 'default' : configName
    const valueAlreadyLoaded = 'configValue' in conf
    const configValueSource: ConfigValueSource = {
      configEnv,
      valueIsImportedAtRuntime: !valueAlreadyLoaded,
      isComputed: false,
      definedAtInfo: {
        filePath: importFilePath,
        fileExportPath: [codeFileExport]
      }
    }
    if (valueAlreadyLoaded) {
      configValueSource.value = conf.configValue
    } else {
      assert(configEnv !== 'config-only')
    }
    return configValueSource
  }
  assert(false)
}

function assertCodeFileEnv(importFilePath: string, configEnv: ConfigEnvInternal, configName: string) {
  if (!codeFilesEnv.has(importFilePath)) {
    codeFilesEnv.set(importFilePath, [])
  }
  const codeFileEnv = codeFilesEnv.get(importFilePath)!
  codeFileEnv.push({ configEnv, configName })
  const configDifferentEnv = codeFileEnv.filter((c) => c.configEnv !== configEnv)[0]
  if (configDifferentEnv) {
    assertUsage(
      false,
      [
        `${importFilePath} defines the value of configs living in different environments:`,
        ...[configDifferentEnv, { configName, configEnv }].map(
          (c) => `  - config ${pc.cyan(c.configName)} which value lives in environment ${pc.cyan(c.configEnv)}`
        ),
        'Defining config values in the same file is allowed only if they live in the same environment, see https://vite-plugin-ssr.com/header-file/import-from-same-file'
      ].join('\n')
    )
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
): null | { importFilePath: string; codeFileExport: string } {
  if (typeof configValue !== 'string') {
    return null
  }
  const importData = parseImportData(configValue)
  if (!importData) {
    return null
  }
  const { importPath, importExportName } = importData

  let importFilePath = importPath

  if (importFilePath.startsWith('.')) {
    // We need to resolve relative paths into absolute paths. Because the import paths are included in virtual files:
    // ```
    // [vite] Internal server error: Failed to resolve import "./onPageTransitionHooks" from "virtual:vite-plugin-ssr:importPageCode:client:/pages/index". Does the file exist?
    // ```
    importFilePath = resolveRelativeCodeFilePath(importData, configFilePath, userRootDir)
  } else {
    // importFilePath can be:
    //  - an npm package import
    //  - a path alias
  }

  return {
    // TODO: rename?
    importFilePath,
    codeFileExport: importExportName
  }
}

function resolveRelativeCodeFilePath(importData: ImportData, configFilePath: FilePath, userRootDir: string) {
  let importFilePath = resolveImport(importData, configFilePath)

  // Make it a Vite path
  assertPosixPath(userRootDir)
  assertPosixPath(importFilePath)
  if (importFilePath.startsWith(userRootDir)) {
    importFilePath = getVitePathFromAbsolutePath(importFilePath, userRootDir)
  } else {
    assertUsage(
      false,
      `${getFilePathToShowToUser(configFilePath)} imports from a relative path ${pc.cyan(
        importData.importPath
      )} outside of ${userRootDir} which is forbidden: import from a relative path inside ${userRootDir}, or import from a dependency's package.json#exports entry instead`
    )
    // None of the following works. Seems to be a Vite bug?
    // /*
    // assert(importFilePath.startsWith('/'))
    // importFilePath = `/@fs${importFilePath}`
    // /*/
    // importFilePath = path.posix.relative(userRootDir, importFilePath)
    // assert(importFilePath.startsWith('../'))
    // importFilePath = '/' + importFilePath
    // //*/
  }

  assertPosixPath(importFilePath)
  assert(importFilePath.startsWith('/'))
  return importFilePath
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
  Object.entries(interfaceFilesRelevant).forEach(([_locationId, interfaceFiles]) => {
    interfaceFiles.forEach((interfaceFile) => {
      const configMeta = interfaceFile.configMap['meta']
      if (!configMeta) return
      const meta = configMeta.configValue
      assertMetaValue(
        meta,
        // Maybe we should use the getConfigDefinedAtString() helper?
        `Config ${pc.cyan('meta')} defined at ${getFilePathToShowToUser(interfaceFile.filePath)}`
      )
      objectEntries(meta).forEach(([configName, configDefinition]) => {
        // User can override an existing config definition
        configDefinitions[configName] = {
          ...configDefinitions[configName],
          ...configDefinition
        }
      })
    })
  })
  return configDefinitions
}

function assertMetaValue(
  metaVal: unknown,
  configMetaDefinedAt: `Config meta${string}`
): asserts metaVal is Record<string, ConfigDefinitionInternal> {
  assertUsage(
    isObject(metaVal),
    `${configMetaDefinedAt} has an invalid type ${pc.cyan(typeof metaVal)}: it should be an object instead.`
  )
  objectEntries(metaVal).forEach(([configName, def]) => {
    assertUsage(
      isObject(def),
      `${configMetaDefinedAt} sets meta.${configName} to a value with an invalid type ${pc.cyan(
        typeof def
      )}: it should be an object instead.`
    )

    // env
    {
      const envValues: string[] = [
        'client-only',
        'server-only',
        'server-and-client',
        'config-only'
      ] satisfies ConfigEnv[]
      const hint = [
        `Set the value of ${pc.cyan('env')} to `,
        joinEnglish(
          envValues.map((s) => pc.cyan(`'${s}'`)),
          'or'
        ),
        '.'
      ].join('')
      assertUsage('env' in def, `${configMetaDefinedAt} doesn't set meta.${configName}.env but it's required. ${hint}`)
      assertUsage(
        hasProp(def, 'env', 'string'),
        `${configMetaDefinedAt} sets meta.${configName}.env to an invalid type ${pc.cyan(typeof def.env)}. ${hint}`
      )
      assertUsage(
        envValues.includes(def.env),
        `${configMetaDefinedAt} sets meta.${configName}.env to an invalid value ${pc.cyan(`'${def.env}'`)}. ${hint}`
      )
    }

    // effect
    if ('effect' in def) {
      assertUsage(
        hasProp(def, 'effect', 'function'),
        `${configMetaDefinedAt} sets meta.${configName}.effect to an invalid type ${pc.cyan(
          typeof def.effect
        )}: it should be a function instead`
      )
      assertUsage(
        def.env === 'config-only',
        `${configMetaDefinedAt} sets meta.${configName}.effect but it's only supported if meta.${configName}.env is ${pc.cyan(
          'config-only'
        )} (but it's ${pc.cyan(def.env)} instead)`
      )
    }
  })
}

function applyEffects(pageConfig: PageConfigBuildTime, configDefinitionsRelevant: ConfigDefinitionsIncludingCustom) {
  objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
    if (!configDef.effect) return
    // The value needs to be loaded at config time, that's why we only support effect for configs that are config-only for now.
    // (We could support effect for non config-only by always loading its value at config time, regardless of the config's `env` value.)
    assertWarning(
      configDef.env === 'config-only',
      [
        `Adding an effect to ${pc.cyan(configName)} may not work as expected because ${pc.cyan(
          configName
        )} has an ${pc.cyan('env')} that is different than ${pc.cyan('config-only')} (its env is ${pc.cyan(
          configDef.env
        )}).`,
        'Reach out to a maintainer if you want to use this in production.'
      ].join(' '),
      { onlyOnce: true }
    )
    const configValue = pageConfig.configValueSources[configName]?.[0]
    if (!configValue) return
    const configModFromEffect = configDef.effect({
      configValue: configValue.value,
      configDefinedAt: getConfigDefinedAtString(configName, configValue, true)
    })
    if (!configModFromEffect) return
    assert(hasProp(configValue, 'value')) // We need to assume that the config value is loaded at build-time
    applyEffect(configModFromEffect, configValue, pageConfig.configValueSources)
  })
}
function applyEffect(
  configModFromEffect: Config,
  configValueEffectSource: ConfigValue,
  configValueSources: ConfigValueSources
) {
  const notSupported = `config.meta[configName].effect currently only supports modifying the the ${pc.cyan(
    'env'
  )} of a config. Reach out to a maintainer if you need more capabilities.`
  objectEntries(configModFromEffect).forEach(([configName, configValue]) => {
    if (configName === 'meta') {
      assertMetaValue(configValue, getConfigDefinedAtString(configName, configValueEffectSource, true, 'effect'))
      objectEntries(configValue).forEach(([configTargetName, configTargetDef]) => {
        {
          const keys = Object.keys(configTargetDef)
          assertUsage(keys.includes('env'), notSupported)
          assertUsage(keys.length === 1, notSupported)
        }
        const envOverriden = configTargetDef.env
        const sources = configValueSources[configTargetName]
        sources?.forEach((configValueSource) => {
          configValueSource.configEnv = envOverriden
        })
      })
    } else {
      assertUsage(false, notSupported)
      // If we do end implementing being able to set the value of a config:
      //  - For setting definedAtInfo: we could take the definedAtInfo of the effect config while appending '(effect)' to definedAtInfo.fileExportPath
    }
  })
}

function applyComputed(pageConfig: PageConfigBuildTime, configDefinitionsRelevant: ConfigDefinitionsIncludingCustom) {
  objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
    const computed = configDef._computed
    if (!computed) return
    const value = computed(pageConfig)
    if (value === undefined) return

    const configValueSource: ConfigValueSource = {
      value,
      configEnv: configDef.env,
      definedAtInfo: null,
      isComputed: true,
      valueIsImportedAtRuntime: false
    }

    pageConfig.configValueSources[configName] ??= []
    // Computed values are inserted last: they have the least priority (i.e. computed can be overriden)
    pageConfig.configValueSources[configName]!.push(configValueSource)
  })
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
      `${getFilePathToShowToUser(configFilePath)} uses ${pc.cyan('extends')} to inherit from ${pc.cyan(
        importPath
      )} which is a user-land file: this is experimental and may be remove at any time. Reach out to a maintainer if you need this feature.`,
      { onlyOnce: true }
    )
  }
}

function getExtendsImportData(configFileExports: Record<string, unknown>, configFilePath: FilePath): ImportData[] {
  const filePathToShowToUser = getFilePathToShowToUser(configFilePath)
  assertDefaultExportObject(configFileExports, filePathToShowToUser)
  const defaultExports = configFileExports.default
  const wrongUsage = `${filePathToShowToUser} sets the config 'extends' to an invalid value, see https://vite-plugin-ssr.com/extends`
  let extendList: string[]
  if (!('extends' in defaultExports)) {
    return []
  } else if (hasProp(defaultExports, 'extends', 'string')) {
    extendList = [defaultExports.extends]
  } else if (hasProp(defaultExports, 'extends', 'string[]')) {
    extendList = defaultExports.extends
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
  const configNamesGlobal = getConfigNamesGlobal()
  return arrayIncludes(configNamesGlobal, configName)
}
function getConfigNamesGlobal() {
  return Object.keys(configDefinitionsBuiltInGlobal)
}

function assertConfigExists(configName: string, configNamesRelevant: string[], definedByFile: string) {
  const configNames = [...configNamesRelevant, ...getConfigNamesGlobal()]
  if (configNames.includes(configName)) return
  handleUnknownConfig(configName, configNames, definedByFile)
  assert(false)
}
function handleUnknownConfig(configName: string, configNames: string[], definedByFile: string) {
  let errMsg = `${definedByFile} defines an unknown config ${pc.cyan(configName)}`
  let configNameSimilar: string | null = null
  if (configName === 'page') {
    configNameSimilar = 'Page'
  } else {
    configNameSimilar = getMostSimilar(configName, configNames)
  }
  if (configNameSimilar) {
    assert(configNameSimilar !== configName)
    errMsg += `, did you mean to define ${pc.cyan(configNameSimilar)} instead?`
  }
  if (configName === 'page') {
    assert(configNameSimilar === 'Page')
    errMsg += ` (The name of the config ${pc.cyan('Page')} starts with a capital letter ${pc.cyan(
      'P'
    )} because it usually defines a UI component: a ubiquitous JavaScript convention is to start the name of UI components with a capital letter.)`
  }
  assertUsage(false, errMsg)
}

function determineRouteFilesystem(locationId: string, configValueSources: ConfigValueSources) {
  const configName = 'filesystemRoutingRoot'
  const configFilesystemRoutingRoot = configValueSources[configName]?.[0]
  let routeFilesystem = getRouteFilesystem(locationId)
  if (determineIsErrorPage(routeFilesystem)) {
    return { isErrorPage: true, routeFilesystem: null, routeFilesystemDefinedBy: null }
  }
  let routeFilesystemDefinedBy = getRouteFilesystemDefinedBy(locationId) // for log404()
  if (configFilesystemRoutingRoot) {
    const routingRoot = getFilesystemRoutingRootEffect(configFilesystemRoutingRoot, configName)
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
function getFilesystemRoutingRootEffect(
  configFilesystemRoutingRoot: ConfigValueSource,
  configName: 'filesystemRoutingRoot'
) {
  assert(configFilesystemRoutingRoot.configEnv === 'config-only')
  // Eagerly loaded since it's config-only
  assert('value' in configFilesystemRoutingRoot)
  const { value } = configFilesystemRoutingRoot
  const configDefinedAt = getConfigDefinedAtString(configName, configFilesystemRoutingRoot, true)
  assertUsage(typeof value === 'string', `${configDefinedAt} should be a string`)
  assertUsage(
    value.startsWith('/'),
    `${configDefinedAt} is ${pc.cyan(value)} but it should start with a leading slash ${pc.cyan('/')}`
  )
  assert(!configFilesystemRoutingRoot.isComputed)
  const before = getRouteFilesystem(getLocationId(configFilesystemRoutingRoot.definedAtInfo.filePath))
  const after = value
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
    const importPathString = pc.cyan(`'${importPath}'`)
    const errIntro = importWasGenerated
      ? (`The import path ${importPathString} in ${filePathToShowToUser}` as const)
      : (`The import ${pc.cyan(importDataString)} defined in ${filePathToShowToUser}` as const)
    const errIntro2 = `${errIntro} couldn't be resolved: does ${importPathString}` as const
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

function getConfigValues(
  configValueSources: ConfigValueSources,
  configDefinitionsRelevant: ConfigDefinitionsIncludingCustom
): ConfigValues {
  const configValues: ConfigValues = {}
  Object.entries(configValueSources).forEach(([configName, sources]) => {
    const configDef = configDefinitionsRelevant[configName]
    assert(configDef)
    if (!configDef.cumulative) {
      const configValueSource = sources[0]!
      if ('value' in configValueSource) {
        const { value, definedAtInfo } = configValueSource
        configValues[configName] = {
          value,
          definedAtInfo
        }
      }
    } else {
      const value = mergeCumulative(configName, sources)
      configValues[configName] = {
        value,
        definedAtInfo: null
      }
    }
  })
  return configValues
}

function mergeCumulative(configName: string, configValueSources: ConfigValueSource[]): unknown[] | Set<unknown> {
  const valuesArr: unknown[][] = []
  const valuesSet: Set<unknown>[] = []
  let configValueSourcePrevious: ConfigValueSource | null = null
  configValueSources.forEach((configValueSource) => {
    assert(!configValueSource.isComputed)
    const configDefinedAt = getConfigDefinedAtString(configName, configValueSource, true)
    const configNameColored = pc.cyan(configName)
    // We could, in principle, also support cumulative values to be defined in +${configName}.js but it ins't completely trivial to implement
    assertUsage(
      'value' in configValueSource,
      `${configDefinedAt} is only allowed to be defined in a +config.h.js file. (Because the values of ${configNameColored} are cumulative.)`
    )
    /* This is more confusing than adding value. For example, this explanation shouldn't be shown for the passToClient config.
    const explanation = `(Because the values of ${configNameColored} are cumulative and therefore merged together.)` as const
    */

    const assertNoMixing = (isSet: boolean) => {
      type T = 'a Set' | 'an array'
      const vals1 = isSet ? valuesSet : valuesArr
      const t1: T = isSet ? 'a Set' : 'an array'
      const vals2 = !isSet ? valuesSet : valuesArr
      const t2: T = !isSet ? 'a Set' : 'an array'
      assert(vals1.length > 0)
      if (vals2.length === 0) return
      assert(configValueSourcePrevious)
      const configPreviousDefinedAt = getConfigDefinedAtString(configName, configValueSourcePrevious, false)
      assertUsage(
        false,
        `${configDefinedAt} sets ${t1} but another ${configPreviousDefinedAt} sets ${t2} which is forbidden: the values must be all arrays or all sets (you cannot mix).`
      )
    }

    const { value } = configValueSource
    if (Array.isArray(value)) {
      valuesArr.push(value)
      assertNoMixing(false)
    } else if (value instanceof Set) {
      valuesSet.push(value)
      assertNoMixing(true)
    } else {
      assertUsage(false, `${configDefinedAt} must be an array or a Set`)
    }

    configValueSourcePrevious = configValueSource
  })

  if (valuesArr.length > 0) {
    assert(valuesSet.length === 0)
    const result = mergeCumulativeValues(valuesArr)
    assert(result !== null)
    return result
  }
  if (valuesSet.length > 0) {
    assert(valuesArr.length === 0)
    const result = mergeCumulativeValues(valuesSet)
    assert(result !== null)
    return result
  }
  assert(false)
}
