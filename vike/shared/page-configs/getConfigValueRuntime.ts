export { getConfigValueRuntime }

import { type ResolveTypeAsString } from '../utils.js'
import type { PageConfigRuntime, ConfigValue } from '../../types/PageConfig.js'
import type { ConfigNameBuiltIn } from '../../types/Config.js'
import { getConfigValueTyped, type TypeAsString } from './getConfigValueTyped.js'

function getConfigValueRuntime<Type extends TypeAsString = undefined>(
  pageConfig: PageConfigRuntime,
  configName: ConfigNameBuiltIn,
  type?: Type
): null | (ConfigValue & { value: ResolveTypeAsString<Type> }) {
  const configValue = pageConfig.configValues[configName]
  if (!configValue) return null
  return getConfigValueTyped(configValue, configName, type)
}
