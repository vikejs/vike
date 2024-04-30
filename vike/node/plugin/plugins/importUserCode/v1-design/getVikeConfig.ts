export { getVikeConfig }
export { reloadVikeConfig }
export { vikeConfigDependencies }
export { isVikeConfigFile }
export { isV1Design }
export type { VikeConfigObject }
export type { InterfaceValueFile }

import {
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  assertWarning,
  objectEntries,
  hasProp,
  arrayIncludes,
  assertIsNotProductionRuntime,
  getMostSimilar,
  joinEnglish,
  lowerFirst,
  getOutDirs,
  assertKeys,
  objectKeys,
  objectFromEntries,
  makeFirst,
  isNpmPackageImport,
  reverse
} from '../../../utils.js'
import path from 'path'
import type {
  PageConfigGlobalBuildTime,
  ConfigEnvInternal,
  ConfigValueSource,
  ConfigValueSources,
  PageConfigBuildTime,
  ConfigValues,
  DefinedAtFilePath,
  DefinedAtFile,
  ConfigValuesComputed
} from '../../../../../shared/page-configs/PageConfig.js'
import type { Config } from '../../../../../shared/page-configs/Config.js'
import {
  configDefinitionsBuiltIn,
  configDefinitionsBuiltInGlobal,
  type ConfigDefinitions,
  type ConfigDefinitionInternal,
  type ConfigNameGlobal
} from './getVikeConfig/configDefinitionsBuiltIn.js'
import {
  type LocationId,
  getLocationId,
  getFilesystemRouteString,
  getFilesystemRouteDefinedBy,
  isInherited,
  sortAfterInheritanceOrder,
  isGlobalLocation,
  applyFilesystemRoutingRootEffect
} from './getVikeConfig/filesystemRouting.js'
import { isTemporaryBuildFile } from './getVikeConfig/transpileAndExecuteFile.js'
import { isConfigInvalid, isConfigInvalid_set } from '../../../../runtime/renderPage/isConfigInvalid.js'
import { getViteDevServer } from '../../../../runtime/globalContext.js'
import { logConfigError, logConfigErrorRecover } from '../../../shared/loggerNotProd.js'
import {
  removeSuperfluousViteLog_enable,
  removeSuperfluousViteLog_disable
} from '../../../shared/loggerVite/removeSuperfluousViteLog.js'
import pc from '@brillout/picocolors'
import { getConfigDefinedAt } from '../../../../../shared/page-configs/getConfigDefinedAt.js'
import type { ResolvedConfig } from 'vite'
import { assertConfigValueIsSerializable } from './getConfigValuesSerialized.js'
import { crawlPlusFiles } from './getVikeConfig/crawlPlusFiles.js'
import { getConfigFileExport } from './getConfigFileExport.js'
import {
  type ConfigFile,
  ImportedFilesLoaded,
  loadConfigFile,
  loadImportedFile,
  loadValueFile
} from './getVikeConfig/loadFileAtConfigTime.js'
import { clearFilesEnvMap, resolvePointerImportOfConfig } from './getVikeConfig/resolvePointerImport.js'
import { getFilePathResolved } from '../../../shared/getFilePath.js'
import type { FilePathResolved } from '../../../../../shared/page-configs/FilePath.js'

assertIsNotProductionRuntime()

type InterfaceFile = InterfaceConfigFile | InterfaceValueFile
type InterfaceFileCommons = {
  locationId: LocationId
  filePath: FilePathResolved
  fileExportsByConfigName: Record<ConfigName, { configValue?: unknown }>
}
// +config.js
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
type InterfaceFilesByLocationId = Record<LocationId, InterfaceFile[]>

type VikeConfigObject = {
  pageConfigs: PageConfigBuildTime[]
  pageConfigGlobal: PageConfigGlobalBuildTime
  globalVikeConfig: Record<string, unknown>
}

let devServerIsCorrupt = false
let wasConfigInvalid: boolean | null = null
let vikeConfigPromise: Promise<VikeConfigObject> | null = null
const vikeConfigDependencies: Set<string> = new Set()
function reloadVikeConfig(userRootDir: string, outDirRoot: string) {
  vikeConfigDependencies.clear()
  clearFilesEnvMap()
  vikeConfigPromise = loadVikeConfig_withErrorHandling(userRootDir, outDirRoot, true, true)
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
  config: ResolvedConfig,
  isDev: boolean,
  tolerateInvalidConfig?: true
): Promise<VikeConfigObject> {
  const { outDirRoot } = getOutDirs(config)
  const userRootDir = config.root
  if (!vikeConfigPromise) {
    vikeConfigPromise = loadVikeConfig_withErrorHandling(userRootDir, outDirRoot, isDev, tolerateInvalidConfig)
  }
  return await vikeConfigPromise
}

async function isV1Design(config: ResolvedConfig, isDev: boolean): Promise<boolean> {
  const vikeConfig = await getVikeConfig(config, isDev)
  const { pageConfigs } = vikeConfig
  const isV1Design = pageConfigs.length > 0
  return isV1Design
}

