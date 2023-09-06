export { getConfigEnv }
export { isConfigSet }
export { getConfigValueBuildTime }

import type { ConfigNameBuiltIn } from '../../../../../shared/page-configs/Config.js'
import type {
  ConfigEnvInternal,
  ConfigValueSource,
  PageConfigBuildTime
} from '../../../../../shared/page-configs/PageConfig.js'
import { assertConfigValueType } from '../../../../../shared/page-configs/utils.js'
import { getConfigValueSource } from '../../../../shared/getConfigValueSource.js'
import { assert, assertIsNotProductionRuntime, hasProp } from '../../../utils.js'
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

// prettier-ignore
function getConfigValueBuildTime(pageConfig: PageConfigBuildTime, configName: ConfigNameBuiltIn, type: 'string'): null | ConfigValueSource & { value: string }
// prettier-ignore
function getConfigValueBuildTime(pageConfig: PageConfigBuildTime, configName: ConfigNameBuiltIn, type: 'boolean'): null | ConfigValueSource & { value: boolean }
// prettier-ignore
function getConfigValueBuildTime(pageConfig: PageConfigBuildTime, configName: ConfigNameBuiltIn): null | ConfigValueSource & { value: unknown }
// prettier-ignore
function getConfigValueBuildTime(pageConfig: PageConfigBuildTime, configName: ConfigNameBuiltIn, type?: 'string' | 'boolean'): null | ConfigValueSource & { value: unknown } {
  const configValueSource = getConfigValueSource(pageConfig, configName)
  if (!configValueSource) return null
  if (!('value' in configValueSource)) return null
  assert(hasProp(configValueSource, 'value')) // Help TypeScript
  const { value, definedAt } = configValueSource
  // Enable users to suppress global config values by overriding the config's value to null
  if (value === null) return null
  assertConfigValueType({ value, definedAt }, type)
  return configValueSource
}
