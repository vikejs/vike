export { resolveImport }
export { resolveImportPath }
export { assertImportPath }
export { clearFilesEnvMap }

import pc from '@brillout/picocolors'
import type {
  ConfigEnvInternal,
  DefinedAtFileFullInfo,
  FilePath,
  FilePathResolved
} from '../../../../../../shared/page-configs/PageConfig.js'
import { assert, assertPosixPath, assertUsage, deepEqual, requireResolve } from '../../../../utils.js'
import { type ImportData, parseImportData } from '../transformImports.js'
import path from 'path'

const filesEnvMap: Map<string, { configEnv: ConfigEnvInternal; configName: string }[]> = new Map()

function resolveImport(
  configValue: unknown,
  importerFilePath: FilePathResolved,
  userRootDir: string,
  configEnv: ConfigEnvInternal,
  configName: string
): null | (DefinedAtFileFullInfo & { fileExportName: string }) {
  if (typeof configValue !== 'string') return null
  const importData = parseImportData(configValue)
  if (!importData) return null

  const { importPath, exportName } = importData
  const filePathAbsoluteFilesystem = resolveImportPath(importData, importerFilePath)

  assertFileEnv(filePathAbsoluteFilesystem ?? importPath, configEnv, configName)

  const fileExportPathToShowToUser = exportName === 'default' || exportName === configName ? [] : [exportName]

  if (importPath.startsWith('.')) {
    // We need to resolve relative paths into absolute paths. Because the import paths are included in virtual files:
    // ```
    // [vite] Internal server error: Failed to resolve import "./onPageTransitionHooks" from "virtual:vike:pageConfigValuesAll:client:/pages/index". Does the file exist?
    // ```
    assertImportPath(filePathAbsoluteFilesystem, importData, importerFilePath)
    const filePathRelativeToUserRootDir = resolveImportPath_relativeToUserRootDir(
      filePathAbsoluteFilesystem,
      importData,
      importerFilePath,
      userRootDir
    )
    const filePath: FilePath = {
      filePathAbsoluteFilesystem,
      filePathRelativeToUserRootDir,
      filePathAbsoluteVite: filePathRelativeToUserRootDir,
      filePathToShowToUser: filePathRelativeToUserRootDir,
      importPathAbsolute: null
    }
    return {
      ...filePath,
      fileExportName: exportName,
      fileExportPathToShowToUser
    }
  } else {
    // importPath can be:
    //  - an npm package import
    //  - a path alias
    const filePath: FilePath = {
      filePathAbsoluteFilesystem,
      filePathRelativeToUserRootDir: null,
      filePathAbsoluteVite: importPath,
      filePathToShowToUser: importPath,
      importPathAbsolute: importPath
    }
    return {
      ...filePath,
      fileExportName: exportName,
      fileExportPathToShowToUser
    }
  }
}

function resolveImportPath_relativeToUserRootDir(
  filePathAbsoluteFilesystem: string,
  importData: ImportData,
  configFilePath: FilePathResolved,
  userRootDir: string
) {
  assertPosixPath(userRootDir)
  let filePathRelativeToUserRootDir: string
  if (filePathAbsoluteFilesystem.startsWith(userRootDir)) {
    filePathRelativeToUserRootDir = getVitePathFromAbsolutePath(filePathAbsoluteFilesystem, userRootDir)
  } else {
    assertUsage(
      false,
      `${configFilePath.filePathToShowToUser} imports from a relative path ${pc.cyan(
        importData.importPath
      )} outside of ${userRootDir} which is forbidden: import from a relative path inside ${userRootDir}, or import from a dependency's package.json#exports entry instead`
    )
    // None of the following works. Seems to be a Vite bug?
    // /*
    // assert(filePathAbsoluteFilesystem.startsWith('/'))
    // filePath = `/@fs${filePathAbsoluteFilesystem}`
    // /*/
    // filePathRelativeToUserRootDir = path.posix.relative(userRootDir, filePathAbsoluteFilesystem)
    // assert(filePathRelativeToUserRootDir.startsWith('../'))
    // filePathRelativeToUserRootDir = '/' + filePathRelativeToUserRootDir
    // //*/
  }

  assertPosixPath(filePathRelativeToUserRootDir)
  assert(filePathRelativeToUserRootDir.startsWith('/'))
  return filePathRelativeToUserRootDir
}

function resolveImportPath(importData: ImportData, importerFilePath: FilePathResolved): string | null {
  const importerFilePathAbsolute = importerFilePath.filePathAbsoluteFilesystem
  assertPosixPath(importerFilePathAbsolute)
  const cwd = path.posix.dirname(importerFilePathAbsolute)
  // We can't use import.meta.resolve() as of Junary 2023 (and probably for a lot longer): https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules#comment137174954_62272600:~:text=But%20the%20argument%20parent%20(aka%20cwd)%20still%20requires%20a%20flag
  // filePathAbsoluteFilesystem is expected to be null when importData.importPath is a Vite path alias
  const filePathAbsoluteFilesystem = requireResolve(importData.importPath, cwd)
  return filePathAbsoluteFilesystem
}

function assertImportPath(
  filePathAbsoluteFilesystem: string | null,
  importData: ImportData,
  importerFilePath: FilePathResolved
): asserts filePathAbsoluteFilesystem is string {
  const { importPath: importPath, importStringWasGenerated, importString } = importData
  const { filePathToShowToUser } = importerFilePath

  if (!filePathAbsoluteFilesystem) {
    const importPathString = pc.cyan(`'${importPath}'`)
    const errIntro = importStringWasGenerated
      ? (`The import path ${importPathString} in ${filePathToShowToUser}` as const)
      : (`The import ${pc.cyan(importString)} defined in ${filePathToShowToUser}` as const)
    const errIntro2 = `${errIntro} couldn't be resolved: does ${importPathString}` as const
    if (importPath.startsWith('.')) {
      assertUsage(false, `${errIntro2} point to an existing file?`)
    } else {
      assertUsage(false, `${errIntro2} exist?`)
    }
  }
}

function assertFileEnv(filePathForEnvCheck: string, configEnv: ConfigEnvInternal, configName: string) {
  assertPosixPath(filePathForEnvCheck)
  if (!filesEnvMap.has(filePathForEnvCheck)) {
    filesEnvMap.set(filePathForEnvCheck, [])
  }
  const fileEnv = filesEnvMap.get(filePathForEnvCheck)!
  fileEnv.push({ configEnv, configName })
  const configDifferentEnv = fileEnv.filter((c) => !deepEqual(c.configEnv, configEnv))[0]
  if (configDifferentEnv) {
    assertUsage(
      false,
      [
        `${filePathForEnvCheck} defines the value of configs living in different environments:`,
        ...[configDifferentEnv, { configName, configEnv }].map(
          (c) =>
            `  - config ${pc.cyan(c.configName)} which value lives in environment ${pc.cyan(
              JSON.stringify(c.configEnv)
            )}`
        ),
        'Defining config values in the same file is allowed only if they live in the same environment, see https://vike.dev/header-file'
      ].join('\n')
    )
  }
}
function clearFilesEnvMap() {
  filesEnvMap.clear()
}

function getVitePathFromAbsolutePath(filePathAbsoluteFilesystem: string, root: string): string {
  assertPosixPath(filePathAbsoluteFilesystem)
  assertPosixPath(root)
  assert(filePathAbsoluteFilesystem.startsWith(root))
  let vitePath = path.posix.relative(root, filePathAbsoluteFilesystem)
  assert(!vitePath.startsWith('/') && !vitePath.startsWith('.'))
  vitePath = '/' + vitePath
  return vitePath
}
