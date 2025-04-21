export { resolvePointerImport }
export { resolvePointerImportData }
export type { PointerImport }

import pc from '@brillout/picocolors'
import type { DefinedAtFilePath } from '../../../../../../shared/page-configs/PageConfig.js'
import {
  assert,
  assertPosixPath,
  assertUsage,
  isFilePathAbsolute,
  isImportPathRelative,
  isImportPathNpmPackageOrPathAlias,
  requireResolveOptional
} from '../../../../utils.js'
import { type PointerImportData, assertPointerImportPath, parsePointerImportData } from './pointerImports.js'
import {
  getFilePathAbsoluteUserRootDir,
  getFilePathResolved,
  getFilePathUnresolved
} from '../../../../shared/getFilePath.js'
import type { FilePath, FilePathResolved } from '../../../../../../shared/page-configs/FilePath.js'

type PointerImport = { fileExportPath: FileExportPath }
type FileExportPath = DefinedAtFilePath & Required<Pick<DefinedAtFilePath, 'fileExportName'>>
function resolvePointerImport(
  configValue: unknown,
  importerFilePath: FilePathResolved,
  userRootDir: string,
  configName: string
): null | PointerImport {
  if (typeof configValue !== 'string') return null
  const pointerImportData = parsePointerImportData(configValue)
  if (!pointerImportData) return null
  const { exportName } = pointerImportData

  const filePath = resolvePointerImportData(pointerImportData, importerFilePath, userRootDir)
  const fileExportPathToShowToUser = exportName === 'default' || exportName === configName ? [] : [exportName]

  const fileExportPath: FileExportPath = {
    ...filePath,
    fileExportName: exportName,
    fileExportPathToShowToUser
  }
  return { fileExportPath }
}

function resolvePointerImportData(
  pointerImportData: PointerImportData,
  importerFilePath: FilePathResolved,
  userRootDir: string
): FilePath {
  const { importPath } = pointerImportData
  assertPointerImportPath(importPath)

  const filePathAbsoluteFilesystem = resolveImportPathWithNode(pointerImportData, importerFilePath, userRootDir)

  let filePath: FilePath
  assertPosixPath(importPath)
  if (isImportPathRelative(importPath) || isFilePathAbsolute(importPath)) {
    // Pointer imports are included in virtual files, thus relative imports need to be resolved. (Virtual modules cannot contain relative imports.)
    assertUsageResolutionSuccess(filePathAbsoluteFilesystem, pointerImportData, importerFilePath)

    // Pointer imports are included in virtual files, and we need filePathAbsoluteUserRootDir because we didn't find a way to have filesystem absolute import paths in virtual files: https://gist.github.com/brillout/2315231c9a8164f950c64b4b4a7bbd39
    const errSuffix = `outside of the ${userRootDir} directory which is forbidden: make sure your import paths resolve inside the ${userRootDir} directory, or import from an npm package.`
    const filePathAbsoluteUserRootDir = getFilePathAbsoluteUserRootDir({ filePathAbsoluteFilesystem, userRootDir })
    if (isImportPathRelative(importPath)) {
      assertUsage(
        filePathAbsoluteUserRootDir,
        `The relative import ${pc.cyan(importPath)} defined by ${
          importerFilePath.filePathToShowToUser
        } resolves to ${filePathAbsoluteFilesystem} ${errSuffix}`
      )
    } else {
      assert(isFilePathAbsolute(importPath))
      assertUsage(
        filePathAbsoluteUserRootDir,
        `The import path ${importPath} defined by ${importerFilePath.filePathToShowToUser} is ${errSuffix}`
      )
    }
    // Forbid node_modules/ because it's brittle: if node_modules/ lives outside of userRootDir then it crashes.
    assertUsage(
      !filePathAbsoluteUserRootDir.includes('/node_modules/'),
      `The import path ${importPath} defined by ${importerFilePath.filePathToShowToUser} resolves to ${filePathAbsoluteFilesystem} inside of node_modules/ which is forbbiden: use an npm package import instead.`
    )

    filePath = getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
  } else {
    assert(isImportPathNpmPackageOrPathAlias(importPath))
    const importPathAbsolute = importPath
    if (filePathAbsoluteFilesystem) {
      filePath = getFilePathResolved({
        userRootDir,
        filePathAbsoluteFilesystem,
        importPathAbsolute
      })
    } else {
      // We cannot resolve path aliases defined only in Vite
      filePath = getFilePathUnresolved({
        importPathAbsolute
      })
    }
  }

  return filePath
}

function resolveImportPathWithNode(
  pointerImportData: PointerImportData,
  importerFilePath: FilePathResolved,
  userRootDir: string
): string | null {
  const importerFilePathAbsolute = importerFilePath.filePathAbsoluteFilesystem
  assertPosixPath(importerFilePathAbsolute)
  // filePathAbsoluteFilesystem is null when pointerImportData.importPath is a path alias that Node.js doesn't know about
  const filePathAbsoluteFilesystem = requireResolveOptional({
    importPath: pointerImportData.importPath,
    importerFile: importerFilePathAbsolute,
    userRootDir
  })
  if (!filePathAbsoluteFilesystem) {
    assert(!isImportPathRelative(pointerImportData.importPath))
    // Libraries don't use path aliases => filePathAbsoluteFilesystem should be defined
    assert(!importerFilePathAbsolute.includes('node_modules'))
  }
  return filePathAbsoluteFilesystem
}

function assertUsageResolutionSuccess(
  filePathAbsoluteFilesystem: string | null,
  pointerImportData: PointerImportData,
  importerFilePath: FilePathResolved
): asserts filePathAbsoluteFilesystem is string {
  const { importPath: importPath, importStringWasGenerated, importString } = pointerImportData
  const { filePathToShowToUser } = importerFilePath

  if (!filePathAbsoluteFilesystem) {
    const importPathString = pc.code(`${importPath}`)
    const errIntro = importStringWasGenerated
      ? (`The import path ${importPathString} in ${filePathToShowToUser}` as const)
      : (`The import ${pc.code(importString)} defined by ${filePathToShowToUser}` as const)
    const errIntro2 = `${errIntro} couldn't be resolved: does ${importPathString}` as const
    if (isImportPathRelative(importPath)) {
      assertUsage(false, `${errIntro2} point to an existing file?`)
    } else {
      assertUsage(false, `${errIntro2} exist?`)
    }
  }
}
