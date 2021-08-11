import { isAbsolute, resolve } from 'path'
import { assert } from './assert'

export { moduleExists }

function moduleExists(modulePath: string, __dirname?: string): boolean {
  if (!isAbsolute(modulePath)) {
    assert(__dirname)
    modulePath = resolve(__dirname, modulePath)
  }
  assert(isAbsolute(modulePath))

  // `req` instead of `require` so that Webpack doesn't do dynamic dependency analysis
  const req = require

  try {
    req.resolve(modulePath)
    return true
  } catch (err) {
    return false
  }
}
