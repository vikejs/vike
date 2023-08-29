export { getClientEntryFilePath }

import { PageConfigData } from '../../shared/page-configs/PageConfig.js'
import { getConfigSrc } from '../../shared/page-configs/utils.js'
import { assert, assertUsage } from './utils.js'

function getClientEntryFilePath(pageConfig: PageConfigData): null | string {
  const configName = 'client'
  assert(pageConfig.configValueSources)
  const sources = pageConfig.configValueSources[configName]
  if (!sources) return null
  const configValueSource = sources[0]
  assert(configValueSource)

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
