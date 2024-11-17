export { assertIsNotBrowser }

import { isBrowser } from './isBrowser'
import { assert } from './assert'

/** Ensure we don't bloat the client-side */
function assertIsNotBrowser() {
  assert(!isBrowser())
}
