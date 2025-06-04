export { getConfigValueTyped }
export type { TypeAsString }

import { type ResolveTypeAsString, assert, assertUsage, getValuePrintable } from '../utils.js'
import type { ConfigValue, DefinedAtData } from './PageConfig.js'
import type { ConfigNameBuiltIn } from '../../types/Config.js'
import pc from '@brillout/picocolors'
import { getConfigDefinedAtOptional } from './getConfigDefinedAt.js'
type TypeAsString = 'string' | 'boolean' | undefined

function getConfigValueTyped<Type extends TypeAsString = undefined>(
  configValue: ConfigValue,
  configName: ConfigNameBuiltIn,
  type?: Type
): null | (ConfigValue & { value: ResolveTypeAsString<Type> }) {
  /* [NULL_HANDLING] Do we really need this? This doesn't seem to make sense, let's eventually (re)move this.
  // Enable users to suppress global config values by setting the local config value to null
  if (configValue.value === null) return null
  */
  const { value, definedAtData } = configValue
  if (type) assertConfigValueType(value, type, configName, definedAtData)
  return configValue as ConfigValue & { value: ResolveTypeAsString<Type> }
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
