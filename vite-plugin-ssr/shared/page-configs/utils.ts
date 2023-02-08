export { getConfigValue }
export { getCodeFilePath }
export { getSourceFilePath }
export { getPageConfig }

import { assert, assertUsage } from '../utils'
import type { ConfigName, PageConfig, PageConfigData } from './PageConfig'

function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'string'): null | string
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'boolean'): null | boolean
// function getConfigValue(pageConfig: PageConfigData, configName: ConfigName): unknown
function getConfigValue(
  pageConfig: PageConfigData,
  configName: ConfigName,
  type: 'string' | 'boolean'
): null | unknown {
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

function getCodeFilePath(pageConfig: PageConfigData, configName: ConfigName): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource || isNullish(pageConfig, configName)) {
    return null
  }
  const { codeFilePath, configFilePath, configValue } = configSource
  if (codeFilePath) {
    return codeFilePath
  }
  const errIntro = `${configFilePath} sets the config ${configName}`
  assertUsage(
    typeof configValue === 'string',
    `${configFilePath} to a value with an invalid type \`${typeof configValue}\` but it should be a \`string\` instead`
  )
  assertUsage(false, `${errIntro} to the value \`${configValue}\` but it should be a file path instead`)
}

function getSourceFilePath(pageConfig: PageConfig, configName: ConfigName): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource || isNullish(pageConfig, configName)) {
    return null
  }
  if (configSource.codeFilePath) {
    return configSource.codeFilePath
  }
  return configSource.configFilePath
}

function isNullish(pageConfig: PageConfigData, configName: ConfigName): boolean {
  const configSource = pageConfig.configSources[configName]
  if (!configSource) return true
  const { codeFilePath, configValue } = configSource
  if (codeFilePath) return false
  return configValue === null || configValue === undefined
}

function getPageConfig(pageId: string, pageConfigs: PageConfig[]): PageConfig {
  const pageConfig = pageConfigs.find((p) => p.pageId2 === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}
