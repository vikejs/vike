export { getVikeConfig }
export { getVikeConfig2 }
export { reloadVikeConfig }
export { vikeConfigDependencies }
export { isVikeConfigFile }
export { isV1Design }
export { getConfigValueInterfaceFile }
export type { VikeConfigObject }
export type { InterfaceValueFile }
export type { InterfaceFile }

import {
  assertPosixPath,
  assert,
  isObject,
  assertUsage,
  assertWarning,
  objectEntries,
  hasProp,
  includes,
  assertIsNotProductionRuntime,
  getMostSimilar,
  joinEnglish,
  lowerFirst,
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
  DefinedAtFilePath,
  ConfigValuesComputed,
  ConfigValues
} from '../../../../../shared/page-configs/PageConfig.js'
import type { Config, ConfigNameGlobal } from '../../../../../shared/page-configs/Config.js'
import {
  configDefinitionsBuiltInAll,
  type ConfigDefinitions,
  type ConfigDefinitionInternal
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
import { crawlPlusFiles } from './getVikeConfig/crawlPlusFiles.js'
import { getConfigFileExport } from './getConfigFileExport.js'
import {
  type ConfigFile,
  ImportedFilesLoaded,
  loadConfigFile,
  loadImportedFile,
  loadValueFile
} from './getVikeConfig/loadFileAtConfigTime.js'
import {
  clearFilesEnvMap,
  resolveConfigEnvWithFileName,
  resolvePointerImportOfConfig
} from './getVikeConfig/resolvePointerImport.js'
import { getFilePathResolved } from '../../../shared/getFilePath.js'
import type { FilePathResolved } from '../../../../../shared/page-configs/FilePath.js'
import { getConfigValueBuildTime } from '../../../../../shared/page-configs/getConfigValueBuildTime.js'
import { assertExtensionsRequire, assertExtensionsConventions } from './assertExtensions.js'
import { getPageConfigUserFriendlyNew } from '../../../../../shared/page-configs/getPageConfigUserFriendly.js'
import { getConfigValuesBase } from '../../../../../shared/page-configs/serialize/serializeConfigValues.js'
const configDefinitionsBuiltIn = getConfigDefinitionsBuiltIn()
const configDefinitionsBuiltInGlobal = getConfigDefinitionsBuiltInGlobal()

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
  global: ReturnType<typeof getPageConfigUserFriendlyNew>
}

