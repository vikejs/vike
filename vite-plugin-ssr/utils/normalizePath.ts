import { assert } from './assert'
import { isBrowser } from './isBrowser'

export { normalizePath }

function normalizePath(urlPath: string): string {
  assert(!isBrowser())
  if (process.platform !== 'win32') {
    return urlPath
  }
  const req = require
  return urlPath.split(req('path').sep).join('/')
}
