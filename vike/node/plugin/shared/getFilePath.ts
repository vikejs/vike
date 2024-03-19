export { getFilePathResolved }
export { getFilePathUnresolved }

import path from 'path'
import { assert, assertPosixPath, hasProp } from '../utils.js'
import type { FilePath, FilePathResolved } from '../../../shared/page-configs/FilePath.js'

function getFilePathUnresolved(
  args: {
    filePathAbsoluteFilesystem: string | null
    filePathAbsoluteUserRootDir: string | null
    importPathAbsolute: string | null
  } & ({ filePathAbsoluteUserRootDir: string } | { importPathAbsolute: string })
): FilePath {
  const { filePathAbsoluteFilesystem, filePathAbsoluteUserRootDir } = args

  let filePathAbsoluteVite: string
  if (args.filePathAbsoluteUserRootDir !== null) {
    filePathAbsoluteVite = args.filePathAbsoluteUserRootDir
  } else {
    assert(args.importPathAbsolute !== null) // Help TS
    filePathAbsoluteVite = args.importPathAbsolute
  }

  return {
    ...args,
    filePathAbsoluteVite,
    filePathToShowToUser: filePathAbsoluteVite,
    filePathToShowToUserResolved: filePathAbsoluteUserRootDir || filePathAbsoluteFilesystem
  }
}

function getFilePathResolved(
  args: {
    userRootDir: string
    importPathAbsolute: string | null
  } & ({ filePathAbsoluteFilesystem: string } | { filePathAbsoluteUserRootDir: string })
): FilePathResolved {
  const { userRootDir, importPathAbsolute } = args

  let filePathAbsoluteFilesystem: string
  let filePathAbsoluteUserRootDir: string | null
  if ('filePathAbsoluteFilesystem' in args) {
    filePathAbsoluteFilesystem = args.filePathAbsoluteFilesystem
    filePathAbsoluteUserRootDir = getFilePathAbsoluteUserRootDir({ filePathAbsoluteFilesystem, userRootDir })
  } else {
    filePathAbsoluteUserRootDir = args.filePathAbsoluteUserRootDir
    filePathAbsoluteFilesystem = getFilePathAbsoluteUserFilesystem({ filePathAbsoluteUserRootDir, userRootDir })
  }

  let filePathResolved: FilePath

  const common = {
    filePathAbsoluteUserRootDir,
    filePathAbsoluteFilesystem,
    importPathAbsolute,
    userRootDir
  }
  if (importPathAbsolute) {
    filePathResolved = getFilePathUnresolved({
      ...common,
      importPathAbsolute
    })
  } else {
    assert(filePathAbsoluteUserRootDir)
    filePathResolved = getFilePathUnresolved({
      ...common,
      filePathAbsoluteUserRootDir
    })
  }

  assert(filePathAbsoluteFilesystem)
  assert(hasProp(filePathResolved, 'filePathAbsoluteFilesystem', 'string'))
  assert(hasProp(filePathResolved, 'filePathToShowToUserResolved', 'string'))

  return filePathResolved
}

function getFilePathAbsoluteUserFilesystem({
  filePathAbsoluteUserRootDir,
  userRootDir
}: {
  filePathAbsoluteUserRootDir: string
  userRootDir: string
}): string {
  assertPosixPath(filePathAbsoluteUserRootDir)
  assertPosixPath(userRootDir)
  const filePathAbsoluteFilesystem = path.posix.join(userRootDir, filePathAbsoluteUserRootDir)
  return filePathAbsoluteFilesystem
}
function getFilePathAbsoluteUserRootDir({
  filePathAbsoluteFilesystem,
  userRootDir
}: {
  filePathAbsoluteFilesystem: string
  userRootDir: string
}): string | null {
  assertPosixPath(filePathAbsoluteFilesystem)
  assertPosixPath(userRootDir)

  const filePathRelativeToUserRootDir = path.posix.relative(userRootDir, filePathAbsoluteFilesystem)

  if (!filePathAbsoluteFilesystem.startsWith(userRootDir)) {
    return null
  }

  let filePathAbsoluteUserRootDir: string
  {
    let filePathAbsoluteUserRootDir1 = filePathAbsoluteFilesystem.slice(userRootDir.length)
    if (!filePathAbsoluteUserRootDir1.startsWith('/')) filePathAbsoluteUserRootDir1 = '/' + filePathAbsoluteUserRootDir1
    filePathAbsoluteUserRootDir = filePathAbsoluteUserRootDir1
  }
  {
    let filePathAbsoluteUserRootDir2 = filePathRelativeToUserRootDir
    assert(!filePathAbsoluteUserRootDir2.startsWith('.') && !filePathAbsoluteUserRootDir2.startsWith('/'))
    filePathAbsoluteUserRootDir2 = '/' + filePathAbsoluteUserRootDir2
    assert(filePathAbsoluteUserRootDir === filePathAbsoluteUserRootDir2)
  }

  return filePathAbsoluteUserRootDir
}
