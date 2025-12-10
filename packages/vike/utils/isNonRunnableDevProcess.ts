export { isNonRunnableDevProcess }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

function isNonRunnableDevProcess(): boolean {
  if (globalThis.__VIKE__IS_NON_RUNNABLE_DEV === undefined) return false
  assert(globalThis.__VIKE__IS_NON_RUNNABLE_DEV === true)
  return true
}
