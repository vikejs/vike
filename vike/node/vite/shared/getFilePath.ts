export { getFilePathResolved }
export { getFilePathUnresolved }
export { getFilePathAbsoluteUserRootDir }
export { getFilePathToShowToUserFromUnkown }
export { getModuleFilePathAbsolute }
export { getModuleFilePathRelative }
export { cleanFilePathUnkown }
export { assertModuleId }

import path from 'path'
import {
  assert,
  assertIsImportPathNpmPackage,
  assertFilePathAbsoluteFilesystem,
  assertPosixPath,
  toPosixPath
} from '../utils.js'
import type { FilePathResolved, FilePathUnresolved } from '../../../shared/page-configs/FilePath.js'
import type { ResolvedConfig } from 'vite'

function getFilePathResolved(
  args: {
    userRootDir: string
  } & (
    | { filePathAbsoluteFilesystem: string; importPathAbsolute: string }
    | { filePathAbsoluteUserRootDir: string; importPathAbsolute?: string }
  )
): FilePathResolved {
  const { userRootDir } = args

  let filePathAbsoluteFilesystem: string
  let filePathAbsoluteUserRootDir: string | null
  if ('filePathAbsoluteFilesystem' in args) {
    filePathAbsoluteFilesystem = args.filePathAbsoluteFilesystem
    filePathAbsoluteUserRootDir = getFilePathAbsoluteUserRootDir({ filePathAbsoluteFilesystem, userRootDir })
  } else {
    filePathAbsoluteUserRootDir = args.filePathAbsoluteUserRootDir
    filePathAbsoluteFilesystem = getFilePathAbsoluteUserFilesystem({ filePathAbsoluteUserRootDir, userRootDir })
  }

  assert(filePathAbsoluteFilesystem)
  assertFilePathAbsoluteFilesystem(filePathAbsoluteFilesystem)
  const filePathToShowToUserResolved = filePathAbsoluteUserRootDir || filePathAbsoluteFilesystem
  assert(filePathToShowToUserResolved)

  assertPosixPath(filePathAbsoluteFilesystem)
  const fileName = path.posix.basename(filePathAbsoluteFilesystem)

  const filePathResolved: FilePathResolved = {
    ...getComputedProps(args),
    filePathAbsoluteFilesystem,
    filePathToShowToUserResolved,
    fileName
  }
  return filePathResolved
}

function getComputedProps(
  args: { importPathAbsolute: string } | { filePathAbsoluteUserRootDir: string; importPathAbsolute?: string }
) {
  if ('filePathAbsoluteUserRootDir' in args) {
    const importPathAbsolute = args.importPathAbsolute ?? null
    const { filePathAbsoluteUserRootDir } = args
    if (importPathAbsolute) assertIsImportPathNpmPackage(importPathAbsolute)
    return {
      importPathAbsolute,
      filePathAbsoluteUserRootDir,
      filePathAbsoluteVite: filePathAbsoluteUserRootDir,
      filePathToShowToUser: filePathAbsoluteUserRootDir
    }
  } else {
    return getComputedPropsImportPathAbsolute(args)
  }
}
function getComputedPropsImportPathAbsolute(args: { importPathAbsolute: string }) {
  const { importPathAbsolute } = args
  assertIsImportPathNpmPackage(importPathAbsolute)
  return {
    filePathAbsoluteUserRootDir: null,
    importPathAbsolute,
    filePathAbsoluteVite: importPathAbsolute,
    filePathToShowToUser: importPathAbsolute
  }
}

