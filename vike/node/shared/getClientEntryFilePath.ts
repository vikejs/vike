export { getClientEntryFilePath }

import type { PageConfigRuntime, PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'
import { getConfigDefinedAtInfo, getConfigValue } from '../../shared/page-configs/utils.js'
import { assert } from './utils.js'

function getClientEntryFilePath(pageConfig: PageConfigRuntime | PageConfigBuildTime): null | string {
  const configName = 'client'
  const configValue = getConfigValue(pageConfig, configName, 'string')
  if (!configValue) return null
  const definedAtInfo = getConfigDefinedAtInfo(pageConfig, configName)
  const { value } = configValue
  // Users should be able to suppress client entry by setting its value to null
  assert(value !== null)
  const clientEntryFilePath = definedAtInfo.filePath
  return clientEntryFilePath
}
