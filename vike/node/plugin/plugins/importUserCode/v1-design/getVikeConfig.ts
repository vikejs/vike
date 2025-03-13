export { getVikeConfig }
export { getVikeConfigOptional }
export { getVikeConfig2 }
export { reloadVikeConfig }
export { isV1Design }
export { getConfVal }
export { getConfigDefinitionOptional }
export { isOverriden }
export type { VikeConfigObject }

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
  assertKeys,
  objectKeys,
  objectFromEntries,
  unique,
  isCallable,
  makeFirst,
  lowerFirst,
  makeLast,
  type SortReturn,
  assertIsSingleModuleInstance
} from '../../../utils.js'
import type {
  PageConfigGlobalBuildTime,
  ConfigEnvInternal,
  ConfigValueSource,
  ConfigValueSources,
  PageConfigBuildTime,
  DefinedAtFilePath,
  ConfigValuesComputed,
  ConfigValues,
  PageConfigRoute,
  DefinedBy
} from '../../../../../shared/page-configs/PageConfig.js'
import type { Config } from '../../../../../shared/page-configs/Config.js'
import {
  configDefinitionsBuiltIn,
  type ConfigDefinitions,
  type ConfigDefinitionInternal,
  type ConfigDefinition
} from './getVikeConfig/configDefinitionsBuiltIn.js'
import {
  type LocationId,
  getLocationId,
  getFilesystemRouteString,
  getFilesystemRouteDefinedBy,
  isInherited,
  sortAfterInheritanceOrder,
  applyFilesystemRoutingRootEffect
} from './getVikeConfig/filesystemRouting.js'
import type { EsbuildCache } from './getVikeConfig/transpileAndExecuteFile.js'
import { isVikeConfigInvalid, isVikeConfigInvalid_set } from '../../../../runtime/renderPage/isVikeConfigInvalid.js'
import { getViteDevServer } from '../../../../runtime/globalContext.js'
import { logConfigError, logConfigErrorRecover } from '../../../shared/loggerNotProd.js'
import {
  removeSuperfluousViteLog_enable,
  removeSuperfluousViteLog_disable
} from '../../../shared/loggerVite/removeSuperfluousViteLog.js'
import pc from '@brillout/picocolors'
import { getConfigDefinedAt, getDefinedByString } from '../../../../../shared/page-configs/getConfigDefinedAt.js'
import type { ResolvedConfig, UserConfig } from 'vite'
import { loadPointerImport, loadValueFile } from './getVikeConfig/loadFileAtConfigTime.js'
import { resolvePointerImport } from './getVikeConfig/resolvePointerImport.js'
import { getFilePathResolved } from '../../../shared/getFilePath.js'
import type { FilePath } from '../../../../../shared/page-configs/FilePath.js'
import { getConfigValueBuildTime } from '../../../../../shared/page-configs/getConfigValueBuildTime.js'
import { assertExtensionsRequire } from './getVikeConfig/assertExtensions.js'
import {
  getPageConfigGlobalUserFriendly,
  getPageConfigUserFriendly,
  type PageConfigUserFriendly,
  type PageConfigsUserFriendly
} from '../../../../../shared/page-configs/getPageConfigUserFriendly.js'
import { getConfigValuesBase, isJsonValue } from '../../../../../shared/page-configs/serialize/serializeConfigValues.js'
import { getPlusFilesAll, type PlusFile, type PlusFilesByLocationId } from './getVikeConfig/getPlusFilesAll.js'
import { getEnvVarObject } from '../../../shared/getEnvVarObject.js'
import { getApiOperation } from '../../../../api/context.js'
import { getCliOptions } from '../../../../cli/context.js'
assertIsNotProductionRuntime()
assertIsSingleModuleInstance('v1-design/getVikeConfig.ts')
let restartVite = false
let wasConfigInvalid: boolean | null = null
let vikeConfigPromise: Promise<VikeConfigObject> | null = null

type VikeConfigObject = {
  pageConfigs: PageConfigBuildTime[]
  pageConfigGlobal: PageConfigGlobalBuildTime
  global: PageConfigUserFriendly
  pages: PageConfigsUserFriendly
  vikeConfigDependencies: Set<string>
}

