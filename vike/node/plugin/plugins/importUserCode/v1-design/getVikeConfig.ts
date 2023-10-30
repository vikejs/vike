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
  objectEntries,
  hasProp,
  arrayIncludes,
  assertIsNotProductionRuntime,
  getMostSimilar,
  isNpmPackageImport,
  joinEnglish,
  lowerFirst,
  scriptFileExtensions,
  mergeCumulativeValues,
  requireResolve
} from '../../../utils.js'
import path from 'path'
import type {
  PageConfigGlobalBuildTime,
  ConfigEnvInternal,
  ConfigValueSource,
  ConfigValueSources,
  ConfigEnv,
  PageConfigBuildTime,
  ConfigValues,
  DefinedAt,
  DefinedAtFileInfo,
  DefinedAtFile,
  ConfigValuesComputed,
  FilePathResolved,
  FilePath
} from '../../../../../shared/page-configs/PageConfig.js'
import type { Config } from '../../../../../shared/page-configs/Config.js'
import {
  configDefinitionsBuiltIn,
  type ConfigDefinitionInternal,
  configDefinitionsBuiltInGlobal,
  type ConfigNameGlobal
} from './getVikeConfig/configDefinitionsBuiltIn.js'
import glob from 'fast-glob'
import type { ExtensionResolved } from '../../../../../shared/ConfigVike.js'
import {
  getLocationId,
  getFilesystemRouteString,
  getFilesystemRouteDefinedBy,
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
import pc from '@brillout/picocolors'
import { getConfigDefinedAtString } from '../../../../../shared/page-configs/utils.js'
import {
  assertExportsOfConfigFile,
  assertExportsOfValueFile
} from '../../../../../shared/page-configs/assertExports.js'
import { getConfigValueSerialized } from './getVirtualFilePageConfigs.js'

assertIsNotProductionRuntime()

type InterfaceFile = InterfaceConfigFile | InterfaceValueFile
type InterfaceFileCommons = {
  filePath: FilePathResolved
  configMap: Record<ConfigName, { configValue?: unknown }>
}
// +config.h.js
type InterfaceConfigFile = InterfaceFileCommons & {
  isConfigFile: true
  isValueFile: false
  extendsFilePaths: string[]
  isConfigExtend: boolean
}
// +{configName}.js
type InterfaceValueFile = InterfaceFileCommons & {
  isConfigFile: false
  isValueFile: true
  configName: string
}
type ConfigName = string
type LocationId = string
type InterfaceFilesByLocationId = Record<LocationId, InterfaceFile[]>

type VikeConfig = {
  pageConfigs: PageConfigBuildTime[]
  pageConfigGlobal: PageConfigGlobalBuildTime
  globalVikeConfig: Record<string, unknown>
}

type ConfigDefinitionsIncludingCustom = Record<string, ConfigDefinitionInternal>

let devServerIsCorrupt = false
let wasConfigInvalid: boolean | null = null
let vikeConfigPromise: Promise<VikeConfig> | null = null
const vikeConfigDependencies: Set<string> = new Set()
const filesEnv: Map<string, { configEnv: ConfigEnvInternal; configName: string }[]> = new Map()
function reloadVikeConfig(userRootDir: string, outDirRoot: string, extensions: ExtensionResolved[]) {
  vikeConfigDependencies.clear()
  filesEnv.clear()
  vikeConfigPromise = loadVikeConfig_withErrorHandling(userRootDir, outDirRoot, true, extensions, true)
  handleReloadSideEffects()
}
async function handleReloadSideEffects() {
  wasConfigInvalid = isConfigInvalid
  const vikeConfigPromisePrevious = vikeConfigPromise
  try {
    await vikeConfigPromise
  } catch (err) {
    // handleReloadSideEffects() is only called in dev.
    // In dev, if loadVikeConfig_withErrorHandling() throws an error, then it's a vike bug.
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
  outDirRoot: string,
  isDev: boolean,
  extensions: ExtensionResolved[],
  tolerateInvalidConfig = false
): Promise<VikeConfig> {
  if (!vikeConfigPromise) {
    vikeConfigPromise = loadVikeConfig_withErrorHandling(
      userRootDir,
      outDirRoot,
      isDev,
      extensions,
      tolerateInvalidConfig
    )
  }
  return await vikeConfigPromise
}

async function loadInterfaceFiles(
  userRootDir: string,
  outDirRoot: string,
  isDev: boolean,
  extensions: ExtensionResolved[]
): Promise<InterfaceFilesByLocationId> {
  const plusFiles = await findPlusFiles(userRootDir, [outDirRoot], isDev, extensions)
  const configFiles: FilePathResolved[] = []
  const valueFiles: FilePathResolved[] = []
  plusFiles.forEach((f) => {
    if (getConfigName(f.filePathAbsoluteFilesystem) === 'config') {
      configFiles.push(f)
    } else {
      valueFiles.push(f)
    }
  })

  let interfaceFilesByLocationId: InterfaceFilesByLocationId = {}

  // Config files
  await Promise.all(
    configFiles.map(async (filePath) => {
      const { configFile, extendsConfigs } = await loadConfigFile(filePath, userRootDir, [])
      const interfaceFile = getInterfaceFileFromConfigFile(configFile, false)

      const locationId = getLocationId(filePath.filePathAbsoluteVite)
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
    valueFiles.map(async (filePath) => {
      const configName = getConfigName(filePath.filePathAbsoluteVite)
      assert(configName)
      const interfaceFile: InterfaceValueFile = {
        filePath,
        configMap: {
          [configName]: {}
        },
        isConfigFile: false,
        isValueFile: true,
        configName
      }
      {
        // We don't have access to custom config definitions yet
        //  - We load +{configName}.js later
        //  - But we do need to eagerly load +meta.js (to get all the custom config definitions)
        const configDef = getConfigDefinitionOptional(configDefinitionsBuiltIn, configName)
        if (configDef?.env === 'config-only') {
          await loadValueFile(interfaceFile, configName, userRootDir)
        }
      }
      {
        const locationId = getLocationId(filePath.filePathAbsoluteVite)
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
  filePathToShowToUser: string
): ConfigDefinitionInternal {
  const configDef = configDefinitionsRelevant[configName]
  assertConfigExists(configName, Object.keys(configDefinitionsRelevant), filePathToShowToUser)
  assert(configDef)
  return configDef
}
function getConfigDefinitionOptional(
  configDefinitions: Record<string, ConfigDefinitionInternal>,
  configName: string
): null | ConfigDefinitionInternal {
  return configDefinitions[configName] ?? null
}
async function loadValueFile(interfaceValueFile: InterfaceValueFile, configName: string, userRootDir: string) {
  const { fileExports } = await transpileAndExecuteFile(interfaceValueFile.filePath, true, userRootDir)
  const { filePathToShowToUser } = interfaceValueFile.filePath
  assertExportsOfValueFile(fileExports, filePathToShowToUser, configName)
  Object.entries(fileExports).forEach(([exportName, configValue]) => {
    const configName_ = exportName === 'default' ? configName : exportName
    interfaceValueFile.configMap[configName_] = { configValue }
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
  const { filePathToShowToUser } = filePath
  assertExportsOfConfigFile(fileExports, filePathToShowToUser)
  Object.entries(fileExports.default).forEach(([configName, configValue]) => {
    interfaceFile.configMap[configName] = { configValue }
  })
  return interfaceFile
}

async function loadVikeConfig_withErrorHandling(
  userRootDir: string,
  outDirRoot: string,
  isDev: boolean,
  extensions: ExtensionResolved[],
  tolerateInvalidConfig: boolean
): Promise<VikeConfig> {
  let hasError = false
  let ret: VikeConfig | undefined
  let err: unknown
  try {
    ret = await loadVikeConfig(userRootDir, outDirRoot, isDev, extensions)
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
          configValueSources: {}
        },
        globalVikeConfig: {}
      }
      return dummyData
    }
  }
}
async function loadVikeConfig(
  userRootDir: string,
  outDirRoot: string,
  isDev: boolean,
  extensions: ExtensionResolved[]
): Promise<VikeConfig> {
  const interfaceFilesByLocationId = await loadInterfaceFiles(userRootDir, outDirRoot, isDev, extensions)

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
            const { configName } = interfaceFile
            if (isGlobalConfig(configName)) return
            const configDef = getConfigDefinition(
              configDefinitionsRelevant,
              configName,
              interfaceFile.filePath.filePathToShowToUser
            )
            if (configDef.env !== 'config-only') return
            const isAlreadyLoaded = interfacefileIsAlreaydLoaded(interfaceFile)
            if (isAlreadyLoaded) return
            // Value files for built-in confg-only configs should have already been loaded at loadInterfaceFiles()
            assert(!(configName in configDefinitionsBuiltIn))
            await loadValueFile(interfaceFile, configName, userRootDir)
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

        const { routeFilesystem, isErrorPage } = determineRouteFilesystem(locationId, configValueSources)

        applyEffectsAll(configValueSources, configDefinitionsRelevant)
        const configValuesComputed = getComputed(configValueSources, configDefinitionsRelevant)
        const configValues = getConfigValues(configValueSources, configValuesComputed, configDefinitionsRelevant)

        const pageConfig: PageConfigBuildTime = {
          pageId: locationId,
          isErrorPage,
          routeFilesystem,
          configValueSources,
          configValuesComputed,
          configValues
        }
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
          interfaceFile.filePath.filePathToShowToUser
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
                `${interfaceFile.filePath.filePathToShowToUser} defines the config ${pc.cyan(
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
  const pageConfigGlobal: PageConfigGlobalBuildTime = {
    configValueSources: {}
  }
  objectEntries(configDefinitionsBuiltInGlobal).forEach(([configName, configDef]) => {
    const sources = resolveConfigValueSources(configName, configDef, interfaceFilesGlobal, userRootDir)
    const configValueSource = sources?.[0]
    if (!configValueSource) return
    if (configName === 'onBeforeRoute' || configName === 'onPrerenderStart') {
      assert(!('value' in configValueSource))
      pageConfigGlobal.configValueSources[configName] = [configValueSource]
    } else {
      assert('value' in configValueSource)
      if (configName === 'prerender' && typeof configValueSource.value === 'boolean') return
      const { filePathToShowToUser } = configValueSource.definedAtInfo
      assertWarning(
        false,
        `Being able to define config ${pc.cyan(
          configName
        )} in ${filePathToShowToUser} is experimental and will likely be removed. Define the config ${pc.cyan(
          configName
        )} in Vike's Vite plugin options instead.`,
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
            // We consider side-effect configs (e.g. `export { frontmatter }` of .mdx files) later (i.e. with less priority)
            interfaceFile.configName === configName
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
      //   /pages/some-page/+{configName}.js > `export default`
      // override that value:
      //   /pages/some-page/+config.h.js > `export default { someConfig }`
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
          // Is side-effect config
          interfaceFile.configName !== configName
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
      `${getConfigSourceDefinedAtString(
        configName,
        configValueSourceLoser,
        undefined,
        true
      )} overriden by another ${getConfigSourceDefinedAtString(
        configName,
        configValueSourceWinner,
        undefined,
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
  const conf = interfaceFile.configMap[configName]
  assert(conf)
  const configEnv = configDef.env

  const definedAtConfigFile: DefinedAtFileInfo = {
    ...interfaceFile.filePath,
    fileExportPathToShowToUser: ['default', configName]
  }

  if (configDef._valueIsFilePath) {
    let definedAtInfo: DefinedAtFileInfo
    let valueFilePath: string
    if (interfaceFile.isConfigFile) {
      const { configValue } = conf
      const import_ = resolveImport(configValue, interfaceFile.filePath, userRootDir, configEnv, configName)
      const configDefinedAt = getConfigSourceDefinedAtString(configName, { definedAtInfo: definedAtConfigFile })
      assertUsage(import_, `${configDefinedAt} should be an import`)
      valueFilePath = import_.filePathAbsoluteVite
      definedAtInfo = import_
    } else {
      assert(interfaceFile.isValueFile)
      valueFilePath = interfaceFile.filePath.filePathAbsoluteVite
      definedAtInfo = {
        ...interfaceFile.filePath,
        fileExportPathToShowToUser: []
      }
    }
    const configValueSource: ConfigValueSource = {
      value: valueFilePath,
      valueIsFilePath: true,
      configEnv,
      valueIsImportedAtRuntime: true,
      definedAtInfo
    }
    return configValueSource
  }

  if (interfaceFile.isConfigFile) {
    assert('configValue' in conf)
    const { configValue } = conf
    const import_ = resolveImport(configValue, interfaceFile.filePath, userRootDir, configEnv, configName)
    if (import_) {
      const configValueSource: ConfigValueSource = {
        configEnv,
        valueIsImportedAtRuntime: true,
        definedAtInfo: import_
      }
      return configValueSource
    } else {
      const configValueSource: ConfigValueSource = {
        value: configValue,
        configEnv,
        valueIsImportedAtRuntime: false,
        definedAtInfo: definedAtConfigFile
      }
      return configValueSource
    }
  } else if (interfaceFile.isValueFile) {
    const valueAlreadyLoaded = 'configValue' in conf
    const configValueSource: ConfigValueSource = {
      configEnv,
      valueIsImportedAtRuntime: !valueAlreadyLoaded,
      definedAtInfo: {
        ...interfaceFile.filePath,
        fileExportPathToShowToUser:
          configName === interfaceFile.configName
            ? []
            : // Side-effect config (e.g. `export { frontmatter }` of .md files)
              [configName]
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

function assertFileEnv(filePathForEnvCheck: string, configEnv: ConfigEnvInternal, configName: string) {
  assertPosixPath(filePathForEnvCheck)
  if (!filesEnv.has(filePathForEnvCheck)) {
    filesEnv.set(filePathForEnvCheck, [])
  }
  const fileEnv = filesEnv.get(filePathForEnvCheck)!
  fileEnv.push({ configEnv, configName })
  const configDifferentEnv = fileEnv.filter((c) => c.configEnv !== configEnv)[0]
  if (configDifferentEnv) {
    assertUsage(
      false,
      [
        `${filePathForEnvCheck} defines the value of configs living in different environments:`,
        ...[configDifferentEnv, { configName, configEnv }].map(
          (c) => `  - config ${pc.cyan(c.configName)} which value lives in environment ${pc.cyan(c.configEnv)}`
        ),
        'Defining config values in the same file is allowed only if they live in the same environment, see https://vike.dev/header-file/import-from-same-file'
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

function resolveImport(
  configValue: unknown,
  importerFilePath: FilePathResolved,
  userRootDir: string,
  configEnv: ConfigEnvInternal,
  configName: string
): null | DefinedAtFileInfo {
  if (typeof configValue !== 'string') return null
  const importData = parseImportData(configValue)
  if (!importData) return null

  const { importPath, exportName } = importData
  const filePathAbsoluteFilesystem = resolveImportPath(importData, importerFilePath)

  assertFileEnv(filePathAbsoluteFilesystem ?? importPath, configEnv, configName)

  const fileExportPathToShowToUser = exportName === 'default' || exportName === configName ? [] : [exportName]

  if (importPath.startsWith('.')) {
    // We need to resolve relative paths into absolute paths. Because the import paths are included in virtual files:
    // ```
    // [vite] Internal server error: Failed to resolve import "./onPageTransitionHooks" from "virtual:vike:pageConfigValuesAll:client:/pages/index". Does the file exist?
    // ```
    assertImportPath(filePathAbsoluteFilesystem, importData, importerFilePath)
    const filePathRelativeToUserRootDir = resolveImportPath_relativeToUserRootDir(
      filePathAbsoluteFilesystem,
      importData,
      importerFilePath,
      userRootDir
    )
    const filePath: FilePath = {
      filePathAbsoluteFilesystem,
      filePathRelativeToUserRootDir,
      filePathAbsoluteVite: filePathRelativeToUserRootDir,
      filePathToShowToUser: filePathRelativeToUserRootDir,
      importPathAbsolute: null
    }
    return {
      ...filePath,
      fileExportName: exportName,
      fileExportPathToShowToUser
    }
  } else {
    // importPath can be:
    //  - an npm package import
    //  - a path alias
    const filePath: FilePath = {
      filePathAbsoluteFilesystem,
      filePathRelativeToUserRootDir: null,
      filePathAbsoluteVite: importPath,
      filePathToShowToUser: importPath,
      importPathAbsolute: importPath
    }
    return {
      ...filePath,
      fileExportName: exportName,
      fileExportPathToShowToUser
    }
  }
}

function resolveImportPath_relativeToUserRootDir(
  filePathAbsoluteFilesystem: string,
  importData: ImportData,
  configFilePath: FilePathResolved,
  userRootDir: string
) {
  assertPosixPath(userRootDir)
  let filePathRelativeToUserRootDir: string
  if (filePathAbsoluteFilesystem.startsWith(userRootDir)) {
    filePathRelativeToUserRootDir = getVitePathFromAbsolutePath(filePathAbsoluteFilesystem, userRootDir)
  } else {
    assertUsage(
      false,
      `${configFilePath.filePathToShowToUser} imports from a relative path ${pc.cyan(
        importData.importPath
      )} outside of ${userRootDir} which is forbidden: import from a relative path inside ${userRootDir}, or import from a dependency's package.json#exports entry instead`
    )
    // None of the following works. Seems to be a Vite bug?
    // /*
    // assert(filePathAbsoluteFilesystem.startsWith('/'))
    // filePath = `/@fs${filePathAbsoluteFilesystem}`
    // /*/
    // filePathRelativeToUserRootDir = path.posix.relative(userRootDir, filePathAbsoluteFilesystem)
    // assert(filePathRelativeToUserRootDir.startsWith('../'))
    // filePathRelativeToUserRootDir = '/' + filePathRelativeToUserRootDir
    // //*/
  }

  assertPosixPath(filePathRelativeToUserRootDir)
  assert(filePathRelativeToUserRootDir.startsWith('/'))
  return filePathRelativeToUserRootDir
}

function getVitePathFromAbsolutePath(filePathAbsoluteFilesystem: string, root: string): string {
  assertPosixPath(filePathAbsoluteFilesystem)
  assertPosixPath(root)
  assert(filePathAbsoluteFilesystem.startsWith(root))
  let vitePath = path.posix.relative(root, filePathAbsoluteFilesystem)
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
        // TODO: Maybe we should use the getConfigDefinedAtString() helper?
        `Config ${pc.cyan('meta')} defined at ${interfaceFile.filePath.filePathToShowToUser}`
      )

      // Set configDef._userEffectDefinedAt
      Object.entries(meta).forEach(([configName, configDef]) => {
        if (!configDef.effect) return
        assert(interfaceFile.isConfigFile)
        configDef._userEffectDefinedAt = {
          ...interfaceFile.filePath,
          fileExportPathToShowToUser: ['default', 'meta', configName, 'effect']
        }
      })

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
  configMetaDefinedAt: `Config meta${string}` | null
): asserts metaVal is Record<string, ConfigDefinitionInternal> {
  if (!isObject(metaVal)) {
    assert(configMetaDefinedAt) // We expect internal effects to return a valid meta value
    assertUsage(
      false,
      `${configMetaDefinedAt} has an invalid type ${pc.cyan(typeof metaVal)}: it should be an object instead.`
    )
  }
  objectEntries(metaVal).forEach(([configName, def]) => {
    if (!isObject(def)) {
      assert(configMetaDefinedAt) // We expect internal effects to return a valid meta value
      assertUsage(
        false,
        `${configMetaDefinedAt} sets ${pc.cyan(`meta.${configName}`)} to a value with an invalid type ${pc.cyan(
          typeof def
        )}: it should be an object instead.`
      )
    }

    // env
    {
      const envValues: string[] = [
        'client-only',
        'server-only',
        'server-and-client',
        'config-only'
      ] satisfies ConfigEnv[]
      const fix = [
        `Set the value of ${pc.cyan(`meta.${configName}.env`)} to `,
        joinEnglish(
          envValues.map((s) => pc.cyan(`'${s}'`)),
          'or'
        ),
        '.'
      ].join('')
      if (!('env' in def)) {
        assert(configMetaDefinedAt) // We expect internal effects to return a valid meta value
        assertUsage(
          false,
          `${configMetaDefinedAt} doesn't set ${pc.cyan(`meta.${configName}.env`)} but it's required. ${fix}`
        )
      }
      if (!hasProp(def, 'env', 'string')) {
        assert(configMetaDefinedAt) // We expect internal effects to return a valid meta value
        assertUsage(
          false,
          `${configMetaDefinedAt} sets ${pc.cyan(`meta.${configName}.env`)} to an invalid type ${pc.cyan(
            typeof def.env
          )}. ${fix}`
        )
      }
      if (!envValues.includes(def.env)) {
        assert(configMetaDefinedAt) // We expect internal effects to return a valid meta value
        assertUsage(
          false,
          `${configMetaDefinedAt} sets ${pc.cyan(`meta.${configName}.env`)} to an unknown value ${pc.cyan(
            `'${def.env}'`
          )}. ${fix}`
        )
      }
    }

    // effect
    if ('effect' in def) {
      if (!hasProp(def, 'effect', 'function')) {
        assert(configMetaDefinedAt) // We expect internal effects to return a valid meta value
        assertUsage(
          false,
          `${configMetaDefinedAt} sets ${pc.cyan(`meta.${configName}.effect`)} to an invalid type ${pc.cyan(
            typeof def.effect
          )}: it should be a function instead`
        )
      }
      if (def.env !== 'config-only') {
        assert(configMetaDefinedAt) // We expect internal effects to return a valid meta value
        assertUsage(
          false,
          `${configMetaDefinedAt} sets ${pc.cyan(
            `meta.${configName}.effect`
          )} but it's only supported if meta.${configName}.env is ${pc.cyan('config-only')} (but it's ${pc.cyan(
            def.env
          )} instead)`
        )
      }
    }
  })
}

function applyEffectsAll(
  configValueSources: ConfigValueSources,
  configDefinitionsRelevant: ConfigDefinitionsIncludingCustom
) {
  objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
    if (!configDef.effect) return
    // The value needs to be loaded at config time, that's why we only support effect for configs that are config-only for now.
    // (We could support effect for non config-only by always loading its value at config time, regardless of the config's `env` value.)
    assertUsage(
      configDef.env === 'config-only',
      [
        `Cannot add effect to ${pc.cyan(configName)} because its ${pc.cyan('env')} is ${pc.cyan(
          configDef.env
        )}: effects can only be added to configs with an ${pc.cyan('env')} value of ${pc.cyan('config-only')}.`
      ].join(' ')
    )
    const source = configValueSources[configName]?.[0]
    if (!source) return
    // The config value is eagerly loaded since `configDef.env === 'config-only``
    assert('value' in source)
    // Call effect
    const configModFromEffect = configDef.effect({
      configValue: source.value,
      configDefinedAt: getConfigSourceDefinedAtString(configName, source)
    })
    if (!configModFromEffect) return
    assert(hasProp(source, 'value')) // We need to assume that the config value is loaded at build-time
    applyEffect(configModFromEffect, configValueSources, configDef)
  })
}
function applyEffect(
  configModFromEffect: Config,
  configValueSources: ConfigValueSources,
  configDefEffect: ConfigDefinitionInternal
) {
  const notSupported = `Effects currently only supports modifying the the ${pc.cyan('env')} of a config.` as const
  objectEntries(configModFromEffect).forEach(([configName, configValue]) => {
    if (configName === 'meta') {
      let configDefinedAtString: Parameters<typeof assertMetaValue>[1]
      if (configDefEffect._userEffectDefinedAt) {
        configDefinedAtString = getConfigSourceDefinedAtString(configName, {
          definedAtInfo: configDefEffect._userEffectDefinedAt
        })
      } else {
        configDefinedAtString = null
      }
      assertMetaValue(configValue, configDefinedAtString)
      objectEntries(configValue).forEach(([configTargetName, configTargetDef]) => {
        {
          const keys = Object.keys(configTargetDef)
          assertUsage(keys.includes('env'), notSupported)
          assertUsage(keys.length === 1, notSupported)
        }
        const envOverriden = configTargetDef.env
        const sources = configValueSources[configTargetName]
        sources?.forEach((configValueSource) => {
          // Apply effect
          configValueSource.configEnv = envOverriden
        })
      })
    } else {
      assertUsage(false, notSupported)
      // If we do end implementing being able to set the value of a config:
      //  - For setting definedAtInfo: we could take the definedAtInfo of the effect config while appending '(effect)' to definedAtInfo.fileExportPathToShowToUser
    }
  })
}

function getComputed(
  configValueSources: ConfigValueSources,
  configDefinitionsRelevant: ConfigDefinitionsIncludingCustom
) {
  const configValuesComputed: ConfigValuesComputed = {}
  objectEntries(configDefinitionsRelevant).forEach(([configName, configDef]) => {
    if (!configDef._computed) return
    const value = configDef._computed(configValueSources)
    if (value === undefined) return
    configValuesComputed[configName] = {
      value,
      configEnv: configDef.env
    }
  })
  return configValuesComputed
}

async function findPlusFiles(
  userRootDir: string,
  ignoreDirs: string[],
  isDev: boolean,
  extensions: ExtensionResolved[]
): Promise<FilePathResolved[]> {
  const timeBase = new Date().getTime()
  assertPosixPath(userRootDir)

  const ignorePatterns = []
  for (const dir of ignoreDirs) {
    assertPosixPath(dir)
    ignorePatterns.push(`${path.posix.relative(userRootDir, dir)}/**`)
  }
  const result = await glob(`**/+*.${scriptFileExtensions}`, {
    ignore: [
      '**/node_modules/**',
      // Allow:
      // ```
      // +Page.js
      // +Page.telefunc.js
      // ```
      '**/*.telefunc.*',
      ...ignorePatterns
    ],
    cwd: userRootDir,
    dot: false
  })
  const time = new Date().getTime() - timeBase
  if (isDev) {
    // We only warn in dev, because while building it's expected to take a long time as fast-glob is competing for resources with other tasks
    assertWarning(
      time < 2 * 1000,
      `Crawling your user files took an unexpected long time (${time}ms). Create a new issue on Vike's GitHub.`,
      {
        onlyOnce: 'slow-page-files-search'
      }
    )
  }

  const plusFiles: FilePathResolved[] = result.map((p) => {
    p = toPosixPath(p)
    const filePathRelativeToUserRootDir = path.posix.join('/', p)
    const filePathAbsoluteFilesystem = path.posix.join(userRootDir, p)
    return {
      filePathRelativeToUserRootDir,
      filePathAbsoluteVite: filePathRelativeToUserRootDir,
      filePathAbsoluteFilesystem,
      filePathToShowToUser: filePathRelativeToUserRootDir,
      importPathAbsolute: null
    }
  })

  // TODO/v1-release: remove
  extensions.forEach((extension) => {
    extension.pageConfigsDistFiles?.forEach((pageConfigDistFile) => {
      if (!pageConfigDistFile.importPath.includes('+')) return
      assert(pageConfigDistFile.importPath.includes('+'))
      assert(path.posix.basename(pageConfigDistFile.importPath).startsWith('+'))
      const { importPath, filePath } = pageConfigDistFile
      plusFiles.push({
        filePathRelativeToUserRootDir: null,
        filePathAbsoluteVite: importPath,
        filePathAbsoluteFilesystem: filePath,
        filePathToShowToUser: importPath,
        importPathAbsolute: importPath
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
  filePath: FilePathResolved
  extendsFilePaths: string[]
}

async function loadConfigFile(
  configFilePath: FilePathResolved,
  userRootDir: string,
  visited: string[]
): Promise<{ configFile: ConfigFile; extendsConfigs: ConfigFile[] }> {
  const { filePathAbsoluteFilesystem } = configFilePath
  assertNoInfiniteLoop(visited, filePathAbsoluteFilesystem)
  const { fileExports } = await transpileAndExecuteFile(configFilePath, false, userRootDir)
  const { extendsConfigs, extendsFilePaths } = await loadExtendsConfigs(fileExports, configFilePath, userRootDir, [
    ...visited,
    filePathAbsoluteFilesystem
  ])

  const configFile: ConfigFile = {
    fileExports,
    filePath: configFilePath,
    extendsFilePaths
  }
  return { configFile, extendsConfigs }
}
function assertNoInfiniteLoop(visited: string[], filePathAbsoluteFilesystem: string) {
  const idx = visited.indexOf(filePathAbsoluteFilesystem)
  if (idx === -1) return
  const loop = visited.slice(idx)
  assert(loop[0] === filePathAbsoluteFilesystem)
  assertUsage(idx === -1, `Infinite extends loop ${[...loop, filePathAbsoluteFilesystem].join('>')}`)
}

async function loadExtendsConfigs(
  configFileExports: Record<string, unknown>,
  configFilePath: FilePathResolved,
  userRootDir: string,
  visited: string[]
) {
  const extendsImportData = getExtendsImportData(configFileExports, configFilePath)
  const extendsConfigFiles: FilePathResolved[] = []
  extendsImportData.map((importData) => {
    const { importPath: importPath } = importData
    // TODO
    //  - validate extends configs
    const filePathAbsoluteFilesystem = resolveImportPath(importData, configFilePath)
    assertImportPath(filePathAbsoluteFilesystem, importData, configFilePath)
    assertExtendsImportPath(importPath, filePathAbsoluteFilesystem, configFilePath)
    // - filePathRelativeToUserRootDir has no functionality beyond nicer error messages for user
    // - Using importPath would be visually nicer but it's ambigous => we rather pick filePathAbsoluteFilesystem for added clarity
    const filePathRelativeToUserRootDir = determineFilePathRelativeToUserDir(filePathAbsoluteFilesystem, userRootDir)
    const filePathAbsoluteVite = filePathRelativeToUserRootDir ?? importPath
    extendsConfigFiles.push({
      filePathAbsoluteFilesystem,
      filePathAbsoluteVite,
      filePathRelativeToUserRootDir,
      filePathToShowToUser: filePathAbsoluteVite,
      importPathAbsolute: importPath
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

  const extendsFilePaths = extendsConfigFiles.map((f) => f.filePathAbsoluteFilesystem)

  return { extendsConfigs, extendsFilePaths }
}

function determineFilePathRelativeToUserDir(filePathAbsoluteFilesystem: string, userRootDir: string): null | string {
  assertPosixPath(filePathAbsoluteFilesystem)
  assertPosixPath(userRootDir)
  if (!filePathAbsoluteFilesystem.startsWith(userRootDir)) {
    return null
  }
  let filePathRelativeToUserRootDir = filePathAbsoluteFilesystem.slice(userRootDir.length)
  if (!filePathRelativeToUserRootDir.startsWith('/'))
    filePathRelativeToUserRootDir = '/' + filePathRelativeToUserRootDir
  return filePathRelativeToUserRootDir
}

function assertExtendsImportPath(importPath: string, filePath: string, configFilePath: FilePathResolved) {
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
      `${configFilePath.filePathToShowToUser} uses ${pc.cyan('extends')} to inherit from ${pc.cyan(
        importPath
      )} which is a user-land file: this is experimental and may be remove at any time. Reach out to a maintainer if you need this feature.`,
      { onlyOnce: true }
    )
  }
}

function getExtendsImportData(
  configFileExports: Record<string, unknown>,
  configFilePath: FilePathResolved
): ImportData[] {
  const { filePathToShowToUser } = configFilePath
  assertExportsOfConfigFile(configFileExports, filePathToShowToUser)
  const defaultExports = configFileExports.default
  const wrongUsage = `${filePathToShowToUser} sets the config ${pc.cyan(
    'extends'
  )} to an invalid value, see https://vike.dev/extends`
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

function isGlobalConfig(configName: string): configName is ConfigNameGlobal {
  if (configName === 'prerender') return false
  const configNamesGlobal = getConfigNamesGlobal()
  return arrayIncludes(configNamesGlobal, configName)
}
function getConfigNamesGlobal() {
  return Object.keys(configDefinitionsBuiltInGlobal)
}

function assertConfigExists(configName: string, configNamesRelevant: string[], filePathToShowToUser: string) {
  const configNames = [...configNamesRelevant, ...getConfigNamesGlobal()]
  if (configNames.includes(configName)) return
  handleUnknownConfig(configName, configNames, filePathToShowToUser)
  assert(false)
}
function handleUnknownConfig(configName: string, configNames: string[], filePathToShowToUser: string) {
  let errMsg = `${filePathToShowToUser} defines an unknown config ${pc.cyan(configName)}`
  let configNameSimilar: string | null = null
  if (configName === 'page') {
    configNameSimilar = 'Page'
  } else {
    configNameSimilar = getMostSimilar(configName, configNames)
  }
  if (configNameSimilar || configName === 'page') {
    assert(configNameSimilar)
    assert(configNameSimilar !== configName)
    errMsg += `, did you mean to define ${pc.cyan(configNameSimilar)} instead?`
    if (configName === 'page') {
      errMsg += ` (The name of the config ${pc.cyan('Page')} starts with a capital letter ${pc.cyan(
        'P'
      )} because it usually defines a UI component: a ubiquitous JavaScript convention is to start the name of UI components with a capital letter.)`
    }
  } else {
    errMsg += `, you need to define the config ${pc.cyan(configName)} by using ${pc.cyan(
      'config.meta'
    )} https://vike.dev/meta`
  }
  assertUsage(false, errMsg)
}

function determineRouteFilesystem(locationId: string, configValueSources: ConfigValueSources) {
  const configName = 'filesystemRoutingRoot'
  const configFilesystemRoutingRoot = configValueSources[configName]?.[0]
  let filesystemRouteString = getFilesystemRouteString(locationId)
  if (determineIsErrorPage(filesystemRouteString)) {
    return { isErrorPage: true as const, routeFilesystem: undefined }
  }
  let filesystemRouteDefinedBy = getFilesystemRouteDefinedBy(locationId) // for log404()
  if (configFilesystemRoutingRoot) {
    const routingRoot = getFilesystemRoutingRootEffect(configFilesystemRoutingRoot, configName)
    if (routingRoot) {
      const { filesystemRoutingRootEffect, filesystemRoutingRootDefinedAt } = routingRoot
      const debugInfo = { locationId, routeFilesystem: filesystemRouteString, configFilesystemRoutingRoot }
      assert(filesystemRouteString.startsWith(filesystemRoutingRootEffect.before), debugInfo)
      filesystemRouteString = applyFilesystemRoutingRootEffect(filesystemRouteString, filesystemRoutingRootEffect)
      filesystemRouteDefinedBy = `${filesystemRouteDefinedBy} (with ${filesystemRoutingRootDefinedAt})`
    }
  }
  assert(filesystemRouteString.startsWith('/'))
  const routeFilesystem = {
    routeString: filesystemRouteString,
    definedBy: filesystemRouteDefinedBy
  }
  return { routeFilesystem, isErrorPage: undefined }
}
function getFilesystemRoutingRootEffect(
  configFilesystemRoutingRoot: ConfigValueSource,
  configName: 'filesystemRoutingRoot'
) {
  assert(configFilesystemRoutingRoot.configEnv === 'config-only')
  // Eagerly loaded since it's config-only
  assert('value' in configFilesystemRoutingRoot)
  const { value } = configFilesystemRoutingRoot
  const configDefinedAt = getConfigSourceDefinedAtString(configName, configFilesystemRoutingRoot)
  assertUsage(typeof value === 'string', `${configDefinedAt} should be a string`)
  assertUsage(
    value.startsWith('/'),
    `${configDefinedAt} is ${pc.cyan(value)} but it should start with a leading slash ${pc.cyan('/')}`
  )
  const { filePathRelativeToUserRootDir } = configFilesystemRoutingRoot.definedAtInfo
  assert(filePathRelativeToUserRootDir)
  const before = getFilesystemRouteString(getLocationId(filePathRelativeToUserRootDir))
  const after = value
  const filesystemRoutingRootEffect = { before, after }
  return { filesystemRoutingRootEffect, filesystemRoutingRootDefinedAt: configDefinedAt }
}
function determineIsErrorPage(routeFilesystem: string) {
  assertPosixPath(routeFilesystem)
  return routeFilesystem.split('/').includes('_error')
}

function resolveImportPath(importData: ImportData, importerFilePath: FilePathResolved): string | null {
  const importerFilePathAbsolute = importerFilePath.filePathAbsoluteFilesystem
  assertPosixPath(importerFilePathAbsolute)
  const cwd = path.posix.dirname(importerFilePathAbsolute)
  // filePathAbsoluteFilesystem is expected to be null when importData.importPath is a Vite path alias
  const filePathAbsoluteFilesystem = requireResolve(importData.importPath, cwd)
  return filePathAbsoluteFilesystem
}
function assertImportPath(
  filePathAbsoluteFilesystem: string | null,
  importData: ImportData,
  importerFilePath: FilePathResolved
): asserts filePathAbsoluteFilesystem is string {
  const { importPath: importPath, importStringWasGenerated, importString } = importData
  const { filePathToShowToUser } = importerFilePath

  if (!filePathAbsoluteFilesystem) {
    const importPathString = pc.cyan(`'${importPath}'`)
    const errIntro = importStringWasGenerated
      ? (`The import path ${importPathString} in ${filePathToShowToUser}` as const)
      : (`The import ${pc.cyan(importString)} defined in ${filePathToShowToUser}` as const)
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
  configValuesComputed: ConfigValuesComputed,
  configDefinitionsRelevant: ConfigDefinitionsIncludingCustom
): ConfigValues {
  const configValues: ConfigValues = {}
  Object.entries(configValuesComputed).forEach(([configName, configValueComputed]) => {
    configValues[configName] = {
      value: configValueComputed.value,
      definedAt: { isComputed: true }
    }
  })
  Object.entries(configValueSources).forEach(([configName, sources]) => {
    const configDef = configDefinitionsRelevant[configName]
    assert(configDef)
    if (!configDef.cumulative) {
      const configValueSource = sources[0]!
      if ('value' in configValueSource) {
        configValues[configName] = {
          value: configValueSource.value,
          definedAt: getDefinedAt(configValueSource)
        }
      }
    } else {
      const value = mergeCumulative(configName, sources)
      configValues[configName] = {
        value,
        definedAt: {
          isCumulative: true,
          files: sources.map((source) => getDefinedAtFile(source))
        }
      }
    }
  })
  return configValues
}
function getDefinedAtFile(configValueSource: ConfigValueSource): DefinedAtFile {
  return {
    filePathToShowToUser: configValueSource.definedAtInfo.filePathToShowToUser,
    fileExportPathToShowToUser: configValueSource.definedAtInfo.fileExportPathToShowToUser
  }
}
function getDefinedAt(configValueSource: ConfigValueSource): DefinedAt {
  return {
    file: getDefinedAtFile(configValueSource)
  }
}

function mergeCumulative(configName: string, configValueSources: ConfigValueSource[]): unknown[] | Set<unknown> {
  const valuesArr: unknown[][] = []
  const valuesSet: Set<unknown>[] = []
  let configValueSourcePrevious: ConfigValueSource | null = null
  configValueSources.forEach((configValueSource) => {
    const configDefinedAt = getConfigSourceDefinedAtString(configName, configValueSource)
    const configNameColored = pc.cyan(configName)
    // We could, in principle, also support cumulative values to be defined in +${configName}.js but it ins't completely trivial to implement
    assertUsage(
      'value' in configValueSource,
      `${configDefinedAt} is only allowed to be defined in a +config.h.js file. (Because the values of ${configNameColored} are cumulative.)`
    )
    /* This is more confusing than adding value. For example, this explanation shouldn't be shown for the passToClient config.
    const explanation = `(Because the values of ${configNameColored} are cumulative and therefore merged together.)` as const
    */

    // Make sure configValueSource.value is serializable
    getConfigValueSerialized(configValueSource.value, configName, getDefinedAt(configValueSource))

    const assertNoMixing = (isSet: boolean) => {
      type T = 'a Set' | 'an array'
      const vals1 = isSet ? valuesSet : valuesArr
      const t1: T = isSet ? 'a Set' : 'an array'
      const vals2 = !isSet ? valuesSet : valuesArr
      const t2: T = !isSet ? 'a Set' : 'an array'
      assert(vals1.length > 0)
      if (vals2.length === 0) return
      assert(configValueSourcePrevious)
      const configPreviousDefinedAt = getConfigSourceDefinedAtString(
        configName,
        configValueSourcePrevious,
        undefined,
        false
      )
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

// TODO: rename and/or refactor
function getConfigSourceDefinedAtString<T extends string>(
  configName: T,
  { definedAtInfo }: { definedAtInfo: DefinedAtFileInfo },
  isEffect: undefined = undefined,
  sentenceBegin = true
) {
  return getConfigDefinedAtString(
    configName,
    {
      definedAt: {
        isEffect,
        file: {
          filePathToShowToUser: definedAtInfo.filePathToShowToUser,
          fileExportPathToShowToUser: definedAtInfo.fileExportPathToShowToUser
        }
      }
    },
    sentenceBegin as true
  )
}
