import { assert } from './assert.mjs'
import { isBrowser } from './isBrowser.mjs'

export { normalizePath }

function normalizePath(urlPath: string): string {
  assert(!isBrowser())
  if (!isWindows()) {
    return urlPath
  }
  const req = require
  return urlPath.split(req('path').sep).join('/')
}

function isWindows() {
  // `process` is `undefined` in Cloudlfare Pages workers
  if (typeof process === 'undefined') {
    return false
  }
  return process.platform === 'win32'
}
