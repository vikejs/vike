export { getFilePathResolved }
export { getFilePathUnresolved }
export { getModuleFilePath }
export { getFilePathToShowToUserFromUnkown }
export { cleanFilePathUnkown }

import path from 'path'
import { assert, assertPathIsFilesystemAbsolute, assertPosixPath, toPosixPath } from '../utils.js'
import type { FilePath, FilePathResolved } from '../../../shared/page-configs/FilePath.js'
import type { ResolvedConfig } from 'vite'

function getFilePathUnresolved({ importPathAbsolute }: { importPathAbsolute: string }): FilePath {
  return getFilePath({ importPathAbsolute, filePathAbsoluteUserRootDir: null })
}

function getFilePathResolved(
  args: {
    userRootDir: string
    importPathAbsolute?: string
  } & ({ filePathAbsoluteFilesystem: string } | { filePathAbsoluteUserRootDir: string })
): FilePathResolved {
  const { userRootDir } = args
  const importPathAbsolute = args.importPathAbsolute ?? null

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
    importPathAbsolute,
    userRootDir
  }
  if (importPathAbsolute) {
    filePath = getFilePath({
      ...common,
      importPathAbsolute
    })
  } else {
    assert(filePathAbsoluteUserRootDir)
    filePath = getFilePath({
      ...common,
      filePathAbsoluteUserRootDir
    })
  }

  assert(filePathAbsoluteFilesystem)
  assertPathIsFilesystemAbsolute(filePathAbsoluteFilesystem)
  const filePathToShowToUserResolved = filePathAbsoluteUserRootDir || filePathAbsoluteFilesystem
  assert(filePathToShowToUserResolved)
  const filePathResolved: FilePathResolved = {
    ...filePath,
    filePathAbsoluteFilesystem,
    filePathToShowToUserResolved
  }

  return filePathResolved
}

function getFilePath(
  args: {
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
    filePathAbsoluteFilesystem: null,
    filePathAbsoluteVite,
    filePathToShowToUser
  }
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
  assertPathIsFilesystemAbsolute(userRootDir)
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
  assert(filePathAbsoluteUserRootDir === getFilePathAbsoluteUserRootDir2(filePathAbsoluteFilesystem, userRootDir))
  return filePathAbsoluteUserRootDir
}

function getModuleFilePath(moduleId: string, config: ResolvedConfig): string {
  const userRootDir = config.root
  assertPosixPath(moduleId)
  assertPosixPath(userRootDir)

  const filePathAbsoluteFilesystem = cleanModuleId(moduleId)
  assertPathIsFilesystemAbsolute(filePathAbsoluteFilesystem)

  const filePath = getFilePathResolved({ filePathAbsoluteFilesystem, userRootDir })

  return filePath.filePathToShowToUserResolved
}

function getFilePathToShowToUserFromUnkown(
  // We don't have any guarentee about filePath, e.g. about whether is filePathAbsoluteFilesystem or filePathAbsoluteUserRootDir
  filePathUnkown: string,
  userRootDir: string
): string {
  assertPosixPath(userRootDir)
  assertPathIsFilesystemAbsolute(userRootDir)

  filePathUnkown = cleanFilePathUnkown(filePathUnkown)

  if (!filePathUnkown.startsWith(userRootDir)) {
    return filePathUnkown
  } else {
    return getFilePathAbsoluteUserRootDir2(filePathUnkown, userRootDir)
  }
}

function getFilePathAbsoluteUserRootDir2(filePathAbsoluteFilesystem: string, userRootDir: string): string {
  assert(filePathAbsoluteFilesystem.startsWith(userRootDir))
  let filePathAbsoluteUserRootDir = filePathAbsoluteFilesystem.slice(userRootDir.length)
  if (!filePathAbsoluteUserRootDir.startsWith('/')) filePathAbsoluteUserRootDir = '/' + filePathAbsoluteUserRootDir
  return filePathAbsoluteUserRootDir
}

function cleanFilePathUnkown(filePathUnknown: string) {
  filePathUnknown = toPosixPath(filePathUnknown)
  filePathUnknown = cleanModuleId(filePathUnknown)
  return filePathUnknown
}

function cleanModuleId(moduleId: string): string {
  // remove query
  const parts = moduleId.split('?')
  if (parts.length > 1) parts.pop()
  assert(parts.length >= 1)
  return parts.join('?')
}
