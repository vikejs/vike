export { makeFilePathAbsolute }

import path from 'path'
import type { ResolvedConfig } from 'vite'
import { toPosixPath, assertPosixPath } from './filesystemPathHandling'
import { assert } from './assert'

// Vite handles paths such as `/pages/index.page.js` which are relative to `config.root`.
// Make them absolute starting from the filesystem route `/`.
function makeFilePathAbsolute(filePathRelative: string, config: ResolvedConfig): string {
  assertPosixPath(filePathRelative)
  assert(filePathRelative.startsWith('/'))
  const cwd = config.root
  const filePathAbsolute = toPosixPath(require.resolve(path.join(cwd, filePathRelative)))
  return filePathAbsolute
}
