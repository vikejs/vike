export { resolveFilePathRelativeToUserRootDir }
export { resolveFilePathAbsoluteFilesystem }

import path from 'path'
import { assert, assertPosixPath } from '../../../../utils.js'
import type { FilePathResolved } from '../../../../../../shared/page-configs/PageConfig.js'

function resolveFilePathRelativeToUserRootDir(
  filePathAbsoluteUserRootDir: string,
  userRootDir: string
): FilePathResolved {
  assertPosixPath(filePathAbsoluteUserRootDir)
  assertPosixPath(userRootDir)
  const filePathAbsoluteFilesystem = path.posix.join(userRootDir, filePathAbsoluteUserRootDir)
  return getFilePathResolved(filePathAbsoluteUserRootDir, filePathAbsoluteFilesystem)
}

function resolveFilePathAbsoluteFilesystem(filePathAbsoluteFilesystem: string, userRootDir: string): FilePathResolved {
  assertPosixPath(filePathAbsoluteFilesystem)
  assertPosixPath(userRootDir)
  let filePathAbsoluteUserRootDir = path.posix.relative(userRootDir, filePathAbsoluteFilesystem)
  assert(!filePathAbsoluteUserRootDir.startsWith('.') && !filePathAbsoluteUserRootDir.startsWith('/'))
  filePathAbsoluteUserRootDir = '/' + filePathAbsoluteUserRootDir
  return getFilePathResolved(filePathAbsoluteUserRootDir, filePathAbsoluteFilesystem)
}

function getFilePathResolved(
  filePathAbsoluteUserRootDir: string,
  filePathAbsoluteFilesystem: string
): FilePathResolved {
  return {
    filePathAbsoluteUserRootDir,
    filePathAbsoluteVite: filePathAbsoluteUserRootDir,
    filePathAbsoluteFilesystem,
    filePathToShowToUser: filePathAbsoluteUserRootDir,
    importPathAbsolute: null
  }
}
