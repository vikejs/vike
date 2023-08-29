export { getConfigEnv }

import type { ConfigEnvPrivate, PageConfigData } from '../../../../../shared/page-configs/PageConfig.js'
import { getConfigValueSource } from '../../../../shared/getConfigValueSource.js'

function getConfigEnv(pageConfig: PageConfigData, configName: string): null | ConfigEnvPrivate {
  const configValueSource = getConfigValueSource(pageConfig, configName)
  if (!configValueSource) return null
  if (pageConfig.configValues[configName]) {
    const val = pageConfig.configValues[configName]!.value
    // Enable users to suppress a gloabal config by overriding the config's value to null in +config.js
    if (val === null) return null
  }
  return configValueSource.configEnv
}
