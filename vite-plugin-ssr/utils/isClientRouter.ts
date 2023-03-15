export { isClientRouter }

import { assert } from './assert'
import { isBrowser } from './isBrowser'

assert(isBrowser())

function isClientRouter(): boolean {
  return globalThis.__vps_isClientRouter === true
}
declare global {
  var __vps_isClientRouter: true
}
