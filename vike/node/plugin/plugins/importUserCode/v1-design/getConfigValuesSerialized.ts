export { getConfigValuesSerialized }
export { assertConfigValueIsSerializable }

import { assert, assertUsage, getPropAccessNotation } from '../../../utils.js'
import type {
  ConfigEnvInternal,
  ConfigValueSource,
  DefinedAtData,
  PageConfigBuildTime
} from '../../../../../shared/page-configs/PageConfig.js'
import { stringify } from '@brillout/json-serializer/stringify'
import pc from '@brillout/picocolors'
import { getConfigValueFilePathToShowToUser } from '../../../../../shared/page-configs/helpers.js'
import { serializeConfigValue } from '../../../../../shared/page-configs/serialize/serializeConfigValue.js'
import { getConfigValueSourcesNotOverriden } from '../../../shared/getConfigValueSourcesNotOverriden.js'

function getConfigValuesSerialized(
  pageConfig: PageConfigBuildTime,
  isEnvMatch: (configEnv: ConfigEnvInternal, configValueSource?: ConfigValueSource) => boolean
): string {
  const lines: string[] = []
  Object.entries(pageConfig.configValuesComputed).forEach(([configName, configValuesComputed]) => {
    const { configEnv } = configValuesComputed

    if (!isEnvMatch(configEnv)) return
    // configValeSources has higher precedence
    if (pageConfig.configValueSources[configName]) return

    const configValue = pageConfig.configValues[configName]
    assert(configValue)
    const { value, ...common } = configValue
    assert(value === configValuesComputed.value)
    const valueSerialized = getConfigValueSerialized(value, configName, configValue.definedAtData)
    const configValueSerialized = { valueSerialized, ...common }
    serializeConfigValue(lines, configName, configValueSerialized)
  })
  getConfigValueSourcesNotOverriden(pageConfig).forEach((configValueSource) => {
    const { configName, configEnv } = configValueSource
    const configValue = pageConfig.configValues[configName]

    if (!configValue) return
    if (!isEnvMatch(configEnv, configValueSource)) {
      return
    }

    const { value, ...common } = configValue
    const valueSerialized = getConfigValueSerialized(value, configName, configValue.definedAtData)
    const configValueSerialized = { valueSerialized, ...common }
    serializeConfigValue(lines, configName, configValueSerialized)
  })
  const code = lines.join('\n')
  return code
}

function assertConfigValueIsSerializable(value: unknown, configName: string, definedAtData: DefinedAtData) {
  // Contains asserts
  getConfigValueSerialized(value, configName, definedAtData)
}

function getConfigValueSerialized(value: unknown, configName: string, definedAtData: DefinedAtData): string {
  const valueName = `config${getPropAccessNotation(configName)}`
  let configValueSerialized: string
  try {
    configValueSerialized = stringify(value, { valueName, forbidReactElements: true })
  } catch (err) {
    /*
    let serializationErrMsg = ''
    if (isJsonSerializerError(err)) {
      serializationErrMsg = err.messageCore
    } else {
      // When a property getter throws an error
      console.error('Serialization error:')
      console.error(err)
      serializationErrMsg = 'see serialization error printed above'
    }
    */
    const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser(definedAtData)
    assert(configValueFilePathToShowToUser)
    assertUsage(
      false,
      `${pc.cyan(
        configName
      )} defined by ${configValueFilePathToShowToUser} must be defined over a so-called "pointer import", see https://vike.dev/config#pointer-imports`
    )
  }
  configValueSerialized = JSON.stringify(configValueSerialized)
  return configValueSerialized
}
