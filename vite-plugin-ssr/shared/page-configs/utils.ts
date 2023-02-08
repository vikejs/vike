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
  const { configValue, configSrc } = configSource
  assertUsage(
    typeof configValue === type,
    `${configSrc} has an invalid type \`${typeof configValue}\`: is should be a ${type} instead`
  )
  return configValue
}

function getCodeFilePath(pageConfig: PageConfigData, configName: ConfigName): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource || isNullish(pageConfig, configName)) {
    return null
  }
  if (configSource.codeFilePath2 !== null) {
    return configSource.codeFilePath2
  }
  const { configValue, configSrc } = configSource
  assertUsage(
    typeof configValue === 'string',
    `${configSrc} has an invalid type \`${typeof configValue}\`: it should be a \`string\` instead`
  )
  assertUsage(false, `${configSrc} has an invalid value \`${configValue}\`: it should be a file path instead`)
}

function getSourceFilePath(pageConfig: PageConfig, configName: ConfigName): null | string {
  const configSource = pageConfig.configSources[configName]
  if (!configSource || isNullish(pageConfig, configName)) {
    return null
  }
  return configSource.configSrc
}

function isNullish(pageConfig: PageConfigData, configName: ConfigName): boolean {
  const configSource = pageConfig.configSources[configName]
  if (!configSource) return true
  const { codeFilePath2, configValue } = configSource
  if (codeFilePath2) return false
  return configValue === null || configValue === undefined
}

function getPageConfig(pageId: string, pageConfigs: PageConfig[]): PageConfig {
  const pageConfig = pageConfigs.find((p) => p.pageId2 === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}
