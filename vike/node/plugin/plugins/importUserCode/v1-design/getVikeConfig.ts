export { getVikeConfig }
export { getVikeConfig2 }
export { reloadVikeConfig }
export { vikeConfigDependencies }
export { isVikeConfigFile }
export { isV1Design }
export { getConfVal }
export { getConfigDefinitionOptional }
export type { VikeConfigObject }
export type { PlusFileValue }
export type { PlusFile }
export type { PlusFilesByLocationId }

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
  reverse,
  unique,
  isCallable
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
import type { Config } from '../../../../../shared/page-configs/Config.js'
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
import { type EsbuildCache, isTemporaryBuildFile } from './getVikeConfig/transpileAndExecuteFile.js'
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
  loadConfigFile,
  loadPointerImport,
  loadValueFile,
  type PointerImportLoaded
} from './getVikeConfig/loadFileAtConfigTime.js'
import { resolvePointerImport } from './getVikeConfig/resolvePointerImport.js'
import { getFilePathResolved } from '../../../shared/getFilePath.js'
import type { FilePath, FilePathResolved } from '../../../../../shared/page-configs/FilePath.js'
import { getConfigValueBuildTime } from '../../../../../shared/page-configs/getConfigValueBuildTime.js'
import { assertExtensionsRequire, assertExtensionsConventions } from './assertExtensions.js'
import { getPageConfigUserFriendlyNew } from '../../../../../shared/page-configs/getPageConfigUserFriendly.js'
import { getConfigValuesBase } from '../../../../../shared/page-configs/serialize/serializeConfigValues.js'

assertIsNotProductionRuntime()

type PlusFile = PlusFileConfig | PlusFileValue
type PlusFileCommons = {
  locationId: LocationId
  filePath: FilePathResolved
}
// +config.js
type PlusFileConfig = PlusFileCommons & {
  isConfigFile: true
  fileExportsByConfigName: Record<
    string, // configName
    unknown // configValue
  >
  pointerImportsByConfigName: Record<
    string, // configName
    PointerImportLoaded
  >
  isExtensionConfig: boolean
  extendsFilePaths: string[]
  // TypeScript convenience
  isNotLoaded?: undefined
}
// +{configName}.js
type PlusFileValue = PlusFileCommons & {
  isConfigFile: false
  configName: string
} & (
    | {
        isNotLoaded: false
        fileExportsByConfigName: Record<
          string, // configName
          unknown // configValue
        >
      }
    | {
        isNotLoaded: true
      }
  ) & {
    // TypeScript convenience
    isExtensionConfig?: undefined
  }
type PlusFilesByLocationId = Record<LocationId, PlusFile[]>

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

