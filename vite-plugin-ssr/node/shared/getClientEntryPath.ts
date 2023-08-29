export { getClientEntryPath }

import { PageConfigData } from '../../shared/page-configs/PageConfig.js'
import { getConfigValueSource } from '../../shared/page-configs/utils.js'
import { assert, assertUsage } from './utils.js'

function getClientEntryPath(pageConfig: PageConfigData): null | string {
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
  const src = getConfigValueSource(configValueSource)
  assert(src)
  assertUsage(
    configValueSource.value === undefined && configValueSource.valueSerialized === undefined,
    `${src} should be an import path`
  )
  assert(!configValue)

  return configValueSource.definedAt.filePath
}
