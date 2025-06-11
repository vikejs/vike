export { assertKeys }

import pc from '@brillout/picocolors'
import { assertUsage } from './assert.js'
import { joinEnglish } from './joinEnglish.js'

function assertKeys<Keys extends readonly string[]>(
  obj: Record<string, unknown>,
  keysExpected: Keys,
  errPrefix: string,
): asserts obj is { [key in Keys[number]]?: unknown } {
  const keysUnknown: string[] = []
  const keys = Object.keys(obj)
  for (const key of keys) {
    if (!keysExpected.includes(key)) {
      keysUnknown.push(key)
    }
  }
  if (keysUnknown.length !== 0) {
    assertUsage(
      false,
      [
        errPrefix,
        `unknown key${keysUnknown.length === 1 ? '' : 's'}`,
        joinEnglish(keysUnknown, 'and', pc.cyan) + '.',
        'Only following keys are allowed:',
        joinEnglish(keysExpected, 'and', pc.cyan) + '.',
      ].join(' '),
    )
  }
}
