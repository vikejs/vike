import { assert } from './assert'

testRequireShim()

function testRequireShim() {
  let req: NodeRequire | undefined
  try {
    req = require
  } catch {}
  if (!req) return
  // Ensure that our globalThis.require doesn't overwrite the native require() implementation
  assert(!('isShimAddedByVitePluginSsr' in require))
}
