export { makeFilePathAbsolute }

import path from 'path'
import type { ResolvedConfig } from 'vite'
import { toPosixPath, assertPosixPath } from './filesystemPathHandling'
import { assert } from './assert'
import { isNodeJS } from './isNodeJS'

// This util should/is only used by node/plugin/utils.ts
assert(isNodeJS())

// Vite handles paths such as `/pages/index.page.js` which are relative to `config.root`.
// Make them absolute starting from the filesystem route `/`.
function makeFilePathAbsolute(filePathRelative: string, config: ResolvedConfig): string {
  assertPosixPath(filePathRelative)
  assert(filePathRelative.startsWith('/'))
  const { root } = config
  assert(!filePathRelative.startsWith(root))
  assert(!isFilesystemAbsolute(filePathRelative))
  const filePathAbsolute = toPosixPath(require.resolve(path.join(root, filePathRelative)))
  return filePathAbsolute
}

function isFilesystemAbsolute(filePath: string) {
  return getRootDir(filePath) === getRootDir(toPosixPath(process.cwd()))
}
function getRootDir(filePath: string) {
  assertPosixPath(filePath)
  return filePath.split('/').filter(Boolean)[0]
}
