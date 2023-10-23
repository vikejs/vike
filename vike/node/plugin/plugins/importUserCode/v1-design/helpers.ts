export { getConfigEnv }
export { isConfigSet }

import type {
  ConfigEnvInternal,
  ConfigValueSource,
  ConfigValueSources
} from '../../../../../shared/page-configs/PageConfig.js'
import { assert, assertIsNotProductionRuntime } from '../../../utils.js'
assertIsNotProductionRuntime()

function getConfigEnv(configValueSources: ConfigValueSources, configName: string): null | ConfigEnvInternal {
  const configValueSource = getConfigValueSource(configValueSources, configName)
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

function isConfigSet(configValueSources: ConfigValueSources, configName: string): boolean {
  const configValueSource = getConfigValueSource(configValueSources, configName)
  // Enable users to suppress global config values by overriding the config's value to null
  if (configValueSource?.value === null) return false
  return !!configValueSource
}

function getConfigValueSource(configValueSources: ConfigValueSources, configName: string): null | ConfigValueSource {
  const sources = configValueSources[configName]
  if (!sources) return null
  const configValueSource = sources[0]
  assert(configValueSource)
  return configValueSource
}
