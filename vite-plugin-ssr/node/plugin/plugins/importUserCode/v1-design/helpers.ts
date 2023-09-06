export { getConfigEnv }
export { isConfigSet }

import type { ConfigEnvInternal, PageConfigData } from '../../../../../shared/page-configs/PageConfig.js'
import { getConfigValueSource } from '../../../../shared/getConfigValueSource.js'
import { assert } from '../../../utils.js'

function getConfigEnv(pageConfig: PageConfigData, configName: string): null | ConfigEnvInternal {
  const configValueSource = getConfigValueSource(pageConfig, configName)
  const configValue = pageConfig.configValues[configName]
  if (!configValueSource && !configValue) return null
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

function isConfigSet(pageConfig: PageConfigData, configName: string): boolean {
  const configValueSource = getConfigValueSource(pageConfig, configName)
  const configValue = pageConfig.configValues[configName]

  // Enable users to suppress global config values by overriding the config's value to null
  if (configValue?.value === null) {
    return false
  }

  /* TODO: implement/think this
  if (configValueSource) {
    return true
  } else {
    assert(!configValue)
    return false
  }
 */
  return !!configValueSource
}
