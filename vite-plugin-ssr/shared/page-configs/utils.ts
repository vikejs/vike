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
  const configElement = pageConfig.configElements[configName]
  if (!configElement || isNullish(pageConfig, configName)) {
    return null
  }
  const { configValue, configElem } = configElement
  assertUsage(
    typeof configValue === type,
    `${configElem} has an invalid type \`${typeof configValue}\`: is should be a ${type} instead`
  )
  return configValue
}

function getCodeFilePath(pageConfig: PageConfigData, configName: ConfigName): null | string {
  const configElement = pageConfig.configElements[configName]
  if (!configElement || isNullish(pageConfig, configName)) {
    return null
  }
  if (configElement.codeFilePath2 !== null) {
    return configElement.codeFilePath2
  }
  const { configValue, configElem } = configElement
  assertUsage(
    typeof configValue === 'string',
    `${configElem} has an invalid type \`${typeof configValue}\`: it should be a \`string\` instead`
  )
  assertUsage(false, `${configElem} has an invalid value \`${configValue}\`: it should be a file path instead`)
}

function getSourceFilePath(pageConfig: PageConfig, configName: ConfigName): null | string {
  const configElement = pageConfig.configElements[configName]
  if (!configElement || isNullish(pageConfig, configName)) {
    return null
  }
  return configElement.configElem
}

function isNullish(pageConfig: PageConfigData, configName: ConfigName): boolean {
  const configElement = pageConfig.configElements[configName]
  if (!configElement) return true
  const { codeFilePath2, configValue } = configElement
  if (codeFilePath2) return false
  return configValue === null || configValue === undefined
}

function getPageConfig(pageId: string, pageConfigs: PageConfig[]): PageConfig {
  const pageConfig = pageConfigs.find((p) => p.pageId2 === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}
