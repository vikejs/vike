export { assertPathIsFilesystemAbsolute }

import path from 'path'
import { assert } from './assert.js'
import { assertPosixPath } from './filesystemPathHandling.js'

/** Assert path is absolute from the filesystem root */
function assertPathIsFilesystemAbsolute(p: string) {
  assertPosixPath(p)
  if (process.platform === 'win32') {
    assert(path.win32.isAbsolute(p))
  } else {
    assert(p.startsWith('/'))
  }
}