async function loadInterfaceFiles(
  userRootDir: string,
  outDirRoot: string,
  isDev: boolean
): Promise<InterfaceFilesByLocationId> {
  const plusFiles = await findPlusFiles(userRootDir, outDirRoot, isDev)
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

  await Promise.all([
    // Config files
    ...configFiles.map(async (filePath) => {
      const { filePathAbsoluteUserRootDir } = filePath
      assert(filePathAbsoluteUserRootDir)
      const { configFile, extendsConfigs } = await loadConfigFile(filePath, userRootDir, [], false)
      assert(filePath.filePathAbsoluteUserRootDir)
      const locationId = getLocationId(filePathAbsoluteUserRootDir)
      const interfaceFile = getInterfaceFileFromConfigFile(configFile, false, locationId)

      interfaceFilesByLocationId[locationId] = interfaceFilesByLocationId[locationId] ?? []
      interfaceFilesByLocationId[locationId]!.push(interfaceFile)
      extendsConfigs.forEach((extendsConfig) => {
        /* We purposely use the same locationId because the Vike extension's config should only apply to where it's being extended from, for example:
        ```js
        // /pages/admin/+config.js

        import vikeVue from 'vike-vue/config'
        // Should only apply to /pages/admin/**
        export default { extends: [vikeVue] }
        ```
        ```js
        // /pages/marketing/+config.js

        import vikeReact from 'vike-react/config'
        // Should only apply to /pages/marketing/**
        export default { extends: [vikeReact] }
        ```
        */
        const interfaceFile = getInterfaceFileFromConfigFile(extendsConfig, true, locationId)
        {
          const alreadyMigrated = [
            'vike-react',
            'vike-react-query',
            'vike-react-zustand',
            'vike-vue',
            'vike-pinia',
            'vike-solid'
          ]
          assert(extendsConfig.filePath.importPathAbsolute)
          const extensionName = extendsConfig.filePath.importPathAbsolute.split('/')[0]!
          const warnMsg = alreadyMigrated.includes(extensionName)
            ? `You're using a deprecated version of the Vike extension ${extensionName}, update ${extensionName} to its latest version.`
            : `The config of the Vike extension ${extensionName} should set a ${pc.cyan('name')} value`
          const isNameDefined = interfaceFile.fileExportsByConfigName.name?.configValue
          if (alreadyMigrated) {
            // Eventually always make it a assertUsage()
            assertWarning(isNameDefined, warnMsg, { onlyOnce: true })
          } else {
            assertUsage(isNameDefined, warnMsg)
          }
        }
        interfaceFilesByLocationId[locationId]!.push(interfaceFile)
      })
    }),
    // Value files
    ...valueFiles.map(async (filePath) => {
      const { filePathAbsoluteUserRootDir } = filePath
      assert(filePathAbsoluteUserRootDir)

      const configName = getConfigName(filePathAbsoluteUserRootDir)
      assert(configName)

      const locationId = getLocationId(filePathAbsoluteUserRootDir)

      const interfaceFile: InterfaceValueFile = {
        locationId,
        filePath,
        fileExportsByConfigName: {
          [configName]: {}
        },
        isConfigFile: false,
        isValueFile: true,
        configName
      }
      {
        // We don't have access to the custom config definitions defined by the user yet.
        //  - If `configDef` is `undefined` => we load the file +{configName}.js later.
        //  - We already need to load +meta.js here (to get the custom config definitions defined by the user)
        const configDef = getConfigDefinitionOptional(configDefinitionsBuiltIn, configName)
        if (configDef && isConfigEnv(configDef, configName)) {
          await loadValueFile(interfaceFile, configName, userRootDir)
        }
      }
      {
        interfaceFilesByLocationId[locationId] = interfaceFilesByLocationId[locationId] ?? []
        interfaceFilesByLocationId[locationId]!.push(interfaceFile)
      }
    })
  ])

  assertAllConfigsAreKnown(interfaceFilesByLocationId)

  return interfaceFilesByLocationId
}
function getInterfaceFileFromConfigFile(
  configFile: ConfigFile,
  isConfigExtend: boolean,
  locationId: LocationId
): InterfaceFile {
  const { fileExports, filePath, extendsFilePaths } = configFile
  const interfaceFile: InterfaceConfigFile = {
    locationId,
    filePath,
    fileExportsByConfigName: {},
    isConfigFile: true,
    isValueFile: false,
    isConfigExtend,
    extendsFilePaths
  }
  const fileExport = getConfigFileExport(fileExports, filePath.filePathToShowToUser)
  Object.entries(fileExport).forEach(([configName, configValue]) => {
    interfaceFile.fileExportsByConfigName[configName] = { configValue }
  })
  return interfaceFile
}
/** Show error message upon unknown config */
function assertAllConfigsAreKnown(interfaceFilesByLocationId: InterfaceFilesByLocationId) {
  objectEntries(interfaceFilesByLocationId).forEach(([locationId, interfaceFiles]) => {
    const interfaceFilesRelevant = getInterfaceFilesRelevant(interfaceFilesByLocationId, locationId)
    const configDefinitions = getConfigDefinitions(interfaceFilesRelevant)
    interfaceFiles.forEach((interfaceFile) => {
      Object.keys(interfaceFile.fileExportsByConfigName).forEach((configName) => {
        assertConfigExists(configName, Object.keys(configDefinitions), interfaceFile.filePath.filePathToShowToUser)
      })
    })
  })
}

