export { getClientEntryFilePath }

import type { PageConfig, PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'
import { getConfigSrc, getConfigValue2 } from '../../shared/page-configs/utils.js'
import { getConfigValueSource } from './getConfigValueSource.js'
import { assert, assertUsage } from './utils.js'

function getClientEntryFilePath(pageConfig: PageConfig | PageConfigBuildTime): null | string {
  const configName = 'client'
  const configValue = getConfigValue2(pageConfig, configName, 'string')
  if (!configValue) return null
  const { value, definedAt } = configValue

  // Enable users to suppress client entry by setting its value to null
  assert(value !== null)

  const clientEntryFilePath = definedAt.filePath
  return clientEntryFilePath
}
function getClientEntryFilePath2(pageConfig: PageConfig): null | string {
  const configName = 'client'
  const configValueSource = getConfigValueSource(pageConfig, configName)
  if (!configValueSource) return null

  // Enable users to suppress client entry by setting its value to null
  const configValue = pageConfig.configValues[configName]
  if (configValue && configValue.value === null) return null

  // Ensure client config is an import path
  const configSrc = getConfigSrc(configValueSource)
  assert(configSrc)
  assertUsage(
    configValueSource.value === undefined && configValueSource.valueSerialized === undefined,
    `${configSrc} should be an import path`
  )
  assert(!configValue)

  const clientEntryFilePath = configValueSource.definedAt.filePath
  return clientEntryFilePath
}