function getFilePathUnresolved(args: { importPathAbsolute: string }): FilePathUnresolved {
  return {
    ...getComputedPropsImportPathAbsolute(args),
    filePathAbsoluteFilesystem: null
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
  assertFilePathAbsoluteFilesystem(userRootDir)

  const filePathAbsoluteFilesystem = path.posix.join(userRootDir, filePathAbsoluteUserRootDir)
  assertFilePathAbsoluteFilesystem(userRootDir)
  return filePathAbsoluteFilesystem
}
function getFilePathAbsoluteUserRootDir({
  filePathAbsoluteFilesystem,
  userRootDir
}: {
  filePathAbsoluteFilesystem: string
  userRootDir: string
}): string | null {
  const { filePathAbsoluteUserRootDir } = getFilePathRelative({
    filePathAbsoluteFilesystem,
    userRootDir
  })
  return filePathAbsoluteUserRootDir
}
function getFilePathRelative({
  filePathAbsoluteFilesystem,
  userRootDir
}: {
  filePathAbsoluteFilesystem: string
  userRootDir: string
}) {
  assertPosixPath(filePathAbsoluteFilesystem)
  assertPosixPath(userRootDir)
  assertFilePathAbsoluteFilesystem(filePathAbsoluteFilesystem)
  assertFilePathAbsoluteFilesystem(userRootDir)

  const filePathRelativeUserRootDir = path.posix.relative(userRootDir, filePathAbsoluteFilesystem)

  if (!filePathAbsoluteFilesystem.startsWith(userRootDir)) {
    assert(filePathRelativeUserRootDir.startsWith('../'))
    return {
      filePathAbsoluteUserRootDir: null,
      filePathRelativeUserRootDir
    }
  } else {
    assert(
      !filePathRelativeUserRootDir.startsWith('/') &&
        /* Not true if filePathRelative starts with a hidden directory  (i.e. a directory with a name that starts with `.`)
        !filePathRelative.startsWith('.') &&
        */
        !filePathRelativeUserRootDir.startsWith('./') &&
        !filePathRelativeUserRootDir.startsWith('../')
    )
    const filePathAbsoluteUserRootDir = `/${filePathRelativeUserRootDir}`
    assert(filePathAbsoluteUserRootDir === getFilePathAbsoluteUserRootDir2(filePathAbsoluteFilesystem, userRootDir))
    return { filePathAbsoluteUserRootDir, filePathRelativeUserRootDir }
  }
}

function getModuleFilePathAbsolute(moduleId: string, config: ResolvedConfig): string {
  const { filePathAbsoluteUserRootDir, filePathAbsoluteFilesystem } = getModuleFilePath(moduleId, config)
  return filePathAbsoluteUserRootDir || filePathAbsoluteFilesystem
}
function getModuleFilePathRelative(moduleId: string, config: ResolvedConfig): string {
  const { filePathRelativeUserRootDir } = getModuleFilePath(moduleId, config)
  return filePathRelativeUserRootDir
}
function getModuleFilePath(moduleId: string, config: ResolvedConfig) {
  const userRootDir = config.root
  assertModuleId(moduleId)
  assertPosixPath(userRootDir)
  assertFilePathAbsoluteFilesystem(userRootDir)

  const filePathAbsoluteFilesystem = cleanModuleId(moduleId)
  assertFilePathAbsoluteFilesystem(filePathAbsoluteFilesystem)

  const { filePathAbsoluteUserRootDir, filePathRelativeUserRootDir } = getFilePathRelative({
    filePathAbsoluteFilesystem,
    userRootDir
  })

  return { filePathAbsoluteFilesystem, filePathAbsoluteUserRootDir, filePathRelativeUserRootDir }
}
function assertModuleId(moduleId: string) {
  assertPosixPath(moduleId)
  assertFilePathAbsoluteFilesystem(moduleId) // Can moduleId be something else than the filesystem absolute path?
}

function getFilePathToShowToUserFromUnkown(
  // We don't have any guarentee about filePath, e.g. about whether is filePathAbsoluteFilesystem or filePathAbsoluteUserRootDir
  filePathUnkown: string,
  userRootDir: string
): string {
  assertPosixPath(userRootDir)
  assertFilePathAbsoluteFilesystem(userRootDir)

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
