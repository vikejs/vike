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
  isObject,
  isPathFilesystemAbsolute,
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

const filesEnvMap: Map<string, { configEnv: ConfigEnvInternal; configName: string }[]> = new Map()

type PointerImportResolved = DefinedAtFilePath & { fileExportName: string }

function resolvePointerImportOfConfig(
  configValue: unknown,
  importerFilePath: FilePathResolved,
  userRootDir: string,
  configEnv: ConfigEnvInternal,
  configName: string
): null | PointerImportResolved {
  const pointerImportData = typeof configValue === 'string' && parsePointerImportData(configValue)
  if (!pointerImportData) {
    // Temporary workaround to support document.title config.
    // - We'll be able to remove that workaround once Vike supports custom nested configs (being able to define document.title and document.description as two different configs).
    replaceStringValues(configValue, (str) => {
      const pointerImportData = parsePointerImportData(str)
      if (pointerImportData) {
        const filePath = resolvePointerImport(pointerImportData, importerFilePath, userRootDir)
        return filePath.filePathAbsoluteVite
      }
    })
    return null
  }
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

  let filePath: FilePath
  // - importPath is one of the following. (See `transpileAndExecuteFile()`.)
  //   - A relative import path
  //   - A filesystem absolute path
  //   - An npm package import
  // - importPath cannot be a path alias (since esbuild resolves path aliases, see transpileAndExecuteFile.ts)
  assertPosixPath(importPath)
  if (importPath.startsWith('.') || isPathFilesystemAbsolute(importPath)) {
    if (importPath.startsWith('.')) {
      assert(importPath.startsWith('./') || importPath.startsWith('../'))
    }
    assertImportPath(filePathAbsoluteFilesystem, pointerImportData, importerFilePath)

    const filePathAbsoluteUserRootDir = getFilePathAbsoluteUserRootDir({ filePathAbsoluteFilesystem, userRootDir })
    // This assert() is guarenteed, see assertUsage() in the onResolve() esbuild hook in transpileAndExecuteFile.ts
    assert(filePathAbsoluteUserRootDir)

    // Imports are included in virtual files, thus the relative path of imports need to resolved.
    // ```
    // [vite] Internal server error: Failed to resolve import "./onPageTransitionHooks" from "virtual:vike:pageConfigValuesAll:client:/pages/index". Does the file exist?
    // ```
    filePath = getFilePathResolved({ filePathAbsoluteUserRootDir, userRootDir })
  } else {
    const importPathAbsolute = importPath
    // importPath cannot be a path alias (since esbuild resolves path aliases, see transpileAndExecuteFile.ts)
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

type Replacer = (str: string) => string | void
function replaceStringValues(obj: unknown, replacer: Replacer) {
  const visited = new WeakSet()
  return traverse(obj, replacer)

  function traverse(obj: unknown, replacer: Replacer) {
    // Check if the input is an object
    if (isObject(obj)) {
      if (visited.has(obj)) return
      visited.add(obj)
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue
        const val = obj[key]
        if (typeof val !== 'string') {
          traverse(val, replacer)
        } else {
          const replacement = replacer(val)
          if (replacement) {
            obj[key] = replacement
          }
        }
      }
    }
  }
}
