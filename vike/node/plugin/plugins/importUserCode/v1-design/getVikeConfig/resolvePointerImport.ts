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
  requireResolve
} from '../../../../utils.js'
import { type PointerImportData, parsePointerImportData } from './transformPointerImports.js'
import path from 'path'
import {
  getFilePathAbsoluteUserRootDir,
  getFilePathResolved,
  getFilePathUnresolved
} from '../../../../shared/getFilePath.js'
import type { FilePath, FilePathResolved } from '../../../../../../shared/page-configs/FilePath.js'

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

  assertUsageFileEnv(filePath.filePathAbsoluteFilesystem, importPath, configEnv, configName)

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
  // `importPath` should be one of the following:
  // - A relative import path
  // - A filesystem absolute path
  // - An npm package import
  const { importPath } = pointerImportData
  const filePathAbsoluteFilesystem = resolveImportPathWithNode(pointerImportData, importerFilePath)

  let filePath: FilePath
  assertPosixPath(importPath)
  if (importPath.startsWith('.') || isFilePathAbsolute(importPath)) {
    if (importPath.startsWith('.')) {
      assertUsage(
        importPath.startsWith('./') || importPath.startsWith('../'),
        `Invalid relative import path ${pc.code(importPath)} defined by ${
          importerFilePath.filePathToShowToUser
        } because it should start with ${pc.code('./')} or ${pc.code('../')}, or use an npm package import instead.`
      )
    }

    // Pointer imports are included in virtual files, thus relative imports need to be resolved. (Virtual modules cannot contain relative imports.)
    assertUsageResolutionSuccess(filePathAbsoluteFilesystem, pointerImportData, importerFilePath)

    // Pointer imports are included in virtual files, and we need filePathAbsoluteUserRootDir because we didn't find a way to have filesystem absolute import paths in virtual files: https://gist.github.com/brillout/2315231c9a8164f950c64b4b4a7bbd39
    const errSuffix = `outside of the ${userRootDir} directory which is forbidden: make sure your import paths resolve inside the ${userRootDir} directory, or import from an npm package.`
    const filePathAbsoluteUserRootDir = getFilePathAbsoluteUserRootDir({ filePathAbsoluteFilesystem, userRootDir })
    if (importPath.startsWith('.')) {
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
      `The import path ${importPath} defined by ${importerFilePath.filePathToShowToUser} resolves to ${filePathAbsoluteFilesystem} inside of node_modules/ which is forbidden: use an npm package import instead.`
    )

    filePath = getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
  } else {
    const importPathAbsolute = importPath
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
  // We still can't use import.meta.resolve() as of 23.1.0 (November 2024) because `parent` argument requires an experimental flag.
  // - https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules#comment139581675_62272600
  // filePathAbsoluteFilesystem is expected to be null when pointerImportData.importPath is a Vite path alias
  const filePathAbsoluteFilesystem = requireResolve(pointerImportData.importPath, cwd)
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
    if (importPath.startsWith('.')) {
      assert(importPath.startsWith('./') || importPath.startsWith('../'))
      assertUsage(false, `${errIntro2} point to an existing file?`)
    } else {
      assertUsage(false, `${errIntro2} exist?`)
    }
  }
}

function assertUsageFileEnv(
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
            `  - config ${pc.code(c.configName)} which value lives in environment ${pc.code(
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
