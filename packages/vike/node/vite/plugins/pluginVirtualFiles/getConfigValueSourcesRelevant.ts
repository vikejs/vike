export { getConfigValueSourcesRelevant }
export { getConfigValueSourceRelevantAnyEnv }
export { isRuntimeEnvMatch }
export { isConfigSourceValueNull }
export type { RuntimeEnv }

import type {
  ConfigEnvInternal,
  ConfigValueSource,
  PageConfigBuildTime,
  PageConfigGlobalBuildTime,
} from '../../../../types/PageConfig.js'
import { assert, assertIsNotBrowser } from '../../utils.js'

assertIsNotBrowser()

type RuntimeEnv = { isForClientSide: boolean; isClientRouting: boolean; isDev?: boolean } | { isForConfig: true }

type PageConfigPartial = Pick<
  PageConfigBuildTime | PageConfigGlobalBuildTime,
  'configValueSources' | 'configDefinitions'
>
function getConfigValueSourcesRelevant(
  configName: string,
  runtimeEnv: RuntimeEnv,
  pageConfig: PageConfigPartial,
): ConfigValueSource[] {
  const configDef = pageConfig.configDefinitions[configName]
  assert(configDef)

  let sourcesRelevant = pageConfig.configValueSources[configName]
  if (!sourcesRelevant) return []

  // Ignore configs with value `undefined`
  sourcesRelevant = sourcesRelevant.filter((source) => !isConfigSourceValueUndefined(source))

  // Environment filtering
  sourcesRelevant = sourcesRelevant.filter((source) => isRuntimeEnvMatch(source.configEnv, runtimeEnv))

  // Overriding - non-cumulative configs
  if (!configDef.cumulative && sourcesRelevant.length > 1) {
    const source = sourcesRelevant[0]
    assert(source)
    sourcesRelevant = [source]
  }

  // Overriding - cumulative configs
  if (configDef.cumulative && sourcesRelevant.length > 0) {
    sourcesRelevant = applyFilenameSuffix(sourcesRelevant)
  }

  return sourcesRelevant
}

function getConfigValueSourceRelevantAnyEnv(
  configName: string,
  pageConfig: PageConfigPartial,
): null | ConfigValueSource {
  const configDef = pageConfig.configDefinitions[configName]
  assert(configDef)
  assert(!configDef.cumulative) // So far, this function is only used by non-cumulative configs

  let sourcesRelevant = pageConfig.configValueSources[configName]
  if (!sourcesRelevant) return null

  // Ignore configs with value `undefined`
  sourcesRelevant = sourcesRelevant.filter((source) => !isConfigSourceValueUndefined(source))

  const source = sourcesRelevant[0]
  if (!source) return null

  if (isConfigSourceValueNull(source)) return null

  return source
}

function isRuntimeEnvMatch(configEnv: ConfigEnvInternal, runtimeEnv: RuntimeEnv): boolean {
  if ('isForConfig' in runtimeEnv) return !!configEnv.config

  // Runtime
  if (!runtimeEnv.isForClientSide) {
    if (!configEnv.server) return false
  } else {
    if (!configEnv.client) return false
    if (configEnv.client === 'if-client-routing' && !runtimeEnv.isClientRouting) return false
  }

  // Production/development
  if (configEnv.production !== undefined) {
    assert(typeof configEnv.production === 'boolean')
    assert(typeof runtimeEnv.isDev === 'boolean')
    if (configEnv.production) {
      if (runtimeEnv.isDev) return false
    } else {
      if (!runtimeEnv.isDev) return false
    }
  }

  return true
}

// Setting a config to `undefined` should be equivalent to not setting it at all
function isConfigSourceValueUndefined(source: ConfigValueSource): null | boolean {
  if (!source.valueIsLoaded) return null
  return source.value === undefined
}

// Setting a config to `null` enables the user to suppress inherited config by overriding it with `null` (this only works when setting the config value to `null` inside a +config.js file — it doesn't work when setting the config value to `null` with a +{configName}.js file).
function isConfigSourceValueNull(source: ConfigValueSource) {
  if (!source.valueIsLoaded) return null
  return source.value === null
}

function applyFilenameSuffix(sourcesRelevant: ConfigValueSource[]) {
  const getFileName = (source: ConfigValueSource) => source.plusFile?.filePath.fileName ?? ''

  // Apply `clear`: truncate at first clear file
  const clearIndex = sourcesRelevant.findIndex((source) => getFileName(source).includes('.clear.'))
  if (clearIndex !== -1) sourcesRelevant = sourcesRelevant.slice(0, clearIndex + 1)

  // Apply `default`: exclude defaults if any non-defaults exist, otherwise keep only first default
  const nonDefaults = sourcesRelevant.filter((source) => !getFileName(source).includes('.default.'))
  return nonDefaults.length > 0 ? nonDefaults : sourcesRelevant.slice(0, 1)
}
