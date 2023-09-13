export { getClientEntryFilePath }

import type { PageConfig, PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'
import { getConfigValue } from '../../shared/page-configs/utils.js'
import { assert } from './utils.js'

function getClientEntryFilePath(pageConfig: PageConfig | PageConfigBuildTime): null | string {
  const configName = 'client'
  const configValue = getConfigValue(pageConfig, configName, 'string')
  if (!configValue) return null
  const { value, definedAtInfo } = configValue
  // Users should be able to suppress client entry by setting its value to null
  assert(value !== null)
  assert(definedAtInfo) // Config 'client' isn't computed and shouldn't be cumulative
  const clientEntryFilePath = definedAtInfo.filePath
  return clientEntryFilePath
}
