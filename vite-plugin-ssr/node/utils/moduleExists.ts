import { isAbsolute, resolve } from 'path'
import { assert } from './assert'

export { moduleExists }

function moduleExists(modulePath: string, dirPath?: string): boolean {
  if (!isAbsolute(modulePath)) {
    assert(dirPath)
    assert(isAbsolute(dirPath))
    modulePath = resolve(dirPath, modulePath)
  }
  assert(isAbsolute(modulePath))

  // `req` instead of `require` in order to skip Webpack's dependency analysis
  const req = require

  try {
    req.resolve(modulePath)
    return true
  } catch (err) {
    return false
  }
}
