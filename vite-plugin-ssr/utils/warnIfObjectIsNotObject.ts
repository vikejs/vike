export { warnIfObjectIsNotObject }

import { assertWarning } from './assert.js'
import { isObject } from './isObject.js'

function warnIfObjectIsNotObject(err: unknown): void {
  if (!isObject(err)) {
    console.warn('[vite-plugin-ssr] The thrown value is:')
    console.warn(err)
    assertWarning(
      false,
      "Your source code threw a value that is not an object. Make sure to wrap the value with `new Error()`. For example, if your code throws `throw 'some-string'` then do `throw new Error('some-string')` instead. The thrown value is printed above. Feel free to contact vite-plugin-ssr maintainers to get help.",
      { onlyOnce: false }
    )
  }
}
