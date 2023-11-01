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
  return configValueSource.configEnv
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
