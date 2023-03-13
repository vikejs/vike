import { assert } from './assert'

testRequireShim()

function testRequireShim() {
  let req: NodeRequire | undefined
  try {
    req = require
  } catch {}
  if (!req) return
  assert(!('isShimAddedByVitePluginSsr' in require))
}
