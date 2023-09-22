export { assertHookReturnedObject }

import { assert, assertUsage, stringifyStringArray } from './utils.js'

function assertHookReturnedObject<Keys extends readonly string[]>(
  obj: Record<string, unknown>,
  keysExpected: Keys,
  errPrefix: string
): asserts obj is { [key in Keys[number]]?: unknown } {
  assert(!errPrefix.endsWith(' '))
  const keysUnknown: string[] = []
  const keys = Object.keys(obj)
  for (const key of keys) {
    if (!keysExpected.includes(key)) {
      keysUnknown.push(key)
    }
  }
  assertUsage(
    keysUnknown.length === 0,
    [
      errPrefix,
      'returned an object with following unknown keys:',
      stringifyStringArray(keysUnknown) + '.',
      'Only following keys are allowed:',
      stringifyStringArray(keysExpected) + '.'
    ].join(' ')
  )
}
