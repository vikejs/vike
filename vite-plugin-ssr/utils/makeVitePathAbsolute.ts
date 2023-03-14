export { makeVitePathAbsolute }

import type { ResolvedConfig } from 'vite'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling'
import { assert } from './assert'
import path from 'path'
import { assertIsVitePluginCode } from './assertIsVitePluginCode'

assertIsVitePluginCode()

// Vite handles paths such as /pages/index.page.js which are relative to `config.root`.
// Make them absolute starting from the filesystem root.
function makeVitePathAbsolute(fileVitePath: string, config: ResolvedConfig): string {
  assertPosixPath(fileVitePath)
  assert(fileVitePath.startsWith('/'))
  const { root } = config
  assertFsAbsolute(root)
  let filePathAbsolute = path.posix.join(root, fileVitePath)
  assertFsAbsolute(filePathAbsolute)
  try {
    filePathAbsolute = require.resolve(filePathAbsolute)
  } catch {
    assert(false)
  }
  filePathAbsolute = toPosixPath(filePathAbsolute)
  assertFsAbsolute(filePathAbsolute)
  return filePathAbsolute
}

/** Assert path is filesystem absolute */
function assertFsAbsolute(p: string) {
  assertPosixPath(p)
  if (process.platform === 'win32') {
    assert(path.win32.isAbsolute(p))
  } else {
    assert(p.startsWith('/'))
  }
}
