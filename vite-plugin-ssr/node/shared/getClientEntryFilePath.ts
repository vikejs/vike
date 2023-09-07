export { getClientEntryFilePath }

import type { PageConfig, PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'
import { getConfigValue2 } from '../../shared/page-configs/utils.js'
import { assert } from './utils.js'

function getClientEntryFilePath(pageConfig: PageConfig | PageConfigBuildTime): null | string {
  const configName = 'client'
  const configValue = getConfigValue2(pageConfig, configName, 'string')
  if (!configValue) return null
  const { value, definedAt } = configValue
  // Users should be able to suppress client entry by setting its value to null
  assert(value !== null)
  const clientEntryFilePath = definedAt.filePath
  return clientEntryFilePath
}
