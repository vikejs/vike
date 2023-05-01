export { getConfigValue }
export { getCodeFilePath }
export { getPlusConfig }

import { assert, assertUsage } from '../utils'
import type { ConfigName, PlusConfig, PlusConfigData } from './PlusConfig'

function getConfigValue(plusConfig: PlusConfigData, configName: ConfigName, type: 'string'): null | string
function getConfigValue(plusConfig: PlusConfigData, configName: ConfigName, type: 'boolean'): null | boolean
// function getConfigValue(plusConfig: PlusConfigData, configName: ConfigName): unknown
function getConfigValue(
  plusConfig: PlusConfigData,
  configName: ConfigName,
  type: 'string' | 'boolean'
): null | unknown {
  const configElement = plusConfig.configElements[configName]
  if (!configElement || isNullish(plusConfig, configName)) {
    return null
  }
  const { configValue, configDefinedAt } = configElement
  assertUsage(
    typeof configValue === type,
    `${configDefinedAt} has an invalid type \`${typeof configValue}\`: is should be a ${type} instead`
  )
  return configValue
}

function getCodeFilePath(plusConfig: PlusConfigData, configName: ConfigName): null | string {
  const configElement = plusConfig.configElements[configName]
  if (!configElement || isNullish(plusConfig, configName)) {
    return null
  }
  if (configElement.plusValueFilePath !== null) {
    return configElement.plusValueFilePath
  }
  const { configValue, configDefinedAt } = configElement
  assertUsage(
    typeof configValue === 'string',
    `${configDefinedAt} has an invalid type \`${typeof configValue}\`: it should be a \`string\` instead`
  )
  assertUsage(false, `${configDefinedAt} has an invalid value \`${configValue}\`: it should be a file path instead`)
}

function isNullish(plusConfig: PlusConfigData, configName: ConfigName): boolean {
  const configElement = plusConfig.configElements[configName]
  if (!configElement) return true
  const { plusValueFilePath, configValue } = configElement
  if (plusValueFilePath) return false
  return configValue === null || configValue === undefined
}

function getPlusConfig(pageId: string, plusConfigs: PlusConfig[]): PlusConfig {
  const plusConfig = plusConfigs.find((p) => p.pageId === pageId)
  assert(plusConfigs.length > 0)
  assert(plusConfig)
  return plusConfig
}