function reloadVikeConfig(config: ResolvedConfig) {
  const userRootDir = config.root
  const vikeVitePluginOptions = config._vikeVitePluginOptions
  assert(vikeVitePluginOptions)
  vikeConfigPromise = loadVikeConfig_withErrorHandling(userRootDir, true, vikeVitePluginOptions)
  handleReloadSideEffects()
}
async function handleReloadSideEffects() {
  wasConfigInvalid = !!isVikeConfigInvalid
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
  if (!isVikeConfigInvalid) {
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
// TODO/soon: predominantly use getVikeConfigPublic() instead of getVikeConfig() then maybe refector?
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
async function getVikeConfig2(
  userRootDir: string,
  isDev: boolean,
  vikeVitePluginOptions: unknown
): Promise<VikeConfigObject> {
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
async function getVikeConfigOptional(): Promise<null | VikeConfigObject> {
  if (!vikeConfigPromise) return null
  return await vikeConfigPromise
}

function isV1Design(config: ResolvedConfig | UserConfig): boolean {
  const vikeConfig = config._vikeConfigObject
  assert(vikeConfig)
  const { pageConfigs } = vikeConfig
  const isV1Design = pageConfigs.length > 0
  return isV1Design
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
    isVikeConfigInvalid_set(false)
    return ret
  } else {
    assert(ret === undefined)
    assert(err)
    isVikeConfigInvalid_set({ err })
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
        global: getPageConfigGlobalUserFriendly({ pageConfigGlobalValues: {} }),
        pages: {},
        vikeConfigDependencies: new Set()
      }
      return dummyData
    }
  }
}
async function loadVikeConfig(userRootDir: string, vikeVitePluginOptions: unknown): Promise<VikeConfigObject> {
  const esbuildCache: EsbuildCache = {
    transpileCache: {},
    vikeConfigDependencies: new Set()
  }

  const plusFilesAll = await getPlusFilesAll(userRootDir, esbuildCache)

  const configDefinitionsResolved = await resolveConfigDefinitions(plusFilesAll, userRootDir, esbuildCache)

  const { pageConfigGlobal, pageConfigs } = getPageConfigsBuildTime(
    configDefinitionsResolved,
    plusFilesAll,
    userRootDir
  )

  // Backwards compatibility for vike(options) in vite.config.js
  temp_interopVikeVitePlugin(pageConfigGlobal, vikeVitePluginOptions, userRootDir)

  setCliAndApiOptions(pageConfigGlobal, configDefinitionsResolved)

  // global
  const pageConfigGlobalValues = getConfigValues(pageConfigGlobal)
  const global = getPageConfigGlobalUserFriendly({ pageConfigGlobalValues })

  // pages
  const pages = objectFromEntries(
    pageConfigs.map((pageConfig) => {
      const pageConfigValues = getConfigValues(pageConfig, true)
      return getPageConfigUserFriendly(pageConfigGlobalValues, pageConfig, pageConfigValues)
    })
  )

  return { pageConfigs, pageConfigGlobal, global, pages, vikeConfigDependencies: esbuildCache.vikeConfigDependencies }
}
type ConfigDefinitionsResolved = Awaited<ReturnType<typeof resolveConfigDefinitions>>
async function resolveConfigDefinitions(
  plusFilesAll: PlusFilesByLocationId,
  userRootDir: string,
  esbuildCache: EsbuildCache
) {
  const plusFilesAllOrdered = Object.values(plusFilesAll)
    .flat()
    .sort((plusFile1, plusFile2) => sortAfterInheritanceOrderGlobal(plusFile1, plusFile2, plusFilesAll, null))
  const configDefinitionsGlobal = getConfigDefinitions(
    // We use `plusFilesAll` in order to allow local Vike extensions to create global configs, and to set the value of global configs such as `+vite` (enabling Vike extensions to add Vite plugins).
    plusFilesAllOrdered,
    (configDef) => !!configDef.global
  )
  await loadCustomConfigBuildTimeFiles(plusFilesAll, configDefinitionsGlobal, userRootDir, esbuildCache)

  const configDefinitionsAll = getConfigDefinitions(Object.values(plusFilesAll).flat())
  const configNamesKnownAll = Object.keys(configDefinitionsAll)
  const configNamesKnownGlobal = Object.keys(configDefinitionsGlobal)
  assert(configNamesKnownGlobal.every((configName) => configNamesKnownAll.includes(configName)))

  const configDefinitionsLocal: Record<
    LocationId,
    {
      configDefinitions: ConfigDefinitions
      // plusFiles that live at locationId
      plusFiles: PlusFile[]
      // plusFiles that influence locationId
      plusFilesRelevant: PlusFile[]
      configNamesKnownLocal: string[]
    }
  > = {}
  await Promise.all(
    objectEntries(plusFilesAll).map(async ([locationIdPage, plusFiles]) => {
      const plusFilesRelevant: PlusFile[] = objectEntries(plusFilesAll)
        .filter(([locationId]) => isInherited(locationId, locationIdPage))
        .map(([, plusFiles]) => plusFiles)
        .flat()
        .sort((plusFile1, plusFile2) => sortAfterInheritanceOrderPage(plusFile1, plusFile2, locationIdPage, null))
      const configDefinitions = getConfigDefinitions(plusFilesRelevant, (configDef) => configDef.global !== true)
      await loadCustomConfigBuildTimeFiles(plusFiles, configDefinitions, userRootDir, esbuildCache)
      const configNamesKnownLocal = unique([...Object.keys(configDefinitions), ...configNamesKnownGlobal])
      assert(configNamesKnownLocal.every((configName) => configNamesKnownAll.includes(configName)))
      configDefinitionsLocal[locationIdPage] = {
        configDefinitions,
        plusFiles,
        plusFilesRelevant,
        configNamesKnownLocal
      }
    })
  )

  const configDefinitionsResolved = {
    configDefinitionsGlobal,
    configDefinitionsLocal,
    configDefinitionsAll,
    configNamesKnownAll,
    configNamesKnownGlobal
  }

  assertKnownConfigs(configDefinitionsResolved)

  return configDefinitionsResolved
}
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
function getPageConfigsBuildTime(
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
      // We use `plusFilesAll` in order to allow local Vike extensions to create global configs, and to set the value of global configs such as `+vite` (enabling Vike extensions to add Vite plugins).
      Object.values(plusFilesAll).flat(),
      userRootDir,
      true,
      plusFilesAll
    )
    if (sources.length === 0) return
    pageConfigGlobal.configValueSources[configName] = sources
  })
  applyEffectsMetaEnv(pageConfigGlobal.configValueSources, configDefinitionsResolved.configDefinitionsGlobal)
  applyEffectsConfVal(
    pageConfigGlobal.configValueSources,
    configDefinitionsResolved.configDefinitionsGlobal,
    plusFilesAll
  )
  sortConfigValueSources(pageConfigGlobal.configValueSources, null)
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
            plusFilesAll
          )
          if (sources.length === 0) return
          configValueSources[configName] = sources
        })

      const pageConfigRoute = determineRouteFilesystem(locationId, configValueSources)

      applyEffectsMetaEnv(configValueSources, configDefinitionsLocal)
      applyEffectsConfVal(configValueSources, configDefinitionsLocal, plusFilesAll)
      sortConfigValueSources(configValueSources, locationId)

      const configValuesComputed = getComputed(configValueSources, configDefinitionsLocal)

      const pageConfig: PageConfigBuildTime = {
        pageId: locationId,
        ...pageConfigRoute,
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
  // Determine existing global +config.js files
  const configFilePathsGlobal: string[] = []
  const plusFilesGlobal: PlusFile[] = Object.values(
    objectFromEntries(objectEntries(plusFilesAll).filter(([locationId]) => isGlobalLocation(locationId, plusFilesAll)))
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

    if (!isGlobalLocation(source.locationId, plusFilesAll)) {
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

function getConfigValues(pageConfig: PageConfigBuildTime | PageConfigGlobalBuildTime, tolerateMissingValue?: true) {
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
      if (!sourceRelevant.valueIsLoaded) {
        if (tolerateMissingValue) return
        assert(false)
      }
      const { value } = sourceRelevant
      configValues[configName] = { ...configValueBase, value }
    }
    if (entry.configValueBase.type === 'cumulative') {
      assert('sourcesRelevant' in entry) // Help TS
      const { configValueBase, sourcesRelevant, configName } = entry
      const values: unknown[] = []
      sourcesRelevant.forEach((source) => {
        if (!source.valueIsLoaded) {
          if (tolerateMissingValue) return
          assert(false)
        }
        values.push(source.value)
      })
      if (values.length === 0) {
        if (tolerateMissingValue) return
        assert(false)
      }
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
    const sources = (pageConfigGlobal.configValueSources[configName] ??= [])
    sources.push(
      getSourceNonConfigFile(configName, value, {
        ...getFilePathResolved({
          userRootDir,
          filePathAbsoluteUserRootDir: '/vite.config.js'
        }),
        fileExportPathToShowToUser: null
      })
    )
  })
}
function setCliAndApiOptions(
  pageConfigGlobal: PageConfigGlobalBuildTime,
  configDefinitionsResolved: ConfigDefinitionsResolved
) {
  // Vike API — passed options [lowest precedence]
  const apiOperation = getApiOperation()
  if (apiOperation?.options.vikeConfig) {
    addSources(
      apiOperation.options.vikeConfig as Record<string, unknown>,
      { definedBy: 'api', operation: apiOperation.operation },
      false
    )
  }

  // Vike CLI options
  const cliOptions = getCliOptions()
  if (cliOptions) {
    addSources(cliOptions, { definedBy: 'cli' }, true)
  }

  // VIKE_CONFIG [highest precedence]
  const configFromEnv = getEnvVarObject('VIKE_CONFIG')
  if (configFromEnv) {
    addSources(configFromEnv, { definedBy: 'env' }, false)
  }

  return

  function addSources(configValues: Record<string, unknown>, definedBy: DefinedBy, exitOnError: boolean) {
    Object.entries(configValues).forEach(([configName, value]) => {
      const sourceName = `The ${getDefinedByString(definedBy, configName)}` as const
      assertKnownConfig(
        configName,
        configDefinitionsResolved.configNamesKnownGlobal,
        configDefinitionsResolved,
        '/' as LocationId,
        sourceName,
        exitOnError
      )
      const sources = (pageConfigGlobal.configValueSources[configName] ??= [])
      sources.unshift(getSourceNonConfigFile(configName, value, definedBy))
    })
  }
}

function getSourceNonConfigFile(
  configName: string,
  value: unknown,
  definedAt: DefinedAtFilePath | DefinedBy
): ConfigValueSource {
  assert(includes(objectKeys(configDefinitionsBuiltIn), configName))
  const configDef = configDefinitionsBuiltIn[configName]
  const source: ConfigValueSource = {
    valueIsLoaded: true,
    value,
    configEnv: configDef.env,
    definedAt,
    locationId: '/' as LocationId,
    plusFile: null,
    valueIsLoadedWithImport: false,
    valueIsDefinedByPlusValueFile: false
  }
  return source
}

function sortConfigValueSources(configValueSources: ConfigValueSources, locationIdPage: LocationId | null) {
  Object.entries(configValueSources).forEach(([configName, sources]) => {
    sources
      .sort((source1, source2) => {
        if (!source1.plusFile || !source2.plusFile) return 0
        const isGlobal = !locationIdPage
        if (isGlobal) {
          return sortAfterInheritanceOrderGlobal(source1.plusFile, source2.plusFile, null, configName)
        } else {
          return sortAfterInheritanceOrderPage(source1.plusFile, source2.plusFile, locationIdPage, configName)
        }
      })
      // TODO/next-major: remove
      // Interop with vike(options) in vite.config.js — make it least precedence.
      .sort(makeLast((source) => !source.plusFile))
  })
}
function sortAfterInheritanceOrderPage(
  plusFile1: PlusFile,
  plusFile2: PlusFile,
  locationIdPage: LocationId,
  configName: string | null
): SortReturn {
  {
    const ret = sortAfterInheritanceOrder(plusFile1.locationId, plusFile2.locationId, locationIdPage)
    if (ret !== 0) return ret
    assert(plusFile1.locationId === plusFile2.locationId)
  }
  if (configName) {
    const ret = sortPlusFilesSameLocationId(plusFile1, plusFile2, configName)
    if (ret !== 0) return ret
  }
  return 0
}
function sortAfterInheritanceOrderGlobal(
  plusFile1: PlusFile,
  plusFile2: PlusFile,
  plusFilesAll: PlusFilesByLocationId | null,
  configName: string | null
): SortReturn {
  if (plusFilesAll) {
    const ret = makeFirst((plusFile: PlusFile) => isGlobalLocation(plusFile.locationId, plusFilesAll))(
      plusFile1,
      plusFile2
    )
    if (ret !== 0) return ret
  }
  {
    const ret = lowerFirst((plusFile: PlusFile) => plusFile.locationId.split('/').length)(plusFile1, plusFile2)
    if (ret !== 0) return ret
  }
  if (plusFile1.locationId !== plusFile2.locationId) {
    // Same as `sort()` in `['some', 'string', 'array'].sort()`
    return plusFile1.locationId > plusFile2.locationId ? 1 : -1
  }
  if (configName) {
    assert(plusFile1.locationId === plusFile2.locationId)
    const ret = sortPlusFilesSameLocationId(plusFile1, plusFile2, configName)
    if (ret !== 0) return ret
  }
  return 0
}
function sortPlusFilesSameLocationId(plusFile1: PlusFile, plusFile2: PlusFile, configName: string): SortReturn {
  assert(plusFile1.locationId === plusFile2.locationId)
  assert(isDefiningConfig(plusFile1, configName))
  assert(isDefiningConfig(plusFile2, configName))

  // Config set by extensions (lowest precedence)
  {
    const ret = makeLast((plusFile: PlusFile) => !!plusFile.isExtensionConfig)(plusFile1, plusFile2)
    if (ret !== 0) return ret
  }

  // Config set by side-export (lower precedence)
  {
    // - For example `export { frontmatter }` of `.mdx` files.
    // - This only considers side-export configs that are already loaded at build-time. (E.g. it actually doesn't consider `export { frontmatter }` of .mdx files since .mdx files are loaded only at runtime.)
    const ret = makeLast(
      (plusFile: PlusFile) =>
        !plusFile.isConfigFile &&
        // Is side-export
        plusFile.configName !== configName
    )(plusFile1, plusFile2)
    if (ret !== 0) return ret
  }

  // Config set by +config.js
  {
    const ret = makeLast((plusFile: PlusFile) => plusFile.isConfigFile)(plusFile1, plusFile2)
    if (ret !== 0) return ret
  }

  // Config set by +{configName}.js (highest precedence)
  // No need to make it deterministic: the overall order is arleady deterministic, see sortMakeDeterministic() at getPlusFilesAll()
  return 0
}

function resolveConfigValueSources(
  configName: string,
  configDef: ConfigDefinitionInternal,
  plusFilesRelevant: PlusFile[],
  userRootDir: string,
  isGlobal: boolean,
  plusFilesAll: PlusFilesByLocationId
): ConfigValueSource[] {
  let sources: ConfigValueSource[] = plusFilesRelevant
    .filter((plusFile) => isDefiningConfig(plusFile, configName))
    .map((plusFile) => getConfigValueSource(configName, plusFile, configDef, userRootDir))

  // Filter hydrid global-local configs
  if (!isCallable(configDef.global)) {
    // Already filtered
    assert((configDef.global ?? false) === isGlobal)
  } else {
    // We cannot filter earlier
    assert(configDef.env.config)
    sources = sources.filter((source) => {
      assert(source.configEnv.config)
      assert(source.valueIsLoaded)
      const valueIsGlobal = resolveIsGlobalValue(configDef.global, source, plusFilesAll)
      return isGlobal ? valueIsGlobal : !valueIsGlobal
    })
  }

  return sources
}
function isDefiningConfig(plusFile: PlusFile, configName: string) {
  return getConfigNamesSetByPlusFile(plusFile).includes(configName)
}
function getConfigValueSource(
  configName: string,
  plusFile: PlusFile,
  configDef: ConfigDefinitionInternal,
  userRootDir: string
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

  // +client.js
  if (configDef._valueIsFilePath) {
    let definedAtFilePath: DefinedAtFilePath
    let valueFilePath: string
    if (plusFile.isConfigFile) {
      // Defined over pointer import
      assert(confVal.valueIsLoaded)
      const pointerImport = resolvePointerImport(confVal.value, plusFile.filePath, userRootDir, configName)
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
      valueIsLoadedWithImport: false,
      valueIsDefinedByPlusValueFile: false,
      definedAt: definedAtFilePath
    }
    return configValueSource
  }

  // +config.js
  if (plusFile.isConfigFile) {
    assert(confVal.valueIsLoaded)

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
        valueIsLoadedWithImport: true,
        valueIsDefinedByPlusValueFile: false,
        definedAt: pointerImport.fileExportPath
      }
      return configValueSource
    }

    // Defined inside +config.js
    const configValueSource: ConfigValueSource = {
      ...configValueSourceCommon,
      valueIsLoaded: true,
      value: confVal.value,
      configEnv: configDef.env,
      valueIsLoadedWithImport: false,
      valueIsDefinedByPlusValueFile: false,
      definedAt: definedAtFilePath_
    }
    return configValueSource
  }

  // Defined by value file, i.e. +{configName}.js
  if (!plusFile.isConfigFile) {
    const configEnvResolved = resolveConfigEnv(configDef.env, plusFile.filePath)
    assert(confVal.valueIsLoaded === !!configEnvResolved.config)
    const configValueSource: ConfigValueSource = {
      ...configValueSourceCommon,
      ...confVal,
      configEnv: configEnvResolved,
      valueIsLoadedWithImport: !confVal.valueIsLoaded || !isJsonValue(confVal.value),
      valueIsDefinedByPlusValueFile: true,
      definedAt: {
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
function isDefiningPage(plusFiles: PlusFile[]): boolean {
  for (const plusFile of plusFiles) {
    const configNames = getConfigNamesSetByPlusFile(plusFile)
    if (configNames.some((configName) => isDefiningPageConfig(configName))) {
      return true
    }
  }
  return false
}
function isDefiningPageConfig(configName: string): boolean {
  return ['Page', 'route'].includes(configName)
}
function resolveIsGlobalValue(
  configDefGlobal: ConfigDefinition['global'],
  source: ConfigValueSource,
  plusFilesAll: PlusFilesByLocationId
) {
  assert(source.valueIsLoaded)
  let isGlobal: boolean
  if (isCallable(configDefGlobal))
    isGlobal = configDefGlobal(source.value, {
      isGlobalLocation: isGlobalLocation(source.locationId, plusFilesAll)
    })
  else isGlobal = configDefGlobal ?? false
  assert(typeof isGlobal === 'boolean')
  return isGlobal
}

function getConfigNamesSetByPlusFile(plusFile: PlusFile): string[] {
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
  plusFilesRelevant: PlusFile[],
  filter?: (configDef: ConfigDefinitionInternal) => boolean
): ConfigDefinitions {
  let configDefinitions: ConfigDefinitions = { ...configDefinitionsBuiltIn }

  // Add user-land meta configs
  plusFilesRelevant
    .slice()
    .reverse()
    .forEach((plusFile) => {
      const confVal = getConfVal(plusFile, 'meta')
      if (!confVal) return
      assert(confVal.valueIsLoaded)
      const meta = confVal.value
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

// Test: https://github.com/vikejs/vike/blob/441a37c4c1a3b07bb8f6efb1d1f7be297a53974a/test/playground/vite.config.ts#L39
function applyEffectsConfVal(
  configValueSources: ConfigValueSources,
  configDefinitions: ConfigDefinitions,
  plusFilesAll: PlusFilesByLocationId
) {
  objectEntries(configDefinitions).forEach(([configNameEffect, configDefEffect]) => {
    const sourceEffect = configValueSources[configNameEffect]?.[0]
    if (!sourceEffect) return
    const effect = runEffect(configNameEffect, configDefEffect, sourceEffect)
    if (!effect) return
    const configModFromEffect = effect
    applyEffectConfVal(
      configModFromEffect,
      sourceEffect,
      configValueSources,
      configNameEffect,
      configDefEffect,
      configDefinitions,
      plusFilesAll
    )
  })
}
// Test: https://github.com/vikejs/vike/blob/441a37c4c1a3b07bb8f6efb1d1f7be297a53974a/test/playground/pages/config-meta/effect/e2e-test.ts#L16
function applyEffectsMetaEnv(configValueSources: ConfigValueSources, configDefinitions: ConfigDefinitions) {
  objectEntries(configDefinitions).forEach(([configNameEffect, configDefEffect]) => {
    const sourceEffect = configValueSources[configNameEffect]?.[0]
    if (!sourceEffect) return
    const effect = runEffect(configNameEffect, configDefEffect, sourceEffect)
    if (!effect) return
    const configModFromEffect = effect
    applyEffectMetaEnv(configModFromEffect, configValueSources, configDefEffect)
  })
}
function runEffect(configName: string, configDef: ConfigDefinitionInternal, source: ConfigValueSource) {
  if (!configDef.effect) return null
  // The value needs to be loaded at config time, that's why we only support effect for configs that are config-only for now.
  assertUsage(
    configDef.env.config,
    [
      `Cannot add meta.effect to ${pc.cyan(configName)} because its meta.env is ${pc.cyan(
        JSON.stringify(configDef.env)
      )} but an effect can only be added to a config that has a meta.env with ${pc.cyan('{ config: true }')}.`
    ].join(' ')
  )
  assert(source.valueIsLoaded)
  // Call effect
  const configModFromEffect = configDef.effect({
    configValue: source.value,
    configDefinedAt: getConfigDefinedAt('Config', configName, source.definedAt)
  })
  if (!configModFromEffect) return null
  return configModFromEffect
}
function applyEffectConfVal(
  configModFromEffect: Config,
  sourceEffect: ConfigValueSource,
  configValueSources: ConfigValueSources,
  configNameEffect: string,
  configDefEffect: ConfigDefinitionInternal,
  configDefinitions: ConfigDefinitions,
  plusFilesAll: PlusFilesByLocationId
) {
  objectEntries(configModFromEffect).forEach(([configNameTarget, configValue]) => {
    if (configNameTarget === 'meta') return
    const configDef = configDefinitions[configNameTarget]
    assert(configDef)
    assert(configDefEffect._userEffectDefinedAtFilePath)
    const configValueSource: ConfigValueSource = {
      definedAt: configDefEffect._userEffectDefinedAtFilePath!,
      plusFile: sourceEffect.plusFile,
      locationId: sourceEffect.locationId,
      configEnv: configDef.env,
      valueIsLoadedWithImport: false,
      valueIsDefinedByPlusValueFile: false,
      valueIsLoaded: true,
      value: configValue
    }
    assert(sourceEffect.valueIsLoaded)
    const isValueGlobalSource = resolveIsGlobalValue(configDefEffect.global, sourceEffect, plusFilesAll)
    const isValueGlobalTarget = resolveIsGlobalValue(configDef.global, configValueSource, plusFilesAll)
    const isGlobalHumanReadable = (isGlobal: boolean) => `${isGlobal ? 'non-' : ''}global` as const
    // The error message make it sound like it's an inherent limitation, it actually isn't (both ways can make senses).
    assertUsage(
      isValueGlobalSource === isValueGlobalTarget,
      `The configuration ${pc.cyan(configNameEffect)} is set to ${pc.cyan(JSON.stringify(sourceEffect.value))} which is considered ${isGlobalHumanReadable(isValueGlobalSource)}. However, it has a meta.effect that sets the configuration ${pc.cyan(configNameTarget)} to ${pc.cyan(JSON.stringify(configValue))} which is considered ${isGlobalHumanReadable(isValueGlobalTarget)}. This is contradictory: make sure the values are either both non-global or both global.`
    )
    configValueSources[configNameTarget] ??= []
    configValueSources[configNameTarget].push(configValueSource)
  })
}
function applyEffectMetaEnv(
  configModFromEffect: Config,
  configValueSources: ConfigValueSources,
  configDefEffect: ConfigDefinitionInternal
) {
  const notSupported =
    `${pc.cyan('meta.effect')} currently only supports setting the value of a config, or modifying the ${pc.cyan('meta.env')} of a config.` as const
  objectEntries(configModFromEffect).forEach(([configNameTarget, configValue]) => {
    if (configNameTarget !== 'meta') return
    let configDefinedAt: Parameters<typeof assertMetaUsage>[1]
    if (configDefEffect._userEffectDefinedAtFilePath) {
      configDefinedAt = getConfigDefinedAt('Config', configNameTarget, configDefEffect._userEffectDefinedAtFilePath)
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

// Show error message upon unknown config
function assertKnownConfigs(configDefinitionsResolved: ConfigDefinitionsResolved) {
  objectEntries(configDefinitionsResolved.configDefinitionsLocal).forEach(
    ([_locationId, { configNamesKnownLocal, plusFiles }]) => {
      plusFiles.forEach((plusFile) => {
        const configNames = getConfigNamesSetByPlusFile(plusFile)
        configNames.forEach((configName) => {
          const { locationId } = plusFile
          const sourceName = plusFile.filePath.filePathToShowToUser
          assertKnownConfig(configName, configNamesKnownLocal, configDefinitionsResolved, locationId, sourceName, false)
        })
      })
    }
  )
}
function assertKnownConfig(
  configName: string,
  configNamesKnownRelevant: string[],
  configDefinitionsResolved: ConfigDefinitionsResolved,
  locationId: LocationId,
  sourceName: string,
  exitOnError: boolean
): void {
  const { configNamesKnownAll } = configDefinitionsResolved

  if (configNamesKnownRelevant.includes(configName)) {
    assert(configNamesKnownAll.includes(configName))
    return
  }

  const configNameColored = pc.cyan(configName)

  // Inheritance issue: config is known but isn't defined at `locationId`
  if (configNamesKnownAll.includes(configName)) {
    assertUsage(
      false,
      `${sourceName} sets the value of the config ${configNameColored} which is a custom config that is defined with ${pc.underline('https://vike.dev/meta')} at a path that doesn't apply to ${locationId} — see ${pc.underline('https://vike.dev/config#inheritance')}` as const,
      { exitOnError }
    )
  }

  const errMsg = `${sourceName} sets an unknown config ${configNameColored}` as const

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
      const requiredVikeExtension = joinEnglish(
        knownVikeExntensionConfigs[configName as keyof typeof knownVikeExntensionConfigs].map((e) => pc.bold(e)),
        'or'
      )
      const errMsgEnhanced =
        `${errMsg}. If you want to use the configuration ${configNameColored} documented at ${pc.underline(`https://vike.dev/${configName}`)} then make sure to install ${requiredVikeExtension}. (Alternatively, you can define ${configNameColored} yourself by using ${pc.cyan('meta')}, see ${pc.underline('https://vike.dev/meta')} for more information.)` as const
      assertUsage(false, errMsgEnhanced, { exitOnError })
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
    assertUsage(false, errMsgEnhanced, { exitOnError })
  }

  assertUsage(false, errMsg, { exitOnError })
}

function determineRouteFilesystem(locationId: LocationId, configValueSources: ConfigValueSources): PageConfigRoute {
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
    definedAtLocation: filesystemRouteDefinedBy
  }
  return { routeFilesystem, isErrorPage: undefined }
}
function getFilesystemRoutingRootEffect(
  configFilesystemRoutingRoot: ConfigValueSource,
  configName: 'filesystemRoutingRoot'
) {
  assert(configFilesystemRoutingRoot.configEnv.config)
  // Eagerly loaded since it's config-only
  assert(configFilesystemRoutingRoot.valueIsLoaded)
  const { value } = configFilesystemRoutingRoot
  const configDefinedAt = getConfigDefinedAt('Config', configName, configFilesystemRoutingRoot.definedAt)
  assertUsage(typeof value === 'string', `${configDefinedAt} should be a string`)
  assertUsage(
    value.startsWith('/'),
    `${configDefinedAt} is ${pc.cyan(value)} but it should start with a leading slash ${pc.cyan('/')}`
  )
  const { definedAt } = configFilesystemRoutingRoot
  assert(!definedAt.definedBy)
  const { filePathAbsoluteUserRootDir } = definedAt
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
): null | { value: unknown; valueIsLoaded: true } | { valueIsLoaded: false } {
  const configNames = getConfigNamesSetByPlusFile(plusFile)
  if (!configNames.includes(configName)) return null
  if (plusFile.isNotLoaded) return { valueIsLoaded: false }
  const confVal = { value: plusFile.fileExportsByConfigName[configName], valueIsLoaded: true }
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

/** Whether configs defined in `locationId` apply to every page */
function isGlobalLocation(locationId: LocationId, plusFilesAll: PlusFilesByLocationId): boolean {
  const locationIdsPage = objectEntries(plusFilesAll)
    .filter(([_locationId, plusFiles]) => isDefiningPage(plusFiles))
    .map(([locationId]) => locationId)
  return locationIdsPage.every((locId) => isInherited(locationId, locId))
}

function isOverriden(
  source: ConfigValueSource,
  configName: string,
  pageConfig: PageConfigBuildTime | PageConfigGlobalBuildTime
): boolean {
  const configDef = pageConfig.configDefinitions[configName]
  assert(configDef)
  if (configDef.cumulative) return false
  const sources = pageConfig.configValueSources[configName]
  assert(sources)
  const idx = sources.indexOf(source)
  assert(idx >= 0)
  return idx > 0
}
