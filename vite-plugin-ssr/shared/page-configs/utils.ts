export { getConfigValue }
export { getCodeFilePath }
export { getSourceFilePath }

import { assert } from '../utils'
import type { PageConfig, PageConfigData } from './PageConfig'

function getConfigValue(pageConfig: PageConfigData, configName: string, type: 'string'): null | string
function getConfigValue(pageConfig: PageConfigData, configName: string, type: 'boolean'): null | boolean
function getConfigValue(pageConfig: PageConfigData, configName: string, type: 'string' | 'boolean'): null | unknown {
  const configSource = pageConfig.configSources[configName]
  if (!configSource) {
    return null
  }
  assert(!('codeFilePath' in configSource)) // TODO: assertUsage()
  const { configValue } = configSource
  assert(typeof configValue === type) // TODO: assertUsage()
  return configValue
}

function getCodeFilePath(pageConfig: PageConfigData, configName: string): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource) {
    return null
  }
  assert(configSource.codeFilePath) // TODO: assertUsage()
  const { codeFilePath } = configSource
  return codeFilePath
}

function getSourceFilePath(pageConfig: PageConfig, configName: string): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource) return null
  if (configSource.codeFilePath) {
    return configSource.codeFilePath
  }
  const { configFilePath } = configSource
  assert(configFilePath)
  return configFilePath
}
