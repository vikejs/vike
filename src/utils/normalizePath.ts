import { assert } from './assert'
import { isNodejs } from './isNodejs'

export { normalizePath }

function normalizePath(urlPath: string): string {
  assert(isNodejs())
  if (process.platform !== 'win32') {
    return urlPath
  }
  const req = require
  return urlPath.split(req('path').sep).join('/')
}
