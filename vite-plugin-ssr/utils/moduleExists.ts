export { moduleExists }

import { isAbsolute, resolve } from 'pathe'
import { assert } from './assert'

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
  } catch {
    return false
  }
}
