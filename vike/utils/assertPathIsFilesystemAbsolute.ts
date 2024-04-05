export { assertPathIsFilesystemAbsolute }
export { isPathAbsolute }

import path from 'path'
import { assert } from './assert.js'
import { assertPosixPath } from './filesystemPathHandling.js'

/** Assert path is absolute from the filesystem root */
function assertPathIsFilesystemAbsolute(p: string) {
  assert(isPathAbsolute(p))
}

function isPathAbsolute(p: string) {
  assertPosixPath(p)
  assert(!p.startsWith('/@fs/'))
  let yes: boolean
  if (process.platform !== 'win32') {
    yes = p.startsWith('/')
  } else {
    yes = path.win32.isAbsolute(p)
  }
  assert(yes === path.isAbsolute(p))
  return yes
}
