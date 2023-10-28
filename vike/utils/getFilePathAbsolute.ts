export { getFilePathAbsolute }
export { getFilePathRelativeToUserRootDir }

import type { ResolvedConfig } from 'vite'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling.js'
import { assert } from './assert.js'
import path from 'path'
import { assertIsNotProductionRuntime } from './assertIsNotProductionRuntime.js'
import { isNpmPackageImport } from './isNpmPackage.js'
import { assertPathIsFilesystemAbsolute } from './assertPathIsFilesystemAbsolute.js'
import { createRequire } from 'module'
// @ts-ignore Shimed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)
assertIsNotProductionRuntime()

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
    assertPathIsFilesystemAbsolute(root)
    filePathUnresolved = path.posix.join(root, filePath)
    assertPathIsFilesystemAbsolute(filePathUnresolved)
  }

  let filePathAbsoluteFilesystem: string
  try {
    filePathAbsoluteFilesystem = require_.resolve(filePathUnresolved, { paths: [config.root] })
  } catch (err) {
    console.error(err)
    assert(false)
  }
  filePathAbsoluteFilesystem = toPosixPath(filePathAbsoluteFilesystem)
  assertPathIsFilesystemAbsolute(filePathAbsoluteFilesystem)
  return filePathAbsoluteFilesystem
}

function getFilePathRelativeToUserRootDir(
  filePathAbsoluteFilesystem: string,
  userRootDir: string,
  alwaysRelative = false
): string {
  assertPosixPath(filePathAbsoluteFilesystem)
  assertPosixPath(userRootDir)
  let filePathRelativeToUserRootDir = path.posix.relative(userRootDir, filePathAbsoluteFilesystem)
  if (filePathAbsoluteFilesystem.startsWith(userRootDir)) {
    assert(
      !filePathRelativeToUserRootDir.startsWith('.') && !filePathRelativeToUserRootDir.startsWith('/'),
      // Surprinsingly, this assertion seem to fail sometimes: https://github.com/vikejs/vike/issues/1139
      { filePathRelativeToUserRootDir, filePathAbsoluteFilesystem, userRootDir }
    )
    filePathRelativeToUserRootDir = `/${filePathRelativeToUserRootDir}`
    return filePathRelativeToUserRootDir
  } else {
    if (alwaysRelative) {
      return filePathRelativeToUserRootDir
    } else {
      return filePathAbsoluteFilesystem
    }
  }
}
