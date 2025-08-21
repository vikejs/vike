export { getConfigValueSourcesRelevant }
export { isRuntimeEnvMatch }
export type { RuntimeEnv }

import type { ConfigEnvInternal, PageConfigBuildTime, PageConfigGlobalBuildTime } from '../../../../types/PageConfig.js'
import { assert } from '../../utils.js'

type RuntimeEnv = { isForClientSide: boolean; isClientRouting: boolean; isDev?: boolean } | { isForConfig: true }

type PageConfigPartial = Pick<
  PageConfigBuildTime | PageConfigGlobalBuildTime,
  'configValueSources' | 'configDefinitions'
>
function getConfigValueSourcesRelevant(configName: string, runtimeEnv: RuntimeEnv, pageConfig: PageConfigPartial) {
  const configDef = pageConfig.configDefinitions[configName]
  assert(configDef)
  let sourcesRelevant = pageConfig.configValueSources[configName]
  if (!sourcesRelevant) return []

  if (!configDef.cumulative) {
    const source = sourcesRelevant[0]
    if (source) {
      sourcesRelevant = [source]
    } else {
      assert(sourcesRelevant.length === 0)
    }
  }

  sourcesRelevant = sourcesRelevant.filter((source) => isRuntimeEnvMatch(source.configEnv, runtimeEnv))

  return sourcesRelevant
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
