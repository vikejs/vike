export { isNonRunnableDev }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

function isNonRunnableDev(): boolean | null {
  if (typeof __VIKE__IS_NON_RUNNABLE_DEV === 'undefined') return null
  const yes = __VIKE__IS_NON_RUNNABLE_DEV
  assert(typeof yes === 'boolean')
  return yes
}