async function getPlusFilesAll(userRootDir: string, esbuildCache: EsbuildCache): Promise<PlusFilesByLocationId> {
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

  let plusFilesAll: PlusFilesByLocationId = {}

  await Promise.all([
    // Config files
    ...configFiles.map(async (filePath) => {
      const { filePathAbsoluteUserRootDir } = filePath
      assert(filePathAbsoluteUserRootDir)
      const { configFile, extendsConfigs } = await loadConfigFile(filePath, userRootDir, [], false, esbuildCache)
      assert(filePath.filePathAbsoluteUserRootDir)
      const locationId = getLocationId(filePathAbsoluteUserRootDir)
      const plusFile = getPlusFileFromConfigFile(configFile, false, locationId, userRootDir)

      plusFilesAll[locationId] = plusFilesAll[locationId] ?? []
      plusFilesAll[locationId]!.push(plusFile)
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
        const plusFile = getPlusFileFromConfigFile(extendsConfig, true, locationId, userRootDir)
        assertExtensionsConventions(plusFile)
        plusFilesAll[locationId]!.push(plusFile)
      })
    }),
    // Value files
    ...valueFiles.map(async (filePath) => {
      const { filePathAbsoluteUserRootDir } = filePath
      assert(filePathAbsoluteUserRootDir)

      const configName = getConfigName(filePathAbsoluteUserRootDir)
      assert(configName)

      const locationId = getLocationId(filePathAbsoluteUserRootDir)

      const plusFile: PlusFileValue = {
        locationId,
        filePath,
        isConfigFile: false,
        isNotLoaded: true,
        configName
      }
      plusFilesAll[locationId] = plusFilesAll[locationId] ?? []
      plusFilesAll[locationId]!.push(plusFile)

      // We don't have access to the custom config definitions defined by the user yet.
      //  - If `configDef` is `undefined` => we load the file +{configName}.js later.
      //  - We already need to load +meta.js here (to get the custom config definitions defined by the user)
      await loadValueFile(plusFile, configDefinitionsBuiltInAll, userRootDir, esbuildCache)
    })
  ])

  assertKnownConfigs(plusFilesAll)

  // Make lists element order deterministic
  Object.entries(plusFilesAll).forEach(([_locationId, plusFiles]) => {
    plusFiles.sort(sortMakeDeterministic)
  })

  return plusFilesAll
}
function getPlusFileFromConfigFile(
  configFile: ConfigFile,
  isExtensionConfig: boolean,
  locationId: LocationId,
  userRootDir: string
): PlusFile {
  const { fileExports, filePath, extendsFilePaths } = configFile

  const fileExportsByConfigName: PlusFileConfig['fileExportsByConfigName'] = {}
  const pointerImportsByConfigName: PlusFileConfig['pointerImportsByConfigName'] = {}
  const fileExport = getConfigFileExport(fileExports, filePath.filePathToShowToUser)
  Object.entries(fileExport).forEach(([configName, configValue]) => {
    fileExportsByConfigName[configName] = configValue
    const pointerImport = resolvePointerImport(configValue, configFile.filePath, userRootDir, configName)
    if (pointerImport) {
      pointerImportsByConfigName[configName] = {
        ...pointerImport,
        fileExportValueLoaded: false
      }
    }
  })

  const plusFile: PlusFileConfig = {
    locationId,
    filePath,
    fileExportsByConfigName,
    pointerImportsByConfigName,
    isConfigFile: true,
    isExtensionConfig,
    extendsFilePaths
  }
  return plusFile
}
// Make order deterministic (no other purpose)
function sortMakeDeterministic(plusFile1: PlusFile, plusFile2: PlusFile): 0 | -1 | 1 {
  return plusFile1.filePath.filePathAbsoluteVite < plusFile2.filePath.filePathAbsoluteVite ? -1 : 1
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
  const esbuildCache: EsbuildCache = {}

  const plusFilesAll = await getPlusFilesAll(userRootDir, esbuildCache)

  const configDefinitionsResolved = await resolveConfigDefinitions(plusFilesAll, userRootDir, esbuildCache)

  const { pageConfigGlobal, pageConfigs } = getPageConfigs(configDefinitionsResolved, plusFilesAll, userRootDir)

  // interop vike(options) in vite.config.js
  temp_interopVikeVitePlugin(pageConfigGlobal, vikeVitePluginOptions, userRootDir)

  // global
  const configValues = getConfigValues(pageConfigGlobal)
  const global = getPageConfigUserFriendlyNew({ configValues })

  return { pageConfigs, pageConfigGlobal, global }
}
async function resolveConfigDefinitions(
  plusFilesAll: PlusFilesByLocationId,
  userRootDir: string,
  esbuildCache: EsbuildCache
) {
  const configDefinitionsGlobal = getConfigDefinitions(
    // We use `plusFilesAll` in order to allow local Vike extensions to create global configs.
    plusFilesAll, // TODO/now sort
    (configDef) => !!configDef.global
  )
  await loadCustomConfigBuildTimeFiles(plusFilesAll, configDefinitionsGlobal, userRootDir, esbuildCache)

  const configDefinitionsLocal: Record<
    LocationId,
    {
      configDefinitions: ConfigDefinitions
      // plusFiles that live at locationId
      plusFiles: PlusFile[]
      // plusFiles that influence locationId
      plusFilesRelevant: PlusFilesByLocationId
    }
  > = {}
  await Promise.all(
    objectEntries(plusFilesAll).map(async ([locationId, plusFiles]) => {
      const plusFilesRelevant = getPlusFilesRelevant(plusFilesAll, locationId)
      const configDefinitions = getConfigDefinitions(plusFilesRelevant, (configDef) => configDef.global !== true)
      await loadCustomConfigBuildTimeFiles(plusFiles, configDefinitions, userRootDir, esbuildCache)
      configDefinitionsLocal[locationId] = { configDefinitions, plusFiles, plusFilesRelevant }
    })
  )

  const configDefinitionsResolved = {
    configDefinitionsGlobal,
    configDefinitionsLocal
  }
  return configDefinitionsResolved
}
type ConfigDefinitionsResolved = Awaited<ReturnType<typeof resolveConfigDefinitions>>
// Load value files (with `env.config===true`) of *custom* configs.
// - The value files of *built-in* configs are already loaded at `getPlusFilesAll()`.
async function loadCustomConfigBuildTimeFiles(
  plusFiles: PlusFilesByLocationId | PlusFile[],
  configDefinitions: ConfigDefinitions,
  userRootDir: string,
  esbuildCache: EsbuildCache
): Promise<void> {
  const plusFileList: PlusFile[] = Object.values(plusFiles).flat(1)
  await Promise.all(
    plusFileList.map(async (plusFile) => {
      if (!plusFile.isConfigFile) {
        await loadValueFile(plusFile, configDefinitions, userRootDir, esbuildCache)
      } else {
        await Promise.all(
          Object.entries(plusFile.pointerImportsByConfigName).map(async ([configName, pointerImport]) => {
            await loadPointerImport(pointerImport, userRootDir, configName, configDefinitions, esbuildCache)
          })
        )
      }
    })
  )
}
function getPageConfigs(
  configDefinitionsResolved: ConfigDefinitionsResolved,
  plusFilesAll: PlusFilesByLocationId,
  userRootDir: string
) {
  const pageConfigGlobal: PageConfigGlobalBuildTime = {
    configDefinitions: configDefinitionsResolved.configDefinitionsGlobal,
    configValueSources: {}
  }
  objectEntries(configDefinitionsResolved.configDefinitionsGlobal).forEach(([configName, configDef]) => {
    const sources = resolveConfigValueSources(
      configName,
      configDef,
      // We use `plusFilesAll` in order to allow local Vike extensions to set the value of global configs (e.g. `vite`).
      plusFilesAll, // TODO/now check sort order
      userRootDir,
      true,
      getLocationId('/pages/+config.js')
    )
    if (sources.length === 0) return
    pageConfigGlobal.configValueSources[configName] = sources
  })
  assertPageConfigGlobal(pageConfigGlobal, plusFilesAll)

  const pageConfigs: PageConfigBuildTime[] = objectEntries(configDefinitionsResolved.configDefinitionsLocal)
    .filter(([_locationId, { plusFiles }]) => isDefiningPage(plusFiles))
    .map(([locationId, { configDefinitions, plusFilesRelevant }]) => {
      const configDefinitionsLocal = configDefinitions

      const configValueSources: ConfigValueSources = {}
      objectEntries(configDefinitionsLocal)
        .filter(([_configName, configDef]) => configDef.global !== true)
        .forEach(([configName, configDef]) => {
          const sources = resolveConfigValueSources(
            configName,
            configDef,
            plusFilesRelevant,
            userRootDir,
            false,
            locationId
          )
          // sortConfigValueSources(sources, locationId)
          if (sources.length === 0) return
          configValueSources[configName] = sources
        })

      const { routeFilesystem, isErrorPage } = determineRouteFilesystem(locationId, configValueSources)

      applyEffectsAll(configValueSources, configDefinitionsLocal)
      const configValuesComputed = getComputed(configValueSources, configDefinitionsLocal)

      const pageConfig: PageConfigBuildTime = {
        pageId: locationId,
        isErrorPage,
        routeFilesystem,
        configDefinitions: configDefinitionsLocal,
        plusFiles: plusFilesRelevant,
        configValueSources,
        configValuesComputed
      }
      return pageConfig
    })
  assertPageConfigs(pageConfigs)

  return { pageConfigs, pageConfigGlobal }
}
function assertPageConfigGlobal(pageConfigGlobal: PageConfigGlobalBuildTime, plusFilesAll: PlusFilesByLocationId) {
  Object.entries(pageConfigGlobal.configValueSources).forEach(([configName, sources]) => {
    assertGlobalConfigLocation(configName, sources, plusFilesAll, pageConfigGlobal.configDefinitions)
  })
}
function assertGlobalConfigLocation(
  configName: string,
  sources: ConfigValueSource[],
  plusFilesAll: PlusFilesByLocationId,
  configDefinitionsGlobal: ConfigDefinitions
) {
  const locationIdsAll = objectKeys(plusFilesAll)

  // Determine existing global +config.js files
  const configFilePathsGlobal: string[] = []
  const plusFilesGlobal: PlusFile[] = Object.values(
    objectFromEntries(
      objectEntries(plusFilesAll).filter(([locationId]) => isGlobalLocation(locationId, locationIdsAll))
    )
  ).flat()
  plusFilesGlobal
    .filter((i) => i.isConfigFile)
    .forEach((plusFile) => {
      const { filePathAbsoluteUserRootDir } = plusFile.filePath
      if (filePathAbsoluteUserRootDir) {
        configFilePathsGlobal.push(filePathAbsoluteUserRootDir)
      }
    })

  // Call assertWarning()
  sources.forEach((source) => {
    const { plusFile } = source
    // It's `null` when the config is defined by `vike(options)` in vite.config.js
    assert(plusFile)
    const { filePathAbsoluteUserRootDir } = plusFile.filePath

    // Allow local Vike extensions to set gloabl configs (`filePathAbsoluteUserRootDir===null` for Vike extension)
    if (!filePathAbsoluteUserRootDir) return
    assert(!plusFile.isExtensionConfig)

    if (!isGlobalLocation(source.locationId, locationIdsAll)) {
      const configDef = configDefinitionsGlobal[configName]
      assert(configDef)
      const isConditionallyGlobal = isCallable(configDef.global)
      const errBeg =
        `${filePathAbsoluteUserRootDir} (which is a local config file) sets the config ${pc.cyan(configName)}` as const
      const errMid = !isConditionallyGlobal
        ? ("but it's a global config" as const)
        : ('to a value that is global' as const)
      const what = isConditionallyGlobal ? ('global values' as const) : pc.cyan(configName)
      const errEnd =
        configFilePathsGlobal.length > 0
          ? (`define ${what} at a global config file such as ${joinEnglish(configFilePathsGlobal, 'or')} instead` as const)
          : (`create a global config file (e.g. /pages/+config.js) and define ${what} there instead` as const)
      // When updating this error message => also update error message at https://vike.dev/warning/global-config
      const errMsg = `${errBeg} ${errMid}: ${errEnd} (https://vike.dev/warning/global-config).` as const
      assertWarning(false, errMsg, { onlyOnce: true })
    }
  })
}
function assertPageConfigs(pageConfigs: PageConfigBuildTime[]) {
  pageConfigs.forEach((pageConfig) => {
    assertExtensionsRequire(pageConfig)
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
    assert(includes(objectKeys(configDefinitionsBuiltInAll), configName))
    const configDef = configDefinitionsBuiltInAll[configName]
    const sources = (pageConfigGlobal.configValueSources[configName] ??= [])
    sources.push({
      valueIsLoaded: true,
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
      plusFile: null,
      isOverriden: configDef.cumulative ? false : sources.length > 0,
      valueIsImportedAtRuntime: false,
      valueIsDefinedByPlusFile: false
    })
  })
}

