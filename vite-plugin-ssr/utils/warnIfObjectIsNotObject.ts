export { warnIfObjectIsNotObject }

import { assertWarning } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { isObject } from './isObject.js'
import pc from '@brillout/picocolors'

assertIsNotBrowser()

function warnIfObjectIsNotObject(err: unknown): void {
  if (!isObject(err)) {
    console.warn('[vite-plugin-ssr] The thrown value is:')
    console.warn(err)
    assertWarning(
      false,
      `One of your hooks threw an error ${pc.cyan('throw someValue')} but ${pc.cyan(
        'someValue'
      )} isn't an object (it's ${pc.cyan(
        `typeof someValue === ${typeof err}`
      )} instead). Make sure thrown values are always wrapped with ${pc.cyan('new Error()')}, in other words: ${pc.cyan(
        'throw someValue'
      )} should be replaced with ${pc.cyan('throw new Error(someValue)')}. The thrown value is printed above.`,
      { onlyOnce: false }
    )
  }
}
