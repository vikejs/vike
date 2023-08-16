export { getConfigValue }
export { getCodeFilePath }
export { getPageConfig }

import { assert, assertUsage } from '../utils.js'
import type { PageConfig, PageConfigData } from './PageConfig.js'
import type { ConfigNameBuiltIn, ConfigNamePrivate } from './Config.js'

type ConfigName = ConfigNameBuiltIn | ConfigNamePrivate

function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'string'): null | string
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'boolean'): null | boolean
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName): unknown
function getConfigValue(
  pageConfig: PageConfigData,
  configName: ConfigName,
  type?: 'string' | 'boolean'
): null | unknown {
  const configElement = pageConfig.configElements[configName]
  if (!configElement || isNullish(pageConfig, configName)) {
    return null
  }
  const { configValue, configDefinedAt } = configElement
  if (type) {
    assertUsage(
      typeof configValue === type,
      `${configDefinedAt} has an invalid type \`${typeof configValue}\`: is should be a ${type} instead`
    )
  }
  return configValue
}

function getCodeFilePath(pageConfig: PageConfigData, configName: ConfigName): null | string {
  const configElement = pageConfig.configElements[configName]
  if (!configElement || isNullish(pageConfig, configName)) {
    return null
  }
  if (configElement.codeFilePath !== null) {
    return configElement.codeFilePath
  }
  const { configValue, configDefinedAt } = configElement
  assertUsage(
    typeof configValue === 'string',
    `${configDefinedAt} has an invalid type \`${typeof configValue}\`: it should be a \`string\` instead`
  )
  assertUsage(false, `${configDefinedAt} has an invalid value \`${configValue}\`: it should be a file path instead`)
}

function isNullish(pageConfig: PageConfigData, configName: ConfigName): boolean {
  const configElement = pageConfig.configElements[configName]
  if (!configElement) return true
  const { codeFilePath, configValue } = configElement
  if (codeFilePath) return false
  return configValue === null || configValue === undefined
}

function getPageConfig(pageId: string, pageConfigs: PageConfig[]): PageConfig {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}
