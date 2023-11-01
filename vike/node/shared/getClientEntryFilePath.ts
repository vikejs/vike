export { getClientEntryFilePath }

import type { PageConfigRuntime, PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'
import { getConfigValue } from '../../shared/page-configs/helpers.js'

function getClientEntryFilePath(pageConfig: PageConfigRuntime | PageConfigBuildTime): null | string {
  const configName = 'client'
  const configValue = getConfigValue(pageConfig, configName, 'string')
  if (!configValue) return null
  return configValue.value
}
