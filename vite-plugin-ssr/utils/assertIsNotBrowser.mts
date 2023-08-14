export { assertIsNotBrowser }

import { isBrowser } from './isBrowser.mjs'
import { assert } from './assert.mjs'

/** Ensure we don't bloat the client-side */
function assertIsNotBrowser() {
  assert(!isBrowser())
}