async function loadVikeConfig_withErrorHandling(
  userRootDir: string,
  outDirRoot: string,
  isDev: boolean,
  tolerateInvalidConfig?: boolean
): Promise<VikeConfigObject> {
  let hasError = false
  let ret: VikeConfigObject | undefined
  let err: unknown
  try {
    ret = await loadVikeConfig(userRootDir, outDirRoot, isDev)
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
      const dummyData: VikeConfigObject = {
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
async function loadVikeConfig(userRootDir: string, outDirRoot: string, isDev: boolean): Promise<VikeConfigObject> {
  const interfaceFilesByLocationId = await loadInterfaceFiles(userRootDir, outDirRoot, isDev)

  const importedFilesLoaded: ImportedFilesLoaded = {}

  const { globalVikeConfig, pageConfigGlobal } = await getGlobalConfigs(
    interfaceFilesByLocationId,
    userRootDir,
    importedFilesLoaded
  )

  const pageConfigs: PageConfigBuildTime[] = await Promise.all(
    objectEntries(interfaceFilesByLocationId)
      .filter(([_pageId, interfaceFiles]) => isDefiningPage(interfaceFiles))
      .map(async ([locationId]) => {
        const interfaceFilesRelevant = getInterfaceFilesRelevant(interfaceFilesByLocationId, locationId)

        const configDefinitions = getConfigDefinitions(interfaceFilesRelevant)

        // Load value files of custom config-only configs
        await Promise.all(
          getInterfaceFileList(interfaceFilesRelevant).map(async (interfaceFile) => {
            if (!interfaceFile.isValueFile) return
            const { configName } = interfaceFile
            if (isGlobalConfig(configName)) return
            const configDef = getConfigDefinition(
              configDefinitions,
              configName,
              interfaceFile.filePath.filePathToShowToUser
            )
            if (!isConfigEnv(configDef, configName)) return
            const isAlreadyLoaded = interfacefileIsAlreaydLoaded(interfaceFile)
            if (isAlreadyLoaded) return
            // Value files of built-in configs should have already been loaded at loadInterfaceFiles()
            assert(!(configName in configDefinitionsBuiltIn))
            await loadValueFile(interfaceFile, configName, userRootDir)
          })
        )

        let configValueSources: ConfigValueSources = {}
        await Promise.all(
          objectEntries(configDefinitions)
            .filter(([configName]) => !isGlobalConfig(configName))
            .map(async ([configName, configDef]) => {
              const sources = await resolveConfigValueSources(
                configName,
                configDef,
                interfaceFilesRelevant,
                userRootDir,
                importedFilesLoaded
              )
              if (sources.length === 0) return
              configValueSources[configName] = sources
            })
        )
        configValueSources = sortConfigValueSources(configValueSources, locationId)

        const { routeFilesystem, isErrorPage } = determineRouteFilesystem(locationId, configValueSources)

        applyEffectsAll(configValueSources, configDefinitions)
        const configValuesComputed = getComputed(configValueSources, configDefinitions)
        const configValues = getConfigValues(configValueSources, configValuesComputed, configDefinitions)

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

  assertPageConfigs(pageConfigs)

  return { pageConfigs, pageConfigGlobal, globalVikeConfig }
}

function deriveConfigEnvFromFileName(env: ConfigEnvInternal, fileName: string) {
  env = { ...env }
  if (fileName.includes('.server.')) {
    env.server = true
    env.client = false
  } else if (fileName.includes('.client.')) {
    env.client = true
    env.server = false
  } else if (fileName.includes('.shared.')) {
    env.server = true
    env.client = true
  }
  return env
}

function assertPageConfigs(pageConfigs: PageConfigBuildTime[]) {
  pageConfigs.forEach((pageConfig) => {
    assertOnBeforeRenderEnv(pageConfig)
  })
}
function assertOnBeforeRenderEnv(pageConfig: PageConfigBuildTime) {
  const onBeforeRenderConfig = pageConfig.configValueSources.onBeforeRender?.[0]
  if (!onBeforeRenderConfig) return
  const onBeforeRenderEnv = onBeforeRenderConfig.configEnv
  const isClientRouting = !!pageConfig.configValues.clientRouting?.value
  // When using Server Routing, loading a onBeforeRender() hook on the client-side hasn't any effect (the Server Routing's client runtime never calls it); it unnecessarily bloats client bundle sizes
  assertUsage(
    !(onBeforeRenderEnv.client && !isClientRouting),
    `Page ${pageConfig.pageId} has an onBeforeRender() hook with env ${pc.cyan(
      JSON.stringify(onBeforeRenderEnv)
    )} which doesn't make sense because the page is using Server Routing: onBeforeRender() can be run in the client only when using Client Routing.`
  )
}

function interfacefileIsAlreaydLoaded(interfaceFile: InterfaceFile): boolean {
  const configMapValues = Object.values(interfaceFile.fileExportsByConfigName)
  const isAlreadyLoaded = configMapValues.some((conf) => 'configValue' in conf)
  if (isAlreadyLoaded) {
    assert(configMapValues.every((conf) => 'configValue' in conf))
  }
  return isAlreadyLoaded
}

function getInterfaceFilesRelevant(
  interfaceFilesByLocationId: InterfaceFilesByLocationId,
  locationIdPage: LocationId
): InterfaceFilesByLocationId {
  const interfaceFilesRelevant = Object.fromEntries(
    objectEntries(interfaceFilesByLocationId)
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

async function getGlobalConfigs(
  interfaceFilesByLocationId: InterfaceFilesByLocationId,
  userRootDir: string,
  importedFilesLoaded: ImportedFilesLoaded
) {
  const locationIds = objectKeys(interfaceFilesByLocationId)
  const interfaceFilesGlobal = objectFromEntries(
    objectEntries(interfaceFilesByLocationId).filter(([locationId]) => {
      return isGlobalLocation(locationId, locationIds)
    })
  )

  // Validate that global configs live in global interface files
  {
    const interfaceFilesGlobalPaths: string[] = []
    objectEntries(interfaceFilesGlobal).forEach(([locationId, interfaceFiles]) => {
      assert(isGlobalLocation(locationId, locationIds))
      interfaceFiles.forEach(({ filePath: { filePathAbsoluteUserRootDir } }) => {
        if (filePathAbsoluteUserRootDir) {
          interfaceFilesGlobalPaths.push(filePathAbsoluteUserRootDir)
        }
      })
    })
    const globalPaths = Array.from(new Set(interfaceFilesGlobalPaths.map((p) => path.posix.dirname(p))))
    objectEntries(interfaceFilesByLocationId).forEach(([locationId, interfaceFiles]) => {
      interfaceFiles.forEach((interfaceFile) => {
        Object.keys(interfaceFile.fileExportsByConfigName).forEach((configName) => {
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
  await Promise.all(
    objectEntries(configDefinitionsBuiltInGlobal).map(async ([configName, configDef]) => {
      const sources = await resolveConfigValueSources(
        configName,
        configDef,
        interfaceFilesGlobal,
        userRootDir,
        importedFilesLoaded
      )
      const configValueSource = sources[0]
      if (!configValueSource) return
      if (configName === 'onBeforeRoute' || configName === 'onPrerenderStart') {
        assert(!('value' in configValueSource))
        pageConfigGlobal.configValueSources[configName] = [configValueSource]
      } else {
        assert('value' in configValueSource)
        if (configName === 'prerender' && typeof configValueSource.value === 'boolean') return
        const { filePathToShowToUser } = configValueSource.definedAtFilePath
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
  )

  return { pageConfigGlobal, globalVikeConfig }
}

async function resolveConfigValueSources(
  configName: string,
  configDef: ConfigDefinitionInternal,
  interfaceFilesRelevant: InterfaceFilesByLocationId,
  userRootDir: string,
  importedFilesLoaded: ImportedFilesLoaded
): Promise<ConfigValueSource[]> {
  const sourcesInfo: Parameters<typeof getConfigValueSource>[] = []

  // interfaceFilesRelevant is sorted by sortAfterInheritanceOrder()
  for (const interfaceFiles of Object.values(interfaceFilesRelevant)) {
    const interfaceFilesDefiningConfig = interfaceFiles.filter(
      (interfaceFile) => interfaceFile.fileExportsByConfigName[configName]
    )
    if (interfaceFilesDefiningConfig.length === 0) continue
    const visited = new WeakSet<InterfaceFile>()
    const add = (interfaceFile: InterfaceFile) => {
      assert(!visited.has(interfaceFile))
      visited.add(interfaceFile)
      sourcesInfo.push([configName, interfaceFile, configDef, userRootDir, importedFilesLoaded])
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
      //   /pages/some-page/+config.js > `export default { someConfig }`
      const interfaceFileWinner = interfaceValueFile ?? interfaceConfigFile
      if (interfaceFileWinner) {
        const interfaceFilesOverriden = [...interfaceValueFiles, ...interfaceConfigFiles].filter(
          (f) => f !== interfaceFileWinner
        )
        // A user-land conflict of interfaceFiles with the same locationId means that the user has superfluously defined the config twice; the user should remove such redundancy making things unnecessarily ambiguous
        warnOverridenConfigValues(interfaceFileWinner, interfaceFilesOverriden, configName)
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

  const sources: ConfigValueSource[] = await Promise.all(
    sourcesInfo.map(async (args) => await getConfigValueSource(...args))
  )
  return sources
}
function makeOrderDeterministic(interfaceFile1: InterfaceFile, interfaceFile2: InterfaceFile): 0 | -1 | 1 {
  return lowerFirst<InterfaceFile>((interfaceFile) => {
    const { filePathAbsoluteUserRootDir } = interfaceFile.filePath
    assert(isInterfaceFileUserLand(interfaceFile))
    assert(filePathAbsoluteUserRootDir)
    return filePathAbsoluteUserRootDir.length
  })(interfaceFile1, interfaceFile2)
}
function warnOverridenConfigValues(
  interfaceFileWinner: InterfaceFile,
  interfaceFilesOverriden: InterfaceFile[],
  configName: string
) {
  interfaceFilesOverriden.forEach((interfaceFileLoser) => {
    const loserFilePath = interfaceFileLoser.filePath.filePathToShowToUser
    const winnerFilePath = interfaceFileWinner.filePath.filePathToShowToUser
    const confName = pc.cyan(configName)
    assertWarning(
      false,
      `The value of the config ${confName} defined at ${loserFilePath} is always overwritten by the value defined at ${winnerFilePath}, remove the superfluous value defined at ${loserFilePath}`,
      { onlyOnce: true }
    )
  })
}

function isInterfaceFileUserLand(interfaceFile: InterfaceFile) {
  return (interfaceFile.isConfigFile && !interfaceFile.isConfigExtend) || interfaceFile.isValueFile
}

async function getConfigValueSource(
  configName: string,
  interfaceFile: InterfaceFile,
  configDef: ConfigDefinitionInternal,
  userRootDir: string,
  importedFilesLoaded: ImportedFilesLoaded
): Promise<ConfigValueSource> {
  const conf = interfaceFile.fileExportsByConfigName[configName]
  assert(conf)
  const configEnv = deriveConfigEnvFromFileName(configDef.env, interfaceFile.filePath.fileName)
  const { locationId } = interfaceFile

  const definedAtFilePath_: DefinedAtFilePath = {
    ...interfaceFile.filePath,
    fileExportPathToShowToUser: ['default', configName]
  }

  // +client.js
  if (configDef._valueIsFilePath) {
    let definedAtFilePath: DefinedAtFilePath
    let valueFilePath: string
    if (interfaceFile.isConfigFile) {
      const { configValue } = conf
      const pointerImport = resolvePointerImportOfConfig(
        configValue,
        interfaceFile.filePath,
        userRootDir,
        configEnv,
        configName
      )
      const configDefinedAt = getConfigDefinedAt('Config', configName, definedAtFilePath_)
      assertUsage(pointerImport, `${configDefinedAt} should be an import`)
      valueFilePath = pointerImport.filePathAbsoluteVite
      definedAtFilePath = pointerImport
    } else {
      assert(interfaceFile.isValueFile)
      valueFilePath = interfaceFile.filePath.filePathAbsoluteVite
      definedAtFilePath = {
        ...interfaceFile.filePath,
        fileExportPathToShowToUser: []
      }
    }
    const configValueSource: ConfigValueSource = {
      locationId,
      value: valueFilePath,
      valueIsFilePath: true,
      configEnv,
      valueIsImportedAtRuntime: true,
      valueIsDefinedByValueFile: false,
      definedAtFilePath
    }
    return configValueSource
  }

  // +config.js
  if (interfaceFile.isConfigFile) {
    assert('configValue' in conf)
    const { configValue } = conf

    // Pointer import
    const pointerImport = resolvePointerImportOfConfig(
      configValue,
      interfaceFile.filePath,
      userRootDir,
      configEnv,
      configName
    )
    if (pointerImport) {
      const configValueSource: ConfigValueSource = {
        locationId,
        configEnv,
        valueIsImportedAtRuntime: true,
        valueIsDefinedByValueFile: false,
        definedAtFilePath: pointerImport
      }
      // Load pointer import
      if (
        isConfigEnv(configDef, configName) &&
        // The value of `extends` was already loaded and already used: we don't need the value of `extends` anymore
        configName !== 'extends'
      ) {
        if (pointerImport.filePathAbsoluteFilesystem) {
          const fileExport = await loadImportedFile(pointerImport, userRootDir, importedFilesLoaded)
          configValueSource.value = fileExport
        } else {
          const configDefinedAt = getConfigDefinedAt('Config', configName, configValueSource.definedAtFilePath)
          assertUsage(!configDef.cumulative, `${configDefinedAt} cannot be defined over an aliased import`)
        }
      }

      return configValueSource
    }

    // Defined by config file, i.e. +config.js file
    const configValueSource: ConfigValueSource = {
      locationId,
      value: configValue,
      configEnv,
      valueIsImportedAtRuntime: false,
      valueIsDefinedByValueFile: false,
      definedAtFilePath: definedAtFilePath_
    }
    return configValueSource
  }

  // Defined by value file, i.e. +{configName}.js
  if (interfaceFile.isValueFile) {
    const valueAlreadyLoaded = 'configValue' in conf
    assert(valueAlreadyLoaded === !!configEnv.config)
    const configValueSource: ConfigValueSource = {
      locationId,
      configEnv,
      valueIsImportedAtRuntime: !valueAlreadyLoaded,
      valueIsDefinedByValueFile: true,
      definedAtFilePath: {
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
    }
    return configValueSource
  }

  assert(false)
}

function isDefiningPage(interfaceFiles: InterfaceFile[]): boolean {
  for (const interfaceFile of interfaceFiles) {
    const configNames = Object.keys(interfaceFile.fileExportsByConfigName)
    if (configNames.some((configName) => isDefiningPageConfig(configName))) {
      return true
    }
  }
  return false
}
function isDefiningPageConfig(configName: string): boolean {
  return ['Page', 'route'].includes(configName)
}

function getConfigDefinitions(interfaceFilesRelevant: InterfaceFilesByLocationId): ConfigDefinitions {
  const configDefinitionsMerged: ConfigDefinitions = { ...configDefinitionsBuiltIn }
  Object.entries(interfaceFilesRelevant)
    .reverse()
    .forEach(([_locationId, interfaceFiles]) => {
      interfaceFiles.forEach((interfaceFile) => {
        const configMeta = interfaceFile.fileExportsByConfigName['meta']
        if (!configMeta) return
        const meta = configMeta.configValue
        assertMetaValue(meta, `Config ${pc.cyan('meta')} defined at ${interfaceFile.filePath.filePathToShowToUser}`)

        // Set configDef._userEffectDefinedAtFilePath
        Object.entries(meta).forEach(([configName, configDef]) => {
          if (!configDef.effect) return
          assert(interfaceFile.isConfigFile)
          configDef._userEffectDefinedAtFilePath = {
            ...interfaceFile.filePath,
            fileExportPathToShowToUser: ['default', 'meta', configName, 'effect']
          }
        })

        objectEntries(meta).forEach(([configName, configDefinition]) => {
          // User can override an existing config definition
          configDefinitionsMerged[configName] = {
            ...configDefinitionsMerged[configName],
            ...configDefinition
          }
        })
      })
    })

  const configDefinitions = configDefinitionsMerged
  return configDefinitions
}

function assertMetaValue(
  metaVal: unknown,
  metaConfigDefinedAt: `Config meta${string}` | null
): asserts metaVal is ConfigDefinitions {
  if (!isObject(metaVal)) {
    assert(metaConfigDefinedAt) // We expect internal effects to return a valid meta value
    assertUsage(
      false,
      `${metaConfigDefinedAt} has an invalid type ${pc.cyan(typeof metaVal)}: it should be an object instead.`
    )
  }
  objectEntries(metaVal).forEach(([configName, def]) => {
    if (!isObject(def)) {
      assert(metaConfigDefinedAt) // We expect internal effects to return a valid meta value
      assertUsage(
        false,
        `${metaConfigDefinedAt} sets ${pc.cyan(`meta.${configName}`)} to a value with an invalid type ${pc.cyan(
          typeof def
        )}: it should be an object instead.`
      )
    }

    // env
    let configEnv: ConfigEnvInternal
    {
      assert(metaConfigDefinedAt) // We expect internal effects to return a valid meta value
      if (!('env' in def)) {
        assertUsage(false, `${metaConfigDefinedAt} doesn't set ${pc.cyan(`meta.${configName}.env`)} but it's required.`)
      }
      configEnv = getConfigEnvValue(def.env, `${metaConfigDefinedAt} sets ${pc.cyan(`meta.${configName}.env`)} to`)
      // Overwrite deprecated value with valid value
      // TODO/v1-release: remove once support for the deprecated values is removed
      if (typeof def.env === 'string') def.env = configEnv
    }

    // effect
    if ('effect' in def) {
      if (!hasProp(def, 'effect', 'function')) {
        assert(metaConfigDefinedAt) // We expect internal effects to return a valid meta value
        assertUsage(
          false,
          `${metaConfigDefinedAt} sets ${pc.cyan(`meta.${configName}.effect`)} to an invalid type ${pc.cyan(
            typeof def.effect
          )}: it should be a function instead`
        )
      }
      if (!configEnv.config) {
        assert(metaConfigDefinedAt) // We expect internal effects to return a valid meta value
        assertUsage(
          false,
          `${metaConfigDefinedAt} sets ${pc.cyan(
            `meta.${configName}.effect`
          )} but it's only supported if meta.${configName}.env has ${pc.cyan('{ config: true }')} (but it's ${pc.cyan(
            JSON.stringify(configEnv)
          )} instead)`
        )
      }
    }
  })
}

function applyEffectsAll(configValueSources: ConfigValueSources, configDefinitions: ConfigDefinitions) {
  objectEntries(configDefinitions).forEach(([configName, configDef]) => {
    if (!configDef.effect) return
    // The value needs to be loaded at config time, that's why we only support effect for configs that are config-only for now.
    // (We could support effect for non config-only by always loading its value at config time, regardless of the config's `env` value.)
    assertUsage(
      configDef.env.config,
      [
        `Cannot add effect to ${pc.cyan(configName)} because its ${pc.cyan('env')} is ${pc.cyan(
          JSON.stringify(configDef.env)
        )}: effects can only be added to configs with an ${pc.cyan('env')} with ${pc.cyan('{ config: true }')}.`
      ].join(' ')
    )
    const source = configValueSources[configName]?.[0]
    if (!source) return
    // The config value is eagerly loaded since `configDef.env === 'config-only``
    assert('value' in source)
    // Call effect
    const configModFromEffect = configDef.effect({
      configValue: source.value,
      configDefinedAt: getConfigDefinedAt('Config', configName, source.definedAtFilePath)
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
      let configDefinedAt: Parameters<typeof assertMetaValue>[1]
      if (configDefEffect._userEffectDefinedAtFilePath) {
        configDefinedAt = getConfigDefinedAt('Config', configName, configDefEffect._userEffectDefinedAtFilePath)
      } else {
        configDefinedAt = null
      }
      assertMetaValue(configValue, configDefinedAt)
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
      //  - For setting definedAtFile: we could take the definedAtFile of the effect config while appending '(effect)' to definedAtFile.fileExportPathToShowToUser
    }
  })
}

function getComputed(configValueSources: ConfigValueSources, configDefinitions: ConfigDefinitions) {
  const configValuesComputed: ConfigValuesComputed = {}
  objectEntries(configDefinitions).forEach(([configName, configDef]) => {
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

async function findPlusFiles(userRootDir: string, outDirRoot: string, isDev: boolean): Promise<FilePathResolved[]> {
  const files = await crawlPlusFiles(userRootDir, outDirRoot, isDev)

  const plusFiles: FilePathResolved[] = files.map(({ filePathAbsoluteUserRootDir }) =>
    getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
  )

  return plusFiles
}

function getConfigName(filePath: string): string | null {
  assertPosixPath(filePath)
  if (isTemporaryBuildFile(filePath)) return null
  const fileName = path.posix.basename(filePath)
  // assertNoUnexpectedPlusSign(filePath, fileName)
  const basename = fileName.split('.')[0]!
  if (!basename.startsWith('+')) {
    return null
  } else {
    const configName = basename.slice(1)
    assertUsage(configName !== '', `${filePath} Invalid filename ${fileName}`)
    return configName
  }
}
/* https://github.com/vikejs/vike/issues/1407
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
*/

function handleUnknownConfig(configName: string, configNames: string[], filePathToShowToUser: string) {
  {
    const ui = ['vike-react', 'vike-vue', 'vike-solid'] as const
    const knownVikeExntensionConfigs = {
      description: ui,
      favicon: ui,
      Head: ui,
      Layout: ui,
      onCreateApp: ['vike-vue'],
      title: ui,
      ssr: ui,
      stream: ui,
      Wrapper: ui
    } as const
    if (configName in knownVikeExntensionConfigs) {
      const requiredVikeExtension = knownVikeExntensionConfigs[configName as keyof typeof knownVikeExntensionConfigs]
      assertUsage(
        false,
        [
          `${filePathToShowToUser} uses the config ${pc.cyan(configName)} (https://vike.dev/${configName})`,
          `which requires the Vike extension ${requiredVikeExtension.map((e) => pc.bold(e)).join('/')}.`,
          `Make sure to install the Vike extension,`,
          `and make sure it applies to ${filePathToShowToUser} as explained at https://vike.dev/extends#inheritance.`
        ].join(' ')
      )
    }
  }

  let errMsg = `${filePathToShowToUser} sets an unknown config ${pc.cyan(configName)}`
  let configNameSimilar: string | null = null
  if (configName === 'page') {
    configNameSimilar = 'Page'
  } else {
    configNameSimilar = getMostSimilar(configName, configNames)
  }
  if (configNameSimilar) {
    assert(configNameSimilar !== configName)
    errMsg += `, did you mean to set ${pc.cyan(configNameSimilar)} instead?`
    if (configName === 'page') {
      errMsg += ` (The name of the config ${pc.cyan('Page')} starts with a capital letter ${pc.cyan(
        'P'
      )} because it usually defines a UI component: a ubiquitous JavaScript convention is to start the name of UI components with a capital letter.)`
    }
  }
  assertUsage(false, errMsg)
}

function determineRouteFilesystem(locationId: LocationId, configValueSources: ConfigValueSources) {
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
      const { filesystemRoutingRootEffect /*, filesystemRoutingRootConfigDefinedAt*/ } = routingRoot
      const debugInfo = { locationId, routeFilesystem: filesystemRouteString, configFilesystemRoutingRoot }
      assert(filesystemRouteString.startsWith(filesystemRoutingRootEffect.before), debugInfo)
      filesystemRouteString = applyFilesystemRoutingRootEffect(filesystemRouteString, filesystemRoutingRootEffect)
      // filesystemRouteDefinedBy = `${filesystemRouteDefinedBy} (with ${filesystemRoutingRootConfigDefinedAt})`
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
  assert(configFilesystemRoutingRoot.configEnv.config)
  // Eagerly loaded since it's config-only
  assert('value' in configFilesystemRoutingRoot)
  const { value } = configFilesystemRoutingRoot
  const configDefinedAt = getConfigDefinedAt('Config', configName, configFilesystemRoutingRoot.definedAtFilePath)
  assertUsage(typeof value === 'string', `${configDefinedAt} should be a string`)
  assertUsage(
    value.startsWith('/'),
    `${configDefinedAt} is ${pc.cyan(value)} but it should start with a leading slash ${pc.cyan('/')}`
  )
  const { filePathAbsoluteUserRootDir } = configFilesystemRoutingRoot.definedAtFilePath
  assert(filePathAbsoluteUserRootDir)
  const before = getFilesystemRouteString(getLocationId(filePathAbsoluteUserRootDir))
  const after = value
  const filesystemRoutingRootEffect = { before, after }
  return { filesystemRoutingRootEffect, filesystemRoutingRootConfigDefinedAt: configDefinedAt }
}
function determineIsErrorPage(routeFilesystem: string) {
  assertPosixPath(routeFilesystem)
  return routeFilesystem.split('/').includes('_error')
}

function isVikeConfigFile(filePath: string): boolean {
  return !!getConfigName(filePath)
}

function getConfigValues(
  configValueSources: ConfigValueSources,
  configValuesComputed: ConfigValuesComputed,
  configDefinitions: ConfigDefinitions
): ConfigValues {
  const configValues: ConfigValues = {}
  Object.entries(configValuesComputed).forEach(([configName, configValueComputed]) => {
    configValues[configName] = {
      type: 'computed',
      value: configValueComputed.value,
      definedAtData: null
    }
  })
  Object.entries(configValueSources).forEach(([configName, sources]) => {
    const configDef = configDefinitions[configName]
    assert(configDef)
    if (!configDef.cumulative) {
      const configValueSource = sources[0]!
      if ('value' in configValueSource) {
        configValues[configName] = {
          type: 'standard',
          value: configValueSource.value,
          definedAtData: getDefinedAtFile(configValueSource)
        }
      }
    } else {
      const value = mergeCumulative(configName, sources)
      const definedAtData = sources.map((source) => getDefinedAtFile(source))
      assert(value.length === definedAtData.length)
      configValues[configName] = {
        type: 'cumulative',
        value,
        definedAtData
      }
    }
  })
  return configValues
}
function getDefinedAtFile(configValueSource: ConfigValueSource): DefinedAtFile {
  return {
    filePathToShowToUser: configValueSource.definedAtFilePath.filePathToShowToUser,
    fileExportPathToShowToUser: configValueSource.definedAtFilePath.fileExportPathToShowToUser
  }
}

function mergeCumulative(configName: string, configValueSources: ConfigValueSource[]): unknown[] {
  const configValues: unknown[] = []
  configValueSources.forEach((configValueSource) => {
    // We could, in principle, also support cumulative for values that aren't loaded at config-time but it isn't completely trivial to implement.
    assert('value' in configValueSource)

    // Make sure configValueSource.value is serializable
    assertConfigValueIsSerializable(configValueSource.value, configName, getDefinedAtFile(configValueSource))

    const { value } = configValueSource
    configValues.push(value)
  })

  return configValues
}

function getConfigEnvValue(val: unknown, errMsgIntro: `${string} to`): ConfigEnvInternal {
  const errInvalidValue = `${errMsgIntro} an invalid value ${pc.cyan(JSON.stringify(val))}`

  // Legacy outdated values
  // TODO/v1-release: remove
  if (typeof val === 'string') {
    const valConverted: ConfigEnvInternal = (() => {
      if (val === 'client-only') return { client: true }
      if (val === 'server-only') return { server: true }
      if (val === 'server-and-client') return { server: true, client: true }
      if (val === 'config-only') return { config: true }
      if (val === '_routing-lazy') return { server: true, client: 'if-client-routing' }
      if (val === '_routing-eager') return { server: true, client: 'if-client-routing', eager: true }
      assertUsage(false, errInvalidValue)
    })()
    assertWarning(
      false,
      `${errMsgIntro} ${pc.cyan(val)} which is deprecated and will be removed in the next major release`,
      { onlyOnce: true }
    )
    return valConverted
  }

  assertUsage(isObject(val), `${errMsgIntro} an invalid type ${pc.cyan(typeof val)}`)

  assertKeys(val, ['config', 'server', 'client'] as const, `${errInvalidValue}:`)
  assertUsage(hasProp(val, 'config', 'undefined') || hasProp(val, 'config', 'boolean'), errInvalidValue)
  assertUsage(hasProp(val, 'server', 'undefined') || hasProp(val, 'server', 'boolean'), errInvalidValue)
  assertUsage(hasProp(val, 'client', 'undefined') || hasProp(val, 'client', 'boolean'), errInvalidValue)
  /* Uncomment to allow users to set an eager config. Same for `{ client: 'if-client-routing' }`.
  assertUsage(hasProp(val, 'eager', 'undefined') || hasProp(val, 'eager', 'boolean'), errInvalidValue)
  */

  return val
}

function getConfigDefinition(configDefinitions: ConfigDefinitions, configName: string, filePathToShowToUser: string) {
  const configDef = configDefinitions[configName]
  assertConfigExists(configName, Object.keys(configDefinitions), filePathToShowToUser)
  assert(configDef)
  return configDef
}
function getConfigDefinitionOptional(configDefinitions: ConfigDefinitions, configName: string) {
  return configDefinitions[configName] ?? null
}
function isConfigEnv(configDef: ConfigDefinitionInternal, configName: string): boolean {
  const configEnv = configDef.env
  if (configDef.cumulative) {
    // In principle we could lift that requirement (but it requires non-trivial modifications)
    assertUsage(
      configEnv.config,
      `Config ${pc.cyan(configName)} needs its ${pc.cyan('env')} to have ${pc.cyan(
        '{ config: true }'
      )} (because ${pc.cyan(configName)} is a ${pc.cyan('cumulative')} config)`
    )
  }
  return !!configEnv.config
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

function sortConfigValueSources(
  configValueSources: ConfigValueSources,
  locationIdPage: LocationId
): ConfigValueSources {
  return Object.fromEntries(
    Object.entries(configValueSources)
      // Make order deterministic (no other purpose)
      .sort(([, [source1]], [, [source2]]) =>
        source1!.definedAtFilePath.filePathAbsoluteVite < source2!.definedAtFilePath.filePathAbsoluteVite ? -1 : 1
      )
      // Sort after whether the config value was defined by an npm package
      .sort(
        makeFirst(([, [source]]) => {
          const { importPathAbsolute } = source!.definedAtFilePath
          return (
            !!importPathAbsolute &&
            isNpmPackageImport(importPathAbsolute, {
              // Vike config files don't support path aliases. (If they do one day, then Vike will/should be able to resolve path aliases.)
              cannotBePathAlias: true
            })
          )
        })
      )
      // Sort after the filesystem inheritance of the config value
      .sort(([, [source1]], [, [source2]]) =>
        reverse(sortAfterInheritanceOrder(source1!.locationId, source2!.locationId, locationIdPage))
      )
  )
}
