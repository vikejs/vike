export { getConfigValue }
export { getConfigValueBuildTime }

import { type ResolveTypeAsString, assert, assertUsage, getValuePrintable } from '../utils.js'
import type { PageConfigRuntime, PageConfigBuildTime, ConfigValue, DefinedAtData } from './PageConfig.js'
import type { ConfigNameBuiltIn } from './Config.js'
import pc from '@brillout/picocolors'
import { getConfigDefinedAtOptional } from './getConfigDefinedAt.js'
type PageConfigCommon = PageConfigRuntime | PageConfigBuildTime
type ConfigName = ConfigNameBuiltIn

function getConfigValueCommon<TypeAsString extends 'string' | 'boolean' | undefined = undefined>(
  pageConfig: PageConfigCommon,
  configName: ConfigName,
  type?: TypeAsString
): null | (ConfigValue & { value: ResolveTypeAsString<TypeAsString> }) {
  const configValue = getConfigValueEntry(pageConfig, configName)
  if (configValue === null) return null
  const { value, definedAtData } = configValue
  if (type) assertConfigValueType(value, type, configName, definedAtData)
  return configValue as ConfigValue & { value: ResolveTypeAsString<TypeAsString> }
}

function getConfigValue<TypeAsString extends 'string' | 'boolean' | undefined = undefined>(
  pageConfig: PageConfigRuntime,
  configName: ConfigName,
  type?: TypeAsString
): null | (ConfigValue & { value: ResolveTypeAsString<TypeAsString> }) {
  return getConfigValueCommon(pageConfig, configName, type)
}

function getConfigValueBuildTime<TypeAsString extends 'string' | 'boolean' | undefined = undefined>(
  pageConfig: PageConfigBuildTime,
  configName: ConfigName,
  type?: TypeAsString
): null | (ConfigValue & { value: ResolveTypeAsString<TypeAsString> }) {
  return getConfigValueCommon(pageConfig, configName, type)
}

function assertConfigValueType(
  value: unknown,
  type: 'string' | 'boolean',
  configName: string,
  definedAtData: DefinedAtData
) {
  assert(value !== null)
  const typeActual = typeof value
  if (typeActual === type) return
  const valuePrintable = getValuePrintable(value)
  const problem: string =
    valuePrintable !== null
      ? (`value ${pc.cyan(valuePrintable)}` as const)
      : (`type ${pc.cyan(typeActual) as string}` as const)
  const configDefinedAt = getConfigDefinedAtOptional('Config', configName, definedAtData)
  const errMsg = `${configDefinedAt} has an invalid ${problem}: it should be a ${
    pc.cyan(type) as string
  } instead` as const
  assertUsage(false, errMsg)
}

function getConfigValueEntry(pageConfig: PageConfigCommon, configName: ConfigName) {
  const configValue = pageConfig.configValues[configName]
  if (!configValue) return null
  // Enable users to suppress global config values by setting the local config value to null
  if (configValue.value === null) return null
  return configValue
}