let restartVite = false
let wasConfigInvalid: boolean | null = null
let vikeConfigPromise: Promise<VikeConfigObject> | null = null
const vikeConfigDependencies: Set<string> = new Set()
function reloadVikeConfig(config: ResolvedConfig) {
  const userRootDir = config.root
  const vikeVitePluginOptions = config._vikeVitePluginOptions
  assert(vikeVitePluginOptions)
  vikeConfigDependencies.clear()
  clearFilesEnvMap()
  vikeConfigPromise = loadVikeConfig_withErrorHandling(userRootDir, true, vikeVitePluginOptions)
  handleReloadSideEffects()
}
async function handleReloadSideEffects() {
  wasConfigInvalid = !!isConfigInvalid
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
    if (restartVite) {
      restartVite = false
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
  { doNotRestartViteOnError }: { doNotRestartViteOnError?: true } = {}
): Promise<VikeConfigObject> {
  const userRootDir = config.root
  const vikeVitePluginOptions = config._vikeVitePluginOptions
  assert(vikeVitePluginOptions)
  const isDev = config._isDev
  assert(typeof isDev === 'boolean')
  return await getVikeConfigEntry(userRootDir, isDev, vikeVitePluginOptions, doNotRestartViteOnError ?? false)
}
async function getVikeConfig2(userRootDir: string, isDev: boolean, vikeVitePluginOptions: unknown) {
  assert(vikeVitePluginOptions)
  return await getVikeConfigEntry(userRootDir, isDev, vikeVitePluginOptions, false)
}
async function getVikeConfigEntry(
  userRootDir: string,
  isDev: boolean,
  vikeVitePluginOptions: unknown,
  doNotRestartViteOnError: boolean
) {
  if (!vikeConfigPromise) {
    vikeConfigPromise = loadVikeConfig_withErrorHandling(
      userRootDir,
      isDev,
      vikeVitePluginOptions,
      doNotRestartViteOnError
    )
  }
  return await vikeConfigPromise
}

async function isV1Design(config: ResolvedConfig): Promise<boolean> {
  const vikeConfig = await getVikeConfig(config)
  const { pageConfigs } = vikeConfig
  const isV1Design = pageConfigs.length > 0
  return isV1Design
}

async function loadInterfaceFiles(userRootDir: string): Promise<InterfaceFilesByLocationId> {
  const plusFiles = await findPlusFiles(userRootDir, null)
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
        assertExtensionsConventions(interfaceFile)
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
        if (configDef && shouldBeLoadableAtBuildTime(configDef)) {
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
  isDev: boolean,
  vikeVitePluginOptions: unknown,
  doNotRestartViteOnError?: boolean
): Promise<VikeConfigObject> {
  let hasError = false
  let ret: VikeConfigObject | undefined
  let err: unknown
  try {
    ret = await loadVikeConfig(userRootDir, vikeVitePluginOptions)
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
    isConfigInvalid_set({ err })
    if (!isDev) {
      assert(getViteDevServer() === null)
      throw err
    } else {
      logConfigError(err)
      if (!doNotRestartViteOnError) {
        restartVite = true
      }
      const dummyData: VikeConfigObject = {
        pageConfigs: [],
        pageConfigGlobal: {
          configDefinitions: {},
          configValueSources: {}
        },
        global: getPageConfigUserFriendlyNew({ configValues: {} })
      }
      return dummyData
    }
  }
}
async function loadVikeConfig(userRootDir: string, vikeVitePluginOptions: unknown): Promise<VikeConfigObject> {
  const interfaceFilesByLocationId = await loadInterfaceFiles(userRootDir)
  const importedFilesLoaded: ImportedFilesLoaded = {}
  const { pageConfigGlobal, pageConfigs } = await getPageConfigs(
    interfaceFilesByLocationId,
    userRootDir,
    importedFilesLoaded
  )

  // interop vike(options) in vite.config.js
  temp_interopVikeVitePlugin(pageConfigGlobal, vikeVitePluginOptions, userRootDir)

  // global
  const configValues = getConfigValues(pageConfigGlobal)
  const global = getPageConfigUserFriendlyNew({ configValues })

  return { pageConfigs, pageConfigGlobal, global }
}
async function getGlobalConfigs(
  interfaceFilesByLocationId: InterfaceFilesByLocationId,
  userRootDir: string,
  importedFilesLoaded: ImportedFilesLoaded
) {
  /* TODO/now: dedupe
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
  //*/
}
function temp_interopVikeVitePlugin(
  pageConfigGlobal: PageConfigGlobalBuildTime,
  vikeVitePluginOptions: unknown,
  userRootDir: string
) {
  assert(isObject(vikeVitePluginOptions))
  assertWarning(
    Object.keys(vikeVitePluginOptions).length === 0,
    `Define Vike settings in +config.js instead of vite.config.js ${pc.underline('https://vike.dev/migration/settings')}`,
    { onlyOnce: true }
  )
  Object.entries(vikeVitePluginOptions).forEach(([configName, value]) => {
    assert(includes(objectKeys(configDefinitionsBuiltInGlobal), configName))
    const configDef = configDefinitionsBuiltInGlobal[configName]
    const sources = (pageConfigGlobal.configValueSources[configName] ??= [])
    sources.push({
      value,
      configEnv: configDef.env,
      definedAtFilePath: {
        ...getFilePathResolved({
          userRootDir,
          filePathAbsoluteUserRootDir: '/vite.config.js'
        }),
        fileExportPathToShowToUser: null
      },
      locationId: '/' as LocationId,
      interfaceFile: null,
      isOverriden: configDef.cumulative ? false : sources.length > 0,
      valueIsImportedAtRuntime: false,
      valueIsDefinedByPlusFile: false
    })
  })
}
async function getPageConfigs(
  interfaceFilesByLocationId: InterfaceFilesByLocationId,
  userRootDir: string,
  importedFilesLoaded: ImportedFilesLoaded
) {
  const pageConfigs: PageConfigBuildTime[] = await Promise.all(
    objectEntries(interfaceFilesByLocationId)
      .filter(([_locationId, interfaceFiles]) => isDefiningPage(interfaceFiles))
      .map(async ([locationId]) => {
        const interfaceFilesRelevant = getInterfaceFilesRelevant(interfaceFilesByLocationId, locationId)
        const interfaceFilesRelevantList: InterfaceFile[] = Object.values(interfaceFilesRelevant).flat(1)

        assertExtensionsRequire(interfaceFilesRelevantList)

        const configDefinitions = getConfigDefinitions(interfaceFilesRelevant)

        // Load value files of `env.config===true` custom configs
        await Promise.all(
          interfaceFilesRelevantList.map(async (interfaceFile) => {
            if (!interfaceFile.isValueFile) return
            const { configName } = interfaceFile
            if (isGlobalConfig(configName)) return
            const configDef = getConfigDefinition(
              configDefinitions,
              configName,
              interfaceFile.filePath.filePathToShowToUser
            )
            if (!shouldBeLoadableAtBuildTime(configDef)) return
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

        assertUsageGlobalConfigs(interfaceFilesRelevantList, configDefinitions, interfaceFilesByLocationId)

        const pageConfig: PageConfigBuildTime = {
          pageId: locationId,
          isErrorPage,
          routeFilesystem,
          configDefinitions,
          configValueSources,
          configValuesComputed
        }
        return pageConfig
      })
  )
  assertPageConfigs(pageConfigs)

  const pageConfigGlobal: PageConfigGlobalBuildTime = {
    configDefinitions: configDefinitionsBuiltInGlobal,
    configValueSources: {}
  }
  const locationIds = objectKeys(interfaceFilesByLocationId)
  const interfaceFilesGlobal = objectFromEntries(
    objectEntries(interfaceFilesByLocationId).filter(([locationId]) => {
      return isGlobalLocation(locationId, locationIds)
    })
  )
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
      pageConfigGlobal.configValueSources[configName] = sources
    })
  )

  return { pageConfigs, pageConfigGlobal }
}

function getConfigValues(pageConfig: PageConfigBuildTime | PageConfigGlobalBuildTime) {
  const configValues: ConfigValues = {}
  getConfigValuesBase(pageConfig, (configEnv: ConfigEnvInternal) => !!configEnv.config, null).forEach((entry) => {
    if (entry.configValueBase.type === 'computed') {
      assert('value' in entry) // Help TS
      const { configValueBase, value, configName } = entry
      configValues[configName] = { ...configValueBase, value }
    }
    if (entry.configValueBase.type === 'standard') {
      assert('sourceRelevant' in entry) // Help TS
      const { configValueBase, sourceRelevant, configName } = entry
      assert('value' in sourceRelevant)
      const { value } = sourceRelevant
      configValues[configName] = { ...configValueBase, value }
    }
    if (entry.configValueBase.type === 'cumulative') {
      assert('sourcesRelevant' in entry) // Help TS
      const { configValueBase, sourcesRelevant, configName } = entry
      const values: unknown[] = []
      sourcesRelevant.forEach((source) => {
        assert('value' in source)
        values.push(source.value)
      })
      configValues[configName] = { ...configValueBase, value: values }
    }
  })
  return configValues
}

// TODO/now: refactor
//  - Dedupe: most of the assertUsageGlobalConfigs() code below is a copy-paste of the assertUsage() logic inside getGlobalConfigs()
//    - This assertUsage() message is slightly better: use this one for getGlobalConfigs()
// Global configs should be defined at global locations
function assertUsageGlobalConfigs(
  interfaceFilesRelevantList: InterfaceFile[],
  configDefinitions: ConfigDefinitions,
  interfaceFilesByLocationId: InterfaceFilesByLocationId
) {
  interfaceFilesRelevantList.forEach((interfaceFile) => {
    const configNames: string[] = []
    if (interfaceFile.isValueFile) {
      configNames.push(interfaceFile.configName)
    } else {
      configNames.push(...Object.keys(interfaceFile.fileExportsByConfigName))
    }
    configNames.forEach((configName) => {
      if (isGlobalConfig(configName)) return
      const configDef = getConfigDefinition(configDefinitions, configName, interfaceFile.filePath.filePathToShowToUser)
      if (configDef.global === true) {
        const locationIds = objectKeys(interfaceFilesByLocationId)
        if (!isGlobalLocation(interfaceFile.locationId, locationIds)) {
          const interfaceFilesGlobal = objectFromEntries(
            objectEntries(interfaceFilesByLocationId).filter(([locationId]) => {
              return isGlobalLocation(locationId, locationIds)
            })
          )
          const configFilesGlobal: string[] = []
          objectEntries(interfaceFilesGlobal).forEach(([locationId, interfaceFiles]) => {
            assert(isGlobalLocation(locationId, locationIds))
            interfaceFiles.forEach((interfaceFile) => {
              if (!interfaceFile.isConfigFile) return
              const {
                filePath: { filePathAbsoluteUserRootDir }
              } = interfaceFile
              if (filePathAbsoluteUserRootDir) {
                configFilesGlobal.push(filePathAbsoluteUserRootDir)
              }
            })
          })
          assertUsage(
            false,
            [
              `${interfaceFile.filePath.filePathToShowToUser} sets the config ${pc.cyan(
                configName
              )} but it's a global config:`,
              configFilesGlobal.length > 0
                ? `define ${pc.cyan(configName)} at ${joinEnglish(configFilesGlobal, 'or')} instead.`
                : `create a global config (e.g. /pages/+config.js) and define ${pc.cyan(configName)} there instead.`
            ].join(' ')
          )
        }
      }
    })
  })
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
  const isClientRouting = getConfigValueBuildTime(pageConfig, 'clientRouting', 'boolean')
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
      const isHighestInheritancePrecedence = sourcesInfo.length === 0
      sourcesInfo.push([
        configName,
        interfaceFile,
        configDef,
        userRootDir,
        importedFilesLoaded,
        isHighestInheritancePrecedence
      ])
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
  importedFilesLoaded: ImportedFilesLoaded,
  isHighestInheritancePrecedence: boolean
): Promise<ConfigValueSource> {
  const conf = interfaceFile.fileExportsByConfigName[configName]
  assert(conf)

  const configValueSourceCommon = {
    locationId: interfaceFile.locationId,
    interfaceFile
  }

  const definedAtFilePath_: DefinedAtFilePath = {
    ...interfaceFile.filePath,
    fileExportPathToShowToUser: ['default', configName]
  }

  const isOverriden = configDef.cumulative ? false : !isHighestInheritancePrecedence

  // +client.js
  if (configDef._valueIsFilePath) {
    let definedAtFilePath: DefinedAtFilePath
    let valueFilePath: string
    if (interfaceFile.isConfigFile) {
      // Defined over pointer import
      const resolved = resolvePointerImportOfConfig(
        conf.configValue,
        interfaceFile.filePath,
        userRootDir,
        configDef.env,
        configName
      )
      const configDefinedAt = getConfigDefinedAt('Config', configName, definedAtFilePath_)
      assertUsage(resolved, `${configDefinedAt} should be an import`)
      valueFilePath = resolved.pointerImport.filePathAbsoluteVite
      definedAtFilePath = resolved.pointerImport
    } else {
      // Defined by value file, i.e. +{configName}.js
      assert(interfaceFile.isValueFile)
      valueFilePath = interfaceFile.filePath.filePathAbsoluteVite
      definedAtFilePath = {
        ...interfaceFile.filePath,
        fileExportPathToShowToUser: []
      }
    }
    const configValueSource: ConfigValueSource = {
      ...configValueSourceCommon,
      value: valueFilePath,
      valueIsFilePath: true,
      configEnv: configDef.env,
      valueIsImportedAtRuntime: true,
      valueIsDefinedByPlusFile: false,
      isOverriden,
      definedAtFilePath
    }
    return configValueSource
  }

  // +config.js
  if (interfaceFile.isConfigFile) {
    assert('configValue' in conf)
    const { configValue } = conf

    // Defined over pointer import
    const resolved = resolvePointerImportOfConfig(
      configValue,
      interfaceFile.filePath,
      userRootDir,
      configDef.env,
      configName
    )
    if (resolved) {
      const configValueSource: ConfigValueSource = {
        ...configValueSourceCommon,
        configEnv: resolved.configEnvResolved,
        valueIsImportedAtRuntime: true,
        valueIsDefinedByPlusFile: false,
        isOverriden,
        definedAtFilePath: resolved.pointerImport
      }
      // Load pointer import
      if (
        shouldBeLoadableAtBuildTime(configDef) &&
        // The value of `extends` was already loaded and already used: we don't need the value of `extends` anymore
        configName !== 'extends'
      ) {
        if (resolved.pointerImport.filePathAbsoluteFilesystem) {
          const fileExport = await loadImportedFile(resolved.pointerImport, userRootDir, importedFilesLoaded)
          configValueSource.value = fileExport
        } else {
          const configDefinedAt = getConfigDefinedAt('Config', configName, configValueSource.definedAtFilePath)
          assertUsage(!configDef.cumulative, `${configDefinedAt} cannot be defined over an aliased import`)
        }
      }

      return configValueSource
    }

    // Defined inside +config.js
    const configValueSource: ConfigValueSource = {
      ...configValueSourceCommon,
      value: configValue,
      configEnv: configDef.env,
      valueIsImportedAtRuntime: false,
      valueIsDefinedByPlusFile: false,
      isOverriden,
      definedAtFilePath: definedAtFilePath_
    }
    return configValueSource
  }

  // Defined by value file, i.e. +{configName}.js
  if (interfaceFile.isValueFile) {
    const configEnvResolved = resolveConfigEnvWithFileName(configDef.env, interfaceFile.filePath)
    const valueAlreadyLoaded = 'configValue' in conf
    assert(valueAlreadyLoaded === !!configEnvResolved.config)
    const configValueSource: ConfigValueSource = {
      ...configValueSourceCommon,
      configEnv: configEnvResolved,
      valueIsImportedAtRuntime: !valueAlreadyLoaded,
      valueIsDefinedByPlusFile: true,
      isOverriden,
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
        assertMetaUsage(meta, `Config ${pc.cyan('meta')} defined at ${interfaceFile.filePath.filePathToShowToUser}`)

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

function assertMetaUsage(
  metaVal: unknown,
  metaConfigDefinedAt: `Config meta defined at ${string}` | null
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
      let configDefinedAt: Parameters<typeof assertMetaUsage>[1]
      if (configDefEffect._userEffectDefinedAtFilePath) {
        configDefinedAt = getConfigDefinedAt('Config', configName, configDefEffect._userEffectDefinedAtFilePath)
      } else {
        configDefinedAt = null
      }
      assertMetaUsage(configValue, configDefinedAt)
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
      /* To implement being able to set a config value in an effect:
       * - Copy and append definedAtFile.fileExportPathToShowToUser with ['meta', configName, 'effect']
       *   - Copying the definedAtFile of the config that defines the effect
       * - Same precedence as the config that sets the value triggering the effect (not the config defining the effect)
       *   - Apply sortConfigValueSources() again?
      configValueSources.push()
      */
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

async function findPlusFiles(userRootDir: string, outDirRoot: null | string): Promise<FilePathResolved[]> {
  const files = await crawlPlusFiles(userRootDir, outDirRoot)

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
  const configNameColored = pc.cyan(configName)
  let errMsg = `${filePathToShowToUser} sets an unknown config ${configNameColored}.` as const

  // vike-{react,vue,solid} hint
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
          errMsg,
          `If you want to use the configuration documented at https://vike.dev/${configName} then make sure to install the Vike extension ${requiredVikeExtension
            .map((e) => pc.bold(e))
            .join('/')}.`,
          `Also make sure it applies to ${filePathToShowToUser} (see https://vike.dev/extends#inheritance).`,
          `Alternatively, if you don't want to use the aforementioned Vike extension, define it yourself by using ${pc.cyan(
            'meta'
          )} (https://vike.dev/meta).`
        ].join(' ')
      )
    }
  }

  // Similarity hint
  let configNameSimilar: string | null = null
  if (configName === 'page') {
    configNameSimilar = 'Page'
  } else {
    configNameSimilar = getMostSimilar(configName, configNames)
  }
  if (configNameSimilar) {
    assert(configNameSimilar !== configName)
    errMsg += ` Did you mean to set ${pc.cyan(configNameSimilar)} instead?`
    if (configName === 'page') {
      errMsg += ` (The name of the config ${pc.cyan('Page')} starts with a capital letter ${pc.cyan(
        'P'
      )} because it defines a UI component: a ubiquitous JavaScript convention is that the name of UI components start with a capital letter.)`
    }
  }

  // `meta` hint
  if (!configNameSimilar) {
    errMsg += ` Make sure to define ${configNameColored} by using ${pc.cyan(
      'meta'
    )} (https://vike.dev/meta), and also make sure the meta configuration applies to ${filePathToShowToUser} (see https://vike.dev/config#inheritance).`
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

function getConfigEnvValue(
  val: unknown,
  errMsgIntro: `Config meta defined at ${string} sets meta.${
    string // configName
  }.env to`
): ConfigEnvInternal {
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
  /* To allow users to set an eager config:
   * - Uncomment line below.
   * - Add 'eager' to assertKeys() call above.
   * - Add `eager: boolean` to ConfigEnv type.
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
function shouldBeLoadableAtBuildTime(configDef: ConfigDefinitionInternal): boolean {
  return !!configDef.env.config && !configDef._valueIsFilePath
}
function isGlobalConfig(configName: string): configName is ConfigNameGlobal {
  // TODO/now
  if (configName === 'prerender') return false
  const configNamesGlobal = getConfigNamesGlobal()
  return includes(configNamesGlobal, configName)
}
/*
// TODO/now
function isGlobalConfig(configName: string, configDefinitions: ConfigDefinitions): configName is ConfigNameGlobal {
  const configSpec = configDefinitions[configName]
  assert(configSpec)
  const globalValue = configSpec.global
  if (!globalValue) return false
  if (globalValue === true ) return true
  return globalValue(value)
}
*/
function getConfigNamesGlobal() {
  return Object.keys(configDefinitionsBuiltInGlobal)
}
function getConfigDefinitionsBuiltInGlobal() {
  return objectFromEntries(
    objectEntries(configDefinitionsBuiltInAll).filter(([_configName, configDef]) => configDef.global !== undefined)
  )
}
function getConfigDefinitionsBuiltIn() {
  return objectFromEntries(
    objectEntries(configDefinitionsBuiltInAll).filter(([_configName, configDef]) => configDef.global !== true)
  )
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

function getConfigValueInterfaceFile(interfaceFile: InterfaceFile, configName: string): unknown {
  return interfaceFile.fileExportsByConfigName[configName]?.configValue
}
