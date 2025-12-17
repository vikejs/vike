export { assertIsNotBrowser }

import { isBrowser } from './isBrowser.js'
import { assert } from './assert.js'

/** Ensure we don't bloat the client-side */
function assertIsNotBrowser() {
  assert(!isBrowser())
}
