export { resolvePointerImportOfConfig }
export { resolvePointerImport }
export { clearFilesEnvMap }

import pc from '@brillout/picocolors'
import type { ConfigEnvInternal, DefinedAtFilePath } from '../../../../../../shared/page-configs/PageConfig.js'
import {
  assert,
  assertIsNpmPackageImport,
  assertPosixPath,
  assertUsage,
  deepEqual,
  isFilePathAbsolute,
  isNpmPackageImport_unreliable,
  requireResolve
} from '../../../../utils.js'
import { type PointerImportData, parsePointerImportData } from './transformFileImports.js'
import path from 'path'
import {
  getFilePathAbsoluteUserRootDir,
  getFilePathResolved,
  getFilePathUnresolved
} from '../../../../shared/getFilePath.js'
import type { FilePath, FilePathResolved } from '../../../../../../shared/page-configs/FilePath.js'
import { getErrorMessage_importPathOutsideOfRoot } from './transpileAndExecuteFile.js'

const filesEnvMap: Map<string, { configEnv: ConfigEnvInternal; configName: string }[]> = new Map()

type PointerImportResolved = DefinedAtFilePath & { fileExportName: string }

function resolvePointerImportOfConfig(
  configValue: unknown,
  importerFilePath: FilePathResolved,
  userRootDir: string,
  configEnv: ConfigEnvInternal,
  configName: string
): null | PointerImportResolved {
  if (typeof configValue !== 'string') return null
  const pointerImportData = parsePointerImportData(configValue)
  if (!pointerImportData) return null
  const { importPath, exportName } = pointerImportData

  const filePath = resolvePointerImport(pointerImportData, importerFilePath, userRootDir)
  const fileExportPathToShowToUser = exportName === 'default' || exportName === configName ? [] : [exportName]

  assertFileEnv(filePath.filePathAbsoluteFilesystem, importPath, configEnv, configName)

  return {
    ...filePath,
    fileExportName: exportName,
    fileExportPathToShowToUser
  }
}

function resolvePointerImport(
  pointerImportData: PointerImportData,
  importerFilePath: FilePathResolved,
  userRootDir: string
): FilePath {
  const { importPath } = pointerImportData
  const filePathAbsoluteFilesystem = resolveImportPathWithNode(pointerImportData, importerFilePath)

  const errInvalidImport = `Invalid import ${pc.code(importPath)} because it should start with ${pc.code(
    './'
  )} or ${pc.code('../')}, or be an npm package import.`

  let filePath: FilePath
  // - importPath is one of the following. (See `transpileAndExecuteFile()`.)
  //   - A relative import path
  //   - A filesystem absolute path
  //   - An npm package import
  // - importPath cannot be a path alias (since esbuild resolves path aliases, see transpileAndExecuteFile.ts)
  assertPosixPath(importPath)
  if (importPath.startsWith('.') || isFilePathAbsolute(importPath)) {
    if (importPath.startsWith('.')) {
      assertUsage(importPath.startsWith('./') || importPath.startsWith('../'), errInvalidImport)
    }
    assertImportPath(filePathAbsoluteFilesystem, pointerImportData, importerFilePath)

    // We need filePathAbsoluteUserRootDir because we didn't find a way to have filesystem absolute import paths in virtual files: https://gist.github.com/brillout/2315231c9a8164f950c64b4b4a7bbd39
    const filePathAbsoluteUserRootDir = getFilePathAbsoluteUserRootDir({ filePathAbsoluteFilesystem, userRootDir })
    if (importPath.startsWith('.')) {
      assertUsage(
        filePathAbsoluteUserRootDir,
        getErrorMessage_importPathOutsideOfRoot({
          importPathOriginal: importPath,
          importPathResolved: filePathAbsoluteFilesystem,
          userRootDir
        })
      )
    } else {
      assertUsage(
        filePathAbsoluteUserRootDir,
        `The import path ${importPath} resolves to ${filePathAbsoluteFilesystem} outside of ${userRootDir} which is forbbiden.`
      )
    }
    // Forbid node_modules/ because it's brittle: if node_modules/ lives outside of userRootDir then it crashes.
    assertUsage(
      !filePathAbsoluteUserRootDir.includes('/node_modules/'),
      `The import path ${importPath} resolves to ${filePathAbsoluteFilesystem} inside of /node_modules/ which is forbbiden.`
    )

    // Imports are included in virtual files, thus the relative path of imports need to resolved.
    // ```
    // [vite] Internal server error: Failed to resolve import "./onPageTransitionHooks" from "virtual:vike:pageConfigValuesAll:client:/pages/index". Does the file exist?
    // ```
    filePath = getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
  } else {
    const importPathAbsolute = importPath
    assertUsage(isNpmPackageImport_unreliable(importPathAbsolute), errInvalidImport)
    assertIsNpmPackageImport(importPathAbsolute)
    if (filePathAbsoluteFilesystem) {
      filePath = getFilePathResolved({
        userRootDir,
        filePathAbsoluteFilesystem,
        importPathAbsolute
      })
    } else {
      filePath = getFilePathUnresolved({
        importPathAbsolute
      })
    }
  }

  return filePath
}

