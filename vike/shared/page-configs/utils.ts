export { getConfigValue }
export { getPageConfig }
export { getConfigDefinedAtString }
export { getConfigDefinedAtInfo }
export { getDefinedAtString }

import { assert, assertUsage, getValuePrintable } from '../utils.js'
import type { DefinedAtInfo, PageConfig, PageConfigCommon } from './PageConfig.js'
import type { ConfigNameBuiltIn } from './Config.js'
import pc from '@brillout/picocolors'
import { getExportPath } from './getExportPath.js'

type ConfigName = ConfigNameBuiltIn

// prettier-ignore
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName, type: 'string'): null | { value: string }
// prettier-ignore
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName, type: 'boolean'): null | { value: boolean }
// prettier-ignore
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName): null | { value: unknown }
// prettier-ignore
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName, type?: 'string' | 'boolean'): null | { value: unknown } {
  const configValue = getConfigValueEntry(pageConfig, configName)
  if (configValue === null) return null
  const { value, definedAtInfo } = configValue
  if (type) assertConfigValueType(value, type, configName, definedAtInfo)
  return { value }
}

function getConfigDefinedAtInfo(pageConfig: PageConfigCommon, configName: ConfigName): DefinedAtInfo {
  const configValue = getConfigValueEntry(pageConfig, configName)
  // We assume the caller to have ensured that the config value exists prior to calling getConfigDefinedAtInfo()
  assert(configValue)
  const { definedAtInfo } = configValue
  // definedAtInfo is available only for config values that aren't:
  //  - computed, nor
  //  - cumulative
  assert(definedAtInfo)
  return definedAtInfo
}

function getConfigValueEntry(pageConfig: PageConfigCommon, configName: ConfigName) {
  const configValue = pageConfig.configValues[configName]
  if (!configValue) return null
  const { value, definedAtInfo } = configValue
  // Enable users to suppress global config values by setting the local config value to null
  if (value === null) return null
  return { value, definedAtInfo }
}

function getPageConfig(pageId: string, pageConfigs: PageConfig[]): PageConfig {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}

function assertConfigValueType(
  value: unknown,
  type: 'string' | 'boolean',
  configName: string,
  definedAtInfo: null | DefinedAtInfo
) {
  assert(value !== null)
  const typeActual = typeof value
  if (typeActual === type) return
  const valuePrintable = getValuePrintable(value)
  const problem =
    valuePrintable !== null ? (`value ${pc.cyan(valuePrintable)}` as const) : (`type ${pc.cyan(typeActual)}` as const)
  const configDefinedAt = getConfigDefinedAtString(configName, { definedAtInfo }, true)
  assertUsage(false, `${configDefinedAt} has an invalid ${problem}: it should be a ${pc.cyan(type)} instead`)
}

type ConfigDefinedAtUppercase<ConfigName extends string> = `Config ${ConfigName}${string}`
type ConfigDefinedAtLowercase<ConfigName extends string> = `config ${ConfigName}${string}`
function getConfigDefinedAtString<ConfigName extends string>(
  configName: ConfigName,
  { definedAtInfo }: { definedAtInfo: null | DefinedAtInfo },
  sentenceBegin: true,
  append?: 'effect'
): ConfigDefinedAtUppercase<ConfigName>
function getConfigDefinedAtString<ConfigName extends string>(
  configName: ConfigName,
  { definedAtInfo }: { definedAtInfo: null | DefinedAtInfo },
  sentenceBegin: false,
  append?: 'effect'
): ConfigDefinedAtLowercase<ConfigName>
function getConfigDefinedAtString<ConfigName extends string>(
  configName: ConfigName,
  { definedAtInfo }: { definedAtInfo: null | DefinedAtInfo },
  sentenceBegin: boolean,
  append?: 'effect'
): ConfigDefinedAtUppercase<ConfigName> | ConfigDefinedAtLowercase<ConfigName> {
  let configDefinedAt: ConfigDefinedAtUppercase<ConfigName> | ConfigDefinedAtLowercase<ConfigName> = `${
    sentenceBegin ? `Config` : `config`
  } ${pc.cyan(configName)}` as const
  if (definedAtInfo !== null) {
    configDefinedAt = `${configDefinedAt} defined at ${getDefinedAtString(definedAtInfo, append)}`
  }
  return configDefinedAt
}
function getDefinedAtString(definedAtInfo: DefinedAtInfo, append?: 'effect'): string {
  const { filePath, fileExportPath } = definedAtInfo
  let definedAt = filePath
  const exportPath = getExportPath(fileExportPath)
  if (exportPath) {
    definedAt = `${definedAt} > ${pc.cyan(exportPath)}`
  }
  if (append) {
    definedAt = `${definedAt} > (${pc.blue(append)})`
  }
  return definedAt
}
