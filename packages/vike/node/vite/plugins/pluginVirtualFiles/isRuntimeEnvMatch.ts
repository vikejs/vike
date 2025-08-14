export { isRuntimeEnvMatch }
export { isOverridden }
export type { RuntimeEnv }

import type {
  ConfigEnvInternal,
  ConfigValueSource,
  PageConfigBuildTime,
  PageConfigGlobalBuildTime,
} from '../../../../types/PageConfig.js'
import { assert } from '../../utils.js'

type RuntimeEnv = { isForClientSide: boolean; isClientRouting: boolean; isDev?: boolean } | { isForConfig: true }

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

type PageConfigPartial = Pick<
  PageConfigBuildTime | PageConfigGlobalBuildTime,
  'configValueSources' | 'configDefinitions'
>
function isOverridden(source: ConfigValueSource, configName: string, pageConfig: PageConfigPartial): boolean {
  const configDef = pageConfig.configDefinitions[configName]
  assert(configDef)
  if (configDef.cumulative) return false
  const sources = pageConfig.configValueSources[configName]
  assert(sources)
  const idx = sources.indexOf(source)
  assert(idx >= 0)
  return idx > 0
}
