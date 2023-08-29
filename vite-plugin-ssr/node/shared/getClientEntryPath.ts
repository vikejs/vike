export { getClientEntryPath }

import { PageConfigData } from '../../shared/page-configs/PageConfig.js'
import { getConfigValueSource } from '../../shared/page-configs/utils.js'
import { assert, assertUsage } from './utils.js'

function getClientEntryPath(pageConfig: PageConfigData): null | string {
  const configName = 'client'
  assert(pageConfig.configElements)
  const configElement = pageConfig.configElements[configName]
  if (!configElement) return null
  const configValue = pageConfig.configValues[configName]
  if (configValue && configValue.value === null) return null
  const { codeFilePath } = configElement
  if (codeFilePath !== null) return codeFilePath
  if (!configValue) return null
  const { value } = configValue
  const configValueSource = getConfigValueSource(configValue)
  assertUsage(
    typeof value === 'string',
    `${configValueSource} has an invalid type \`${typeof value}\`: it should be a string instead`
  )
  assertUsage(false, `${configValueSource} has an invalid value '${value}': it should be a file path instead`)
}
