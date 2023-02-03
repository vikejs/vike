export { getConfigValue }
export { getCodeFilePath }
export { getSourceFilePath }

import { assertUsage } from '../utils'
import type { PageConfig, PageConfigData } from './PageConfig'

function getConfigValue(pageConfig: PageConfigData, configName: string, type: 'string'): null | string
function getConfigValue(pageConfig: PageConfigData, configName: string, type: 'boolean'): null | boolean
function getConfigValue(pageConfig: PageConfigData, configName: string, type: 'string' | 'boolean'): null | unknown {
  const configSource = pageConfig.configSources[configName]
  if (!configSource || isNullish(pageConfig, configName)) {
    return null
  }
  const { configFilePath } = configSource
  assertUsage(
    !('codeFilePath' in configSource),
    `${configFilePath} sets the config ${configName} to a file path, but it should be a ${type} instead`
  )
  const { configValue } = configSource
  assertUsage(
    typeof configValue === type,
    `${configFilePath} sets the config ${configName} to a value with an invalid type \`${typeof configValue}\`: the value should be a ${type} instead`
  )
  return configValue
}

function getCodeFilePath(pageConfig: PageConfigData, configName: string): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource || isNullish(pageConfig, configName)) {
    return null
  }
  const { codeFilePath, configFilePath, configValue } = configSource
  assertUsage(
    codeFilePath,
    `${configFilePath} sets the config ${configName} to the value \`${String(
      configValue
    )}\` but it should be a file path instead`
  )
  return codeFilePath
}

function getSourceFilePath(pageConfig: PageConfig, configName: string): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource || isNullish(pageConfig, configName)) {
    return null
  }
  if (configSource.codeFilePath) {
    return configSource.codeFilePath
  }
  return configSource.configFilePath
}

function isNullish(pageConfig: PageConfigData, configName: string): boolean {
  const configSource = pageConfig.configSources[configName]
  if (!configSource) return true
  const { codeFilePath, configValue } = configSource
  if (codeFilePath) return false
  return configValue === null || configValue === undefined
}
