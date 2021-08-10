import { assert } from './assert'

export { isNodejs }

// We don't use `isNodejs()` anymore because it doesn't work for Cloudflare Workers
function isNodejs() {
  assert(false)
  // return typeof process !== 'undefined' && typeof process.versions.node !== 'undefined'
}