function resolveImportPathWithNode(
  pointerImportData: PointerImportData,
  importerFilePath: FilePathResolved
): string | null {
  const importerFilePathAbsolute = importerFilePath.filePathAbsoluteFilesystem
  assertPosixPath(importerFilePathAbsolute)
  const cwd = path.posix.dirname(importerFilePathAbsolute)
  // We can't use import.meta.resolve() as of Junary 2023 (and probably for a lot longer)
  // https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules#comment137174954_62272600:~:text=But%20the%20argument%20parent%20(aka%20cwd)%20still%20requires%20a%20flag
  // filePathAbsoluteFilesystem is expected to be null when pointerImportData.importPath is a Vite path alias
  const filePathAbsoluteFilesystem = requireResolve(pointerImportData.importPath, cwd)
  return filePathAbsoluteFilesystem
}

function assertImportPath(
  filePathAbsoluteFilesystem: string | null,
  pointerImportData: PointerImportData,
  importerFilePath: FilePathResolved
): asserts filePathAbsoluteFilesystem is string {
  const { importPath: importPath, importStringWasGenerated, importString } = pointerImportData
  const { filePathToShowToUser } = importerFilePath

  if (!filePathAbsoluteFilesystem) {
    const importPathString = pc.cyan(`'${importPath}'`)
    const errIntro = importStringWasGenerated
      ? (`The import path ${importPathString} in ${filePathToShowToUser}` as const)
      : (`The import ${pc.cyan(importString)} defined in ${filePathToShowToUser}` as const)
    const errIntro2 = `${errIntro} couldn't be resolved: does ${importPathString}` as const
    if (importPath.startsWith('.')) {
      assert(importPath.startsWith('./') || importPath.startsWith('../'))
      assertUsage(false, `${errIntro2} point to an existing file?`)
    } else {
      assertUsage(false, `${errIntro2} exist?`)
    }
  }
}

function assertFileEnv(
  filePathAbsoluteFilesystem: string | null,
  importPath: string,
  configEnv: ConfigEnvInternal,
  configName: string
) {
  let key: string
  if (filePathAbsoluteFilesystem) {
    key = filePathAbsoluteFilesystem
  } else {
    assertIsNpmPackageImport(importPath)
    key = importPath
  }
  assertPosixPath(key)
  if (!filesEnvMap.has(key)) {
    filesEnvMap.set(key, [])
  }
  const fileEnv = filesEnvMap.get(key)!
  fileEnv.push({ configEnv, configName })
  const configDifferentEnv = fileEnv.filter((c) => !deepEqual(c.configEnv, configEnv))[0]
  if (configDifferentEnv) {
    assertUsage(
      false,
      [
        `${key} defines the value of configs living in different environments:`,
        ...[configDifferentEnv, { configName, configEnv }].map(
          (c) =>
            `  - config ${pc.cyan(c.configName)} which value lives in environment ${pc.cyan(
              JSON.stringify(c.configEnv)
            )}`
        ),
        'Defining config values in the same file is allowed only if they live in the same environment, see https://vike.dev/config#pointer-imports'
      ].join('\n')
    )
  }
}
function clearFilesEnvMap() {
  filesEnvMap.clear()
}
