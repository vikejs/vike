export { parseConfigValuesSerialized }

import { assert, isArray } from '../../utils.js'
import type { ConfigValue, ConfigValues } from '../PageConfig.js'
import type { ConfigValueSerialized } from './PageConfigSerialized.js'
import { parse } from '@brillout/json-serializer/parse'

function parseConfigValuesSerialized(configValuesSerialized: Record<string, ConfigValueSerialized>): ConfigValues {
  const configValues: ConfigValues = {}
  Object.entries(configValuesSerialized).forEach(([configName, configValueSeriliazed]) => {
    assert(!configValues[configName])
    const { valueSerialized, ...common } = configValueSeriliazed
    const value = parse(valueSerialized)
    let configValue: ConfigValue
    if (common.type === 'cumulative') {
      assert(isArray(value))
      configValue = { value, ...common }
    } else {
      configValue = { value, ...common }
    }
    configValues[configName] = configValue
  })
  return configValues
}
