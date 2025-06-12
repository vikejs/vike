export { warnIfErrorIsNotObject }

import { assertWarning } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { isObject } from './isObject.js'
import pc from '@brillout/picocolors'

assertIsNotBrowser()

// It would be cleaner to:
//  - Call assertUsageErrorIsObject() right after calling the user's hook
//    - Attach the original error: assertUsageError.originalErrorValue = err
//      - Show the original error in Vike's error handling
//  - Use assertErrorIsObject() throughout Vike's source code
function warnIfErrorIsNotObject(err: unknown): void {
  if (!isObject(err)) {
    console.warn('[vike] The thrown value is:')
    console.warn(err)
    assertWarning(
      false,
      `One of your hooks threw an error ${pc.cyan('throw someValue')} but ${pc.cyan(
        'someValue',
      )} isn't an object (it's ${pc.cyan(
        `typeof someValue === ${typeof err}`,
      )} instead). Make sure thrown values are always wrapped with ${pc.cyan('new Error()')}, in other words: ${pc.cyan(
        'throw someValue',
      )} should be replaced with ${pc.cyan('throw new Error(someValue)')}. The thrown value is printed above.`,
      { onlyOnce: false },
    )
  }
}
