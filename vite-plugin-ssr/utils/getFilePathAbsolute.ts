export { getFilePathAbsolute }

import type { ResolvedConfig } from 'vite'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling'
import { assert } from './assert'
import path from 'path'
import { assertIsVitePluginCode } from './assertIsVitePluginCode'
import { isNpmPackageImport } from './isNpmPackage'

assertIsVitePluginCode()

// Vite handles paths such as /pages/index.page.js which are relative to `config.root`.
// Make them absolute starting from the filesystem root.
// Also resolve plus files living in npm packages such as restack/renderer/+onRenderHtml.js
function getFilePathAbsolute(filePath: string, config: ResolvedConfig): string {
  assertPosixPath(filePath)

  if (filePath.startsWith('/@fs/')) {
    return filePath
  }

  let filePathUnresolved: string
  if (isNpmPackageImport(filePath)) {
    filePathUnresolved = filePath
  } else {
    assert(filePath.startsWith('/'))
    const { root } = config
    assertPathIsAbsolute(root)
    filePathUnresolved = path.posix.join(root, filePath)
    assertPathIsAbsolute(filePathUnresolved)
  }

  let filePathAbsolute: string
  try {
    filePathAbsolute = require.resolve(filePathUnresolved, { paths: [config.root] })
  } catch (err) {
    console.error(err)
    assert(false)
  }
  filePathAbsolute = toPosixPath(filePathAbsolute)
  assertPathIsAbsolute(filePathAbsolute)
  return filePathAbsolute
}

/** Assert path is filesystem absolute */
function assertPathIsAbsolute(p: string) {
  assertPosixPath(p)
  if (process.platform === 'win32') {
    assert(path.win32.isAbsolute(p))
  } else {
    assert(p.startsWith('/'))
  }
}
