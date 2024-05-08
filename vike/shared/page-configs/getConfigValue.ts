export { getConfigValueRuntime }
export { getConfigValueBuildTime }

import { type ResolveTypeAsString, assert, assertUsage, getValuePrintable } from '../utils.js'
import type { PageConfigRuntime, PageConfigBuildTime, ConfigValue, DefinedAtData } from './PageConfig.js'
import type { ConfigNameBuiltIn } from './Config.js'
import pc from '@brillout/picocolors'
import { getConfigDefinedAtOptional } from './getConfigDefinedAt.js'
type PageConfigCommon = PageConfigRuntime | PageConfigBuildTime
type ConfigName = ConfigNameBuiltIn
type TypeAsString = 'string' | 'boolean' | undefined

function getConfigValue<Type extends TypeAsString = undefined>(
  pageConfig: PageConfigCommon,
  configName: ConfigName,
  type?: Type
): null | (ConfigValue & { value: ResolveTypeAsString<Type> }) {
  const configValue = getConfigValueEntry(pageConfig, configName)
  if (configValue === null) return null
  const { value, definedAtData } = configValue
  if (type) assertConfigValueType(value, type, configName, definedAtData)
  return configValue as ConfigValue & { value: ResolveTypeAsString<Type> }
}

function getConfigValueRuntime<Type extends TypeAsString = undefined>(
  pageConfig: PageConfigRuntime,
  configName: ConfigName,
  type?: Type
): null | (ConfigValue & { value: ResolveTypeAsString<Type> }) {
  return getConfigValue(pageConfig, configName, type)
}
function getConfigValueBuildTime<Type extends TypeAsString = undefined>(
  pageConfig: PageConfigBuildTime,
  configName: ConfigName,
  type?: Type
): null | (ConfigValue & { value: ResolveTypeAsString<Type> }) {
  return getConfigValue(pageConfig, configName, type)
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
