export { getConfigEnv }
export { isConfigSet }

import type {
  ConfigEnvInternal,
  ConfigValueSource,
  PageConfigBuildTime
} from '../../../../../shared/page-configs/PageConfig.js'
import { assert, assertIsNotProductionRuntime } from '../../../utils.js'
assertIsNotProductionRuntime()

function getConfigEnv(pageConfig: PageConfigBuildTime, configName: string): null | ConfigEnvInternal {
  const configValueSource = getConfigValueSource(pageConfig, configName)
  if (!configValueSource) return null
  if (configValueSource) {
    return configValueSource.configEnv
  } else {
    // In case of effect/computed config values, there isn't any configValueSource
    // TODO: make it work for custom config definitions
    //  - Ideally set configValueSource also for effect/computed config values?
    assert(false, 'TODO')
    /*
    const configDef = configDefinitionsBuiltIn[configName as keyof typeof configDefinitionsBuiltIn]
    if (!configDef) return null
    return configDef.env
    */
  }
}

function isConfigSet(pageConfig: PageConfigBuildTime, configName: string): boolean {
  const configValueSource = getConfigValueSource(pageConfig, configName)
  // Enable users to suppress global config values by overriding the config's value to null
  if (configValueSource?.value === null) return false
  return !!configValueSource
}

function getConfigValueSource(pageConfig: PageConfigBuildTime, configName: string): null | ConfigValueSource {
  // Doesn't exist on the client-side, but we are on the server-side as attested by assertIsNotBrowser()
  assert(pageConfig.configValueSources)
  const sources = pageConfig.configValueSources[configName]
  if (!sources) return null
  const configValueSource = sources[0]
  assert(configValueSource)
  return configValueSource
}
