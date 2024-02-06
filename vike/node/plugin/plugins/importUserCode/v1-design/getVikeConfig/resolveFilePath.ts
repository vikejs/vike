export { resolveFilePathRelativeToUserRootDir }
export { resolveFilePathAbsoluteFilesystem }

import path from 'path'
import { assert, assertPosixPath } from '../../../../utils.js'
import type { FilePathResolved } from '../../../../../../shared/page-configs/PageConfig.js'

function resolveFilePathRelativeToUserRootDir(
  filePathRelativeToUserRootDir: string,
  userRootDir: string
): FilePathResolved {
  assertPosixPath(filePathRelativeToUserRootDir)
  assertPosixPath(userRootDir)
  const filePathAbsoluteFilesystem = path.posix.join(userRootDir, filePathRelativeToUserRootDir)
  return getFilePathResolved(filePathRelativeToUserRootDir, filePathAbsoluteFilesystem)
}

function resolveFilePathAbsoluteFilesystem(filePathAbsoluteFilesystem: string, userRootDir: string): FilePathResolved {
  assertPosixPath(filePathAbsoluteFilesystem)
  assertPosixPath(userRootDir)
  let filePathRelativeToUserRootDir = path.posix.relative(userRootDir, filePathAbsoluteFilesystem)
  assert(!filePathRelativeToUserRootDir.startsWith('.') && !filePathRelativeToUserRootDir.startsWith('/'))
  filePathRelativeToUserRootDir = '/' + filePathRelativeToUserRootDir
  return getFilePathResolved(filePathRelativeToUserRootDir, filePathAbsoluteFilesystem)
}

function getFilePathResolved(
  filePathRelativeToUserRootDir: string,
  filePathAbsoluteFilesystem: string
): FilePathResolved {
  return {
    filePathRelativeToUserRootDir,
    filePathAbsoluteVite: filePathRelativeToUserRootDir,
    filePathAbsoluteFilesystem,
    filePathToShowToUser: filePathRelativeToUserRootDir,
    importPathAbsolute: null
  }
}
