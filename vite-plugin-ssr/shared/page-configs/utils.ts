export { getConfigValue }
export { getCodeFilePath }
export { getSourceFilePath }

import { assert } from '../utils'
import type { PageConfig2 } from './PageConfig'

function getConfigValue(pageConfig: PageConfig2, configName: string, type: 'string'): null | string
function getConfigValue(pageConfig: PageConfig2, configName: string, type: 'boolean'): null | boolean
function getConfigValue(pageConfig: PageConfig2, configName: string, type: 'string' | 'boolean'): null | unknown {
  const configSource = pageConfig.configSources[configName]
  if (!configSource) {
    return null
  }
  assert(!('codeFilePath' in configSource)) // TODO: assertUsage()
  const { configValue } = configSource
  assert(typeof configValue === type) // TODO: assertUsage()
  return configValue
}

function getCodeFilePath(pageConfig: PageConfig2, configName: string): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource) {
    return null
  }
  assert('codeFilePath' in configSource) // TODO: assertUsage()
  const { codeFilePath } = configSource
  return codeFilePath
}

function getSourceFilePath(pageConfig: PageConfig2, configName: string): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource) return null
  if ('codeFilePath' in configSource) {
    return configSource.codeFilePath
  }
  return configSource.configFilePath
}
