export { getConfigValue }

import { assert, assertUsage, getValuePrintable } from '../utils.js'
import type { PageConfigRuntime, PageConfigBuildTime, ConfigValue, DefinedAtData } from './PageConfig.js'
import type { ConfigNameBuiltIn } from './Config.js'
import pc from '@brillout/picocolors'
import { getConfigDefinedAtOptional } from './getConfigDefinedAt.js'
type PageConfigCommon = PageConfigRuntime | PageConfigBuildTime
type ConfigName = ConfigNameBuiltIn

// prettier-ignore
// biome-ignore format:
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName, type: 'string'): null | ConfigValue & { value: string }
// prettier-ignore
// biome-ignore format:
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName, type: 'boolean'): null | ConfigValue & { value: boolean }
// prettier-ignore
// biome-ignore format:
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName): null | ConfigValue & { value: unknown }
// prettier-ignore
// biome-ignore format:
function getConfigValue(pageConfig: PageConfigCommon, configName: ConfigName, type?: 'string' | 'boolean'): null | ConfigValue & { value: unknown } {
  const configValue = getConfigValueEntry(pageConfig, configName)
  if (configValue === null) return null
  const { value, definedAtData } = configValue
  if (type) assertConfigValueType(value, type, configName, definedAtData)
  return configValue
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
