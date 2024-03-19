export { getFilePathResolved }
export { getFilePathUnresolved }

import path from 'path'
import { assert, assertPosixPath, hasProp } from '../utils.js'
import type { FilePath, FilePathResolved } from '../../../shared/page-configs/FilePath.js'
import { assertPathIsFilesystemAbsolute } from '../../../utils/assertPathIsFilesystemAbsolute.js'

function getFilePathUnresolved(
  args: {
    filePathAbsoluteFilesystem: string | null
    filePathAbsoluteUserRootDir: string | null
    importPathAbsolute: string | null
  } & ({ filePathAbsoluteUserRootDir: string } | { importPathAbsolute: string })
): FilePath {
  let filePathAbsoluteVite: string
  if (args.filePathAbsoluteUserRootDir !== null) {
    filePathAbsoluteVite = args.filePathAbsoluteUserRootDir
  } else {
    assert(args.importPathAbsolute !== null) // Help TS
    filePathAbsoluteVite = args.importPathAbsolute
  }

  const filePathToShowToUser = filePathAbsoluteVite
  assert(filePathToShowToUser)

  return {
    ...args,
    filePathAbsoluteVite,
    filePathToShowToUser
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

  let filePath: FilePath
  const common = {
    filePathAbsoluteUserRootDir,
    filePathAbsoluteFilesystem,
    importPathAbsolute,
    userRootDir
  }
  if (importPathAbsolute) {
    filePath = getFilePathUnresolved({
      ...common,
      importPathAbsolute
    })
  } else {
    assert(filePathAbsoluteUserRootDir)
    filePath = getFilePathUnresolved({
      ...common,
      filePathAbsoluteUserRootDir
    })
  }
  assert(hasProp(filePath, 'filePathAbsoluteFilesystem', 'string'))

  const filePathToShowToUserResolved = filePathAbsoluteUserRootDir || filePathAbsoluteFilesystem
  assert(filePathToShowToUserResolved)
  const filePathResolved: FilePathResolved = {
    ...filePath,
    filePathToShowToUserResolved
  }

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
  assertPathIsFilesystemAbsolute(userRootDir)

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
  assertPathIsFilesystemAbsolute(filePathAbsoluteFilesystem)
  assertPathIsFilesystemAbsolute(userRootDir)

  const filePathRelative = path.posix.relative(userRootDir, filePathAbsoluteFilesystem)

  if (!filePathAbsoluteFilesystem.startsWith(userRootDir)) {
    assert(filePathRelative.startsWith('../'))
    return null
  }

  assert(!filePathRelative.startsWith('.') && !filePathRelative.startsWith('/'))
  const filePathAbsoluteUserRootDir = `/${filePathRelative}`
  {
    let check = filePathAbsoluteFilesystem.slice(userRootDir.length)
    if (!check.startsWith('/')) check = '/' + check
    assert(filePathAbsoluteUserRootDir === check)
  }
  return filePathAbsoluteUserRootDir
}
