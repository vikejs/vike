export { parseConfigValuesSerialized }

import { assert } from '../../utils.js'
import type { ConfigValues } from '../PageConfig.js'
import type { ConfigValueSerialized } from './PageConfigSerialized.js'
import { parse } from '@brillout/json-serializer/parse'

function parseConfigValuesSerialized(configValuesSerialized: Record<string, ConfigValueSerialized>): ConfigValues {
  const configValues: ConfigValues = {}
  Object.entries(configValuesSerialized).forEach(([configName, configValueSeriliazed]) => {
    const { valueSerialized, definedAt } = configValueSeriliazed
    assert(valueSerialized)
    assert(!configValues[configName])
    configValues[configName] = {
      value: parse(valueSerialized),
      definedAt
    }
  })
  return configValues
}
