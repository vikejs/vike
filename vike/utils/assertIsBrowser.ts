export { assertIsBrowser }

import { isBrowser } from './isBrowser'
import { assert } from './assert'

function assertIsBrowser() {
  assert(isBrowser())
}
