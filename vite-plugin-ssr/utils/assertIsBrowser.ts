export { assertIsBrowser }

import { isBrowser } from './isBrowser.mjs'
import { assert } from './assert.mjs'

function assertIsBrowser() {
  assert(isBrowser())
}
