export { assertIsBrowser }

import { isBrowser } from './isBrowser.js'
import { assert } from './assert.js'

function assertIsBrowser() {
  assert(isBrowser())
}
