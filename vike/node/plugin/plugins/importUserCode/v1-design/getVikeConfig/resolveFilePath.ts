export { resolveFilePathRelativeToUserRootDir }

import path from 'path'
import { assertPosixPath } from '../../../../utils.js'
import type { FilePathResolved } from '../../../../../../shared/page-configs/PageConfig.js'

function resolveFilePathRelativeToUserRootDir(
  filePathRelativeToUserRootDir: string,
  userRootDir: string
): FilePathResolved {
  assertPosixPath(filePathRelativeToUserRootDir)
  const filePathAbsoluteFilesystem = path.posix.join(userRootDir, filePathRelativeToUserRootDir)
  return {
    filePathRelativeToUserRootDir,
    filePathAbsoluteVite: filePathRelativeToUserRootDir,
    filePathAbsoluteFilesystem,
    filePathToShowToUser: filePathRelativeToUserRootDir,
    importPathAbsolute: null
  }
}
