export { isNonRunnableDev }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

function isNonRunnableDev(): boolean {
  if (typeof __VIKE__IS_NON_RUNNABLE_DEV === 'undefined') return false
  assert(__VIKE__IS_NON_RUNNABLE_DEV === true)
  return true
}
