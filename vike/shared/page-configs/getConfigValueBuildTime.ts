export { getConfigValueBuildTime }

import { type ResolveTypeAsString } from '../utils.js'
import type { PageConfigBuildTime, ConfigValue } from './PageConfig.js'
import type { ConfigNameBuiltIn } from './Config.js'
import { getConfigValueTyped, type TypeAsString } from './getConfigValue.js'
import { assertIsNotProductionRuntime } from '../../utils/assertIsNotProductionRuntime.js'
assertIsNotProductionRuntime()
type ConfigName = ConfigNameBuiltIn

function getConfigValueBuildTime<Type extends TypeAsString = undefined>(
  pageConfig: PageConfigBuildTime,
  configName: ConfigName,
  type?: Type
): null | (ConfigValue & { value: ResolveTypeAsString<Type> }) {
  const configValue = pageConfig.configValues[configName]
  if (!configValue) return null
  return getConfigValueTyped(configValue, configName, type)
}
