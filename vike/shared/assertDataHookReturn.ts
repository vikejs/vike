export { assertDataHookReturn }

import { assertUsage, isPlainObject } from './utils.js'
import { assertHookReturnedObject } from './assertHookReturnedObject.js'
import pc from '@brillout/picocolors'

function assertDataHookReturn<Keys extends readonly string[]>(
  hookReturnValue: unknown,
  hookFilePath: string
): asserts hookReturnValue is undefined | null | { [key in Keys[number]]?: unknown } {
  if (hookReturnValue === undefined || hookReturnValue === null) {
    return
  }
  const errPrefix = `The data() hook defined by ${hookFilePath}` as const
  assertUsage(
    isPlainObject(hookReturnValue),
    `${errPrefix} should return a plain JavaScript object, ${pc.cyan('undefined')}, or ${pc.cyan('null')}`
  )
  assertHookReturnedObject(hookReturnValue, [] as const, errPrefix)
}