function getPlusFilesRelevant(plusFilesAll: PlusFilesByLocationId, locationIdPage: LocationId): PlusFilesByLocationId {
  const plusFilesRelevant = Object.fromEntries(
    objectEntries(plusFilesAll)
      .filter(([locationId]) => {
        return isInherited(locationId, locationIdPage)
      })
      .sort(([locationId1], [locationId2]) => sortAfterInheritanceOrder(locationId1, locationId2, locationIdPage))
  )
  return plusFilesRelevant
}

function resolveConfigValueSources(
  configName: string,
  configDef: ConfigDefinitionInternal,
  plusFilesRelevant: PlusFilesByLocationId,
  userRootDir: string,
  isGlobal: boolean,
  locationId: LocationId
): ConfigValueSource[] {
  const plusFilesOrdered = getPlusFilesOrdered(configName, plusFilesRelevant)

  let sources: ConfigValueSource[] = plusFilesOrdered.map((plusFile, i) => {
    const isHighestInheritancePrecedence = i === 0
    const configValueSource = getConfigValueSource(
      configName,
      plusFile,
      configDef,
      userRootDir,
      isHighestInheritancePrecedence
    )
    return configValueSource
  })
  if (isCallable(configDef.global)) {
    const isGlobalValue = configDef.global
    assert(configDef.env.config)
    sources = sources.filter((source) => {
      assert(source.configEnv.config)
      assert(source.valueIsLoaded)
      const valueIsGlobal = isGlobalValue(source.value)
      return isGlobal ? valueIsGlobal : !valueIsGlobal
    })
  }

  return sources
}
function getPlusFilesOrdered(configName: string, plusFilesRelevant: PlusFilesByLocationId) {
  const plusFilesOrdered: PlusFile[] = []

  // plusFilesRelevant is already sorted:
  //  - By sortAfterInheritanceOrder() at getPlusFilesRelevant()
  //  - By sortMakeDeterministic() at getPlusFilesAll()
  for (const plusFilesByLocationId of Object.values(plusFilesRelevant)) {
    const plusFilesForConfigName = plusFilesByLocationId.filter((plusFile) =>
      getDefiningConfigNames(plusFile).includes(configName)
    )

    // We populate `plusFilesOrdered` with inheritance order.
    const populate = (plusFile: PlusFile) => {
      assert(!visited.has(plusFile))
      visited.add(plusFile)
      plusFilesOrdered.push(plusFile)
    }
    const visited = new WeakSet<PlusFile>()

    // ================
    // User-land config
    // ================
    {
      const plusFilesValue = plusFilesForConfigName.filter(
        (plusFile) =>
          !plusFile.isConfigFile &&
          // We consider side-effect configs (e.g. `export { frontmatter }` of .mdx files) later (i.e. with less priority)
          plusFile.configName === configName
      )
      const plusFilesConfig = plusFilesForConfigName.filter(
        (plusFile) =>
          plusFile.isConfigFile &&
          // We consider extensions (e.g. vike-react) later (i.e. with less priority)
          !plusFile.isExtensionConfig
      )
      // Make this value:
      //   /pages/some-page/+{configName}.js > `export default`
      // override that value:
      //   /pages/some-page/+config.js > `export default { someConfig }`
      const plusFileWinner = plusFilesValue[0] ?? plusFilesConfig[0]
      if (plusFileWinner) {
        const plusFilesOverriden = [...plusFilesValue, ...plusFilesConfig].filter((f) => f !== plusFileWinner)
        // A user-land conflict of plusFiles with the same `locationId` (we are iterating over `plusFilesRelevant: PlusFilesByLocationId`) means that the user has superfluously defined the config twice; the user should remove such redundancy as it makes things unnecessarily ambiguous.
        assertOverwrittenConfigFile(plusFileWinner, plusFilesOverriden, configName)
        ;[plusFileWinner, ...plusFilesOverriden].forEach((plusFile) => {
          populate(plusFile)
        })
      }
    }

    // ===================
    // Side-effect configs (e.g. `export { frontmatter }` of .mdx files).
    // ===================
    // - This only considers side-effect configs that are already loaded at build-time (e.g. it actually doesn't consider `export { frontmatter }` of .mdx files since .mdx files are loaded only at runtime).
    plusFilesForConfigName
      .filter(
        (plusFile) =>
          !plusFile.isConfigFile &&
          // Is side-effect config
          plusFile.configName !== configName
      )
      .forEach((plusFileValueSideEffect) => {
        populate(plusFileValueSideEffect)
      })

    // =================
    // Extensions config
    // =================
    plusFilesForConfigName
      .filter((plusFile) => plusFile.isConfigFile && plusFile.isExtensionConfig)
      // Extension config files are already sorted by inheritance order
      .forEach((plusFile) => {
        populate(plusFile)
      })

    // ======
    // Assert we didn't miss any config.
    // ======
    plusFilesForConfigName.forEach((plusFile) => {
      assert(visited.has(plusFile))
    })
  }

  return plusFilesOrdered
}
function getConfigValueSource(
  configName: string,
  plusFile: PlusFile,
  configDef: ConfigDefinitionInternal,
  userRootDir: string,
  isHighestInheritancePrecedence: boolean
): ConfigValueSource {
  const confVal = getConfVal(plusFile, configName)
  assert(confVal)

  const configValueSourceCommon = {
    locationId: plusFile.locationId,
    plusFile
  }

  const definedAtFilePath_: DefinedAtFilePath = {
    ...plusFile.filePath,
    fileExportPathToShowToUser: ['default', configName]
  }

  const isOverriden = configDef.cumulative ? false : !isHighestInheritancePrecedence

  // +client.js
  if (configDef._valueIsFilePath) {
    let definedAtFilePath: DefinedAtFilePath
    let valueFilePath: string
    if (plusFile.isConfigFile) {
      // Defined over pointer import
      assert(confVal.configValueLoaded)
      const pointerImport = resolvePointerImport(confVal.configValue, plusFile.filePath, userRootDir, configName)
      const configDefinedAt = getConfigDefinedAt('Config', configName, definedAtFilePath_)
      assertUsage(pointerImport, `${configDefinedAt} should be an import`)
      valueFilePath = pointerImport.fileExportPath.filePathAbsoluteVite
      definedAtFilePath = pointerImport.fileExportPath
    } else {
      // Defined by value file, i.e. +{configName}.js
      assert(!plusFile.isConfigFile)
      valueFilePath = plusFile.filePath.filePathAbsoluteVite
      definedAtFilePath = {
        ...plusFile.filePath,
        fileExportPathToShowToUser: []
      }
    }
    const configValueSource: ConfigValueSource = {
      ...configValueSourceCommon,
      valueIsLoaded: true,
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
  if (plusFile.isConfigFile) {
    assert(confVal.configValueLoaded)
    const { configValue } = confVal

    // Defined over pointer import
    const pointerImport = plusFile.pointerImportsByConfigName[configName]
    if (pointerImport) {
      const value = pointerImport.fileExportValueLoaded
        ? {
            valueIsLoaded: true as const,
            value: pointerImport.fileExportValue
          }
        : {
            valueIsLoaded: false as const
          }
      const configValueSource: ConfigValueSource = {
        ...configValueSourceCommon,
        ...value,
        configEnv: resolveConfigEnv(configDef.env, pointerImport.fileExportPath),
        valueIsImportedAtRuntime: true,
        valueIsDefinedByPlusFile: false,
        isOverriden,
        definedAtFilePath: pointerImport.fileExportPath
      }
      return configValueSource
    }

    // Defined inside +config.js
    const configValueSource: ConfigValueSource = {
      ...configValueSourceCommon,
      valueIsLoaded: true,
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
  if (!plusFile.isConfigFile) {
    const configEnvResolved = resolveConfigEnv(configDef.env, plusFile.filePath)
    const valueAlreadyLoaded = confVal.configValueLoaded
    assert(valueAlreadyLoaded === !!configEnvResolved.config)
    const value = valueAlreadyLoaded
      ? {
          valueIsLoaded: true as const,
          value: confVal.configValue
        }
      : {
          valueIsLoaded: false as const
        }
    const configValueSource: ConfigValueSource = {
      ...configValueSourceCommon,
      ...value,
      configEnv: configEnvResolved,
      valueIsImportedAtRuntime: !valueAlreadyLoaded,
      valueIsDefinedByPlusFile: true,
      isOverriden,
      definedAtFilePath: {
        ...plusFile.filePath,
        fileExportPathToShowToUser:
          configName === plusFile.configName
            ? []
            : // Side-effect config (e.g. `export { frontmatter }` of .md files)
              [configName]
      }
    }
    return configValueSource
  }

  assert(false)
}
function assertOverwrittenConfigFile(plusFileWinner: PlusFile, plusFilesOverriden: PlusFile[], configName: string) {
  plusFilesOverriden.forEach((plusFileLoser) => {
    const loserFilePath = plusFileLoser.filePath.filePathToShowToUser
    const winnerFilePath = plusFileWinner.filePath.filePathToShowToUser
    const confName = pc.cyan(configName)
    assertWarning(
      false,
      `The value of the config ${confName} defined at ${loserFilePath} is always overwritten by the value defined at ${winnerFilePath}, remove the superfluous value defined at ${loserFilePath}`,
      { onlyOnce: true }
    )
  })
}
function sortConfigValueSources(sources: ConfigValueSource[], locationIdPage: LocationId): void {
  sources
    // Make order deterministic (no other purpose)
    .sort((source1, source2) =>
      source1!.definedAtFilePath.filePathAbsoluteVite < source2!.definedAtFilePath.filePathAbsoluteVite ? -1 : 1
    )
    // Sort after whether the config value was defined by an npm package
    .sort(
      makeFirst((source) => {
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
    .sort((source1, source2) =>
      reverse(sortAfterInheritanceOrder(source1!.locationId, source2!.locationId, locationIdPage))
    )
}

function isDefiningPage(plusFiles: PlusFile[]): boolean {
  for (const plusFile of plusFiles) {
    const configNames = getDefiningConfigNames(plusFile)
    if (configNames.some((configName) => isDefiningPageConfig(configName))) {
      return true
    }
  }
  return false
}
function isDefiningPageConfig(configName: string): boolean {
  return ['Page', 'route'].includes(configName)
}

function getDefiningConfigNames(plusFile: PlusFile): string[] {
  let configNames: string[] = []
  if (!plusFile.isConfigFile) {
    configNames.push(plusFile.configName)
  }
  if (!plusFile.isNotLoaded) {
    configNames.push(...Object.keys(plusFile.fileExportsByConfigName))
  }
  configNames = unique(configNames)
  return configNames
}

function getConfigDefinitions(
  plusFilesRelevant: PlusFilesByLocationId,
  filter?: (configDef: ConfigDefinitionInternal) => boolean
): ConfigDefinitions {
  let configDefinitions: ConfigDefinitions = { ...configDefinitionsBuiltInAll }

  // Add user-land meta configs
  Object.entries(plusFilesRelevant)
    .reverse()
    .forEach(([_locationId, plusFiles]) => {
      plusFiles.forEach((plusFile) => {
        const confVal = getConfVal(plusFile, 'meta')
        if (!confVal) return
        assert(confVal.configValueLoaded)
        const meta = confVal.configValue
        assertMetaUsage(meta, `Config ${pc.cyan('meta')} defined at ${plusFile.filePath.filePathToShowToUser}`)

        // Set configDef._userEffectDefinedAtFilePath
        Object.entries(meta).forEach(([configName, configDef]) => {
          if (!configDef.effect) return
          assert(plusFile.isConfigFile)
          configDef._userEffectDefinedAtFilePath = {
            ...plusFile.filePath,
            fileExportPathToShowToUser: ['default', 'meta', configName, 'effect']
          }
        })

        objectEntries(meta).forEach(([configName, configDefinitionUserLand]) => {
          // User can override an existing config definition
          configDefinitions[configName] = {
            ...configDefinitions[configName],
            ...configDefinitionUserLand
          }
        })
      })
    })

  if (filter) {
    configDefinitions = Object.fromEntries(
      Object.entries(configDefinitions).filter(([_configName, configDef]) => filter(configDef))
    )
  }

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

// Show error message upon unknown config
function assertKnownConfigs(plusFilesAll: PlusFilesByLocationId) {
  const configDefinitionsAll = getConfigDefinitions(plusFilesAll)
  const configNamesKnownAll = Object.keys(configDefinitionsAll)
  objectEntries(plusFilesAll).forEach(([locationId, plusFiles]) => {
    const plusFilesRelevant = getPlusFilesRelevant(plusFilesAll, locationId)
    const configDefinitionsLocal = getConfigDefinitions(plusFilesRelevant)
    const configNamesKnownLocal = Object.keys(configDefinitionsLocal)
    plusFiles.forEach((plusFile) => {
      const configNames = getDefiningConfigNames(plusFile)
      configNames.forEach((configName) => {
        assertKnownConfig(configName, configNamesKnownAll, configNamesKnownLocal, plusFile)
        assert(configNamesKnownLocal.includes(configName))
        assert(configNamesKnownAll.includes(configName))
      })
    })
  })
}
function assertKnownConfig(
  configName: string,
  configNamesKnownAll: string[],
  configNamesKnownLocal: string[],
  plusFile: PlusFile
): void {
  if (configNamesKnownLocal.includes(configName)) return

  const configNameColored = pc.cyan(configName)
  const {
    locationId,
    filePath: { filePathToShowToUser }
  } = plusFile
  const errMsg = `${filePathToShowToUser} sets an unknown config ${configNameColored}` as const

  // Inheritance issue: config is known but isn't defined at `locationId`
  if (configNamesKnownAll.includes(configName)) {
    assertUsage(
      false,
      `${filePathToShowToUser} sets the value of the config ${configNameColored} which is a custom config that is defined with ${pc.underline('https://vike.dev/meta')} at a path that doesn't apply to ${locationId} — see ${pc.underline('https://vike.dev/config#inheritance')}` as const
    )
  }

  // Missing vike-{react,vue,solid} installation
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
        .map((e) => pc.bold(e))
        .join('/')
      const errMsgEnhanced =
        `${errMsg}. If you want to use the configuration ${configNameColored} documented at ${pc.underline(`https://vike.dev/${configName}`)} then make sure to install ${requiredVikeExtension}. (Alternatively, you can define ${configNameColored} yourself by using ${pc.cyan('meta')}, see ${pc.underline('https://vike.dev/meta')} for more information.)` as const
      assertUsage(false, errMsgEnhanced)
    }
  }

  // Similarity hint
  let configNameSimilar: string | null = null
  if (configName === 'page') {
    configNameSimilar = 'Page'
  } else {
    configNameSimilar = getMostSimilar(configName, configNamesKnownAll)
  }
  if (configNameSimilar) {
    assert(configNameSimilar !== configName)
    let errMsgEnhanced = `${errMsg}. Did you mean ${pc.cyan(configNameSimilar)} instead?` as const
    if (configName === 'page') {
      errMsgEnhanced += ` (The name of the config ${pc.cyan('Page')} starts with a capital letter ${pc.cyan(
        'P'
      )} because it defines a UI component: a ubiquitous JavaScript convention is that the name of UI components start with a capital letter.)` as const
    }
    assertUsage(false, errMsgEnhanced)
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

function getConfigDefinitionOptional(configDefinitions: ConfigDefinitions, configName: string) {
  return configDefinitions[configName] ?? null
}

function getConfVal(
  plusFile: PlusFile,
  configName: string
): null | { configValue: unknown; configValueLoaded: true } | { configValueLoaded: false } {
  const configNames = getDefiningConfigNames(plusFile)
  if (!configNames.includes(configName)) return null
  if (plusFile.isNotLoaded) return { configValueLoaded: false }
  const confVal = { configValue: plusFile.fileExportsByConfigName[configName], configValueLoaded: true }
  return confVal
}

function resolveConfigEnv(configEnv: ConfigEnvInternal, filePath: FilePath) {
  const configEnvResolved = { ...configEnv }

  if (filePath.filePathAbsoluteFilesystem) {
    const { fileName } = filePath
    if (fileName.includes('.server.')) {
      configEnvResolved.server = true
      configEnvResolved.client = false
    } else if (fileName.includes('.client.')) {
      configEnvResolved.client = true
      configEnvResolved.server = false
    } else if (fileName.includes('.shared.')) {
      configEnvResolved.server = true
      configEnvResolved.client = true
    }
  }

  return configEnvResolved
}
