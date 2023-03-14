export { makeVitePathAbsolute }

import path from 'path'
import type { ResolvedConfig } from 'vite'
import { assertPosixPath } from './filesystemPathHandling'
import { assert } from './assert'
import { isNodeJS } from './isNodeJS'

// This util should/is only used by node/plugin/utils.ts
assert(isNodeJS())

// Vite handles paths such as `/pages/index.page.js` which are relative to `config.root`.
// Make them absolute starting from the filesystem route `/`.
function makeVitePathAbsolute(fileVitePath: string, config: ResolvedConfig): string {
  assertPath(fileVitePath)
  const { root } = config
  assertPath(root)
  let filePathAbsolute = path.posix.join(root, fileVitePath)
  assertPath(filePathAbsolute)
  try {
    filePathAbsolute = require.resolve(filePathAbsolute)
  } catch {
    assert(false)
  }
  assertPath(filePathAbsolute)
  return filePathAbsolute
}

function assertPath(p: string) {
  assertPosixPath(p)
  assert(p.startsWith('/'))
}
