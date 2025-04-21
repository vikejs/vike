export { requireResolveOptional }
export { requireResolveOptionalDir }
export { requireResolveNpmPackage }
export { requireResolveVikeDistFile }
export { getVikeNodeModulesRoot }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from './assertSetup.js'
import { assertPosixPath, toPosixPath } from './path.js'
import { scriptFileExtensionList } from './isScriptFile.js'
import { createRequire } from 'node:module'
import path from 'node:path'
import { assertIsImportPathNpmPackage } from './parseNpmPackage.js'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url

assertIsNotBrowser()
assertIsNotProductionRuntime()

function requireResolve_(
  importPath: string,
  importerFile: string,
  options?: { doNotHandleFileExtension?: true; paths?: string[] }
) {
  assertPosixPath(importerFile)
  assertPosixPath(importPath)
  assertPosixPath(importMetaUrl)
  assert(path.posix.basename(importerFile).includes('.'), { cwd: importerFile })
  const importerPath = addFilePrefix(importerFile)
  const require_ = createRequire(
    // Seems like this gets overriden by the `paths` argument below.
    // - For example, passing an empty array to `paths` kills the argument passed to `createRequire()`.
    importerPath
  )
  if (!options?.doNotHandleFileExtension) {
    addFileExtensionsToRequireResolve(require_)
    importPath = removeFileExtention(importPath)
  }
  const paths = [
    toDirPath(importerFile),
    ...(options?.paths || []),
    // TODO/now: comment
    toDirPath(importMetaUrl)
  ]

  let importedFile: string
  try {
    // We still can't use import.meta.resolve() as of 23.1.0 (November 2024) because `parent` argument requires an experimental flag.
    // - https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules#comment139581675_62272600
    importedFile = require_.resolve(importPath, { paths })
  } catch (err) {
    return { importedFile: undefined, err, hasFailed: true as const }
  }
  importedFile = toPosixPath(importedFile)
  return { importedFile, err: undefined, hasFailed: false as const }
}
function requireResolveOptional({
  importPath,
  importerFile,
  userRootDir
}: { importPath: string; importerFile: string; userRootDir: string }): string | null {
  const res = requireResolve_(importPath, importerFile, { paths: [userRootDir] })
  if (res.hasFailed) return null
  return res.importedFile
}
function requireResolveOptionalDir({
  importPath,
  importerDir,
  userRootDir
}: { importPath: string; importerDir: string; userRootDir: string }): string | null {
  const importerFile = getFakeFilePath(importerDir)
  const res = requireResolve_(importPath, importerFile, { paths: [userRootDir] })
  if (res.hasFailed) return null
  return res.importedFile
}
function requireResolveVikeDistFile(vikeDistFile: `dist/esm/${string}`) {
  const vikeNodeModulesRoot = getVikeNodeModulesRoot()
  assertPosixPath(vikeNodeModulesRoot)
  assertPosixPath(vikeDistFile)
  const importedFile = path.posix.join(vikeNodeModulesRoot, vikeDistFile)

  // Double check
  {
    const res = requireResolve_(
      importedFile,
      // Passing some dummy context as the context isn't needed since importerFile is already resolved and absolute
      importMetaUrl,
      { doNotHandleFileExtension: true }
    )
    if (res.hasFailed) throw res.err
    assert(res.importedFile === importedFile)
  }

  return importedFile
}
function getVikeNodeModulesRoot() {
  // [RELATIVE_PATH_FROM_DIST] Current file: vike/dist/esm/utils/requireResolve.js
  assert(importMetaUrl.includes('/dist/esm/') || importMetaUrl.includes('/dist/cjs/'))
  const vikeNodeModulesRoot = path.posix.join(removeFilePrefix(importMetaUrl), '../../../../')
  return vikeNodeModulesRoot
}
function requireResolveNpmPackage({
  importPathNpmPackage,
  userRootDir
}: { importPathNpmPackage: string; userRootDir: string }): string {
  assertIsImportPathNpmPackage(importPathNpmPackage)
  const importerFile = getFakeFilePath(userRootDir)
  const res = requireResolve_(importPathNpmPackage, importerFile)
  if (res.hasFailed) throw res.err
  return res.importedFile
}

function toDirPath(filePath: string) {
  return path.posix.dirname(removeFilePrefix(filePath))
}
function addFilePrefix(filePath: string) {
  const filePrefix = getFilePrefix()
  if (!filePath.startsWith(filePrefix)) {
    assert(!filePath.startsWith('file'))
    filePath = filePrefix + filePath
  }
  assert(filePath.startsWith(filePrefix))
  return filePath
}
function removeFilePrefix(filePath: string) {
  const filePrefix = getFilePrefix()
  if (filePath.startsWith(filePrefix)) {
    filePath = filePath.slice(filePrefix.length)
  }
  assert(!filePath.startsWith('file'))
  return filePath
}
function getFilePrefix() {
  let prefix = 'file://'
  if (process.platform === 'win32') prefix += '/'
  return prefix
}
function getFakeFilePath(dirPath: string) {
  assertPosixPath(dirPath)
  assert(!dirPath.startsWith('file')) // The file:// prefix is bogus with path.join
  const filePath = path.posix.join(dirPath, 'fakeFileForNodeResolve.js')
  return filePath
}

function removeFileExtention(importPath: string) {
  // Skip for Bun: https://github.com/vikejs/vike/issues/2204
  //@ts-ignore
  if (typeof Bun !== 'undefined') {
    // https://bun.sh/guides/util/detect-bun
    assert(process.versions.bun)
    return importPath
  }

  for (const ext of scriptFileExtensionList) {
    const suffix = `.${ext}`
    if (importPath.endsWith(suffix)) {
      return importPath.slice(0, -1 * suffix.length)
    }
  }
  return importPath
}
function addFileExtensionsToRequireResolve(require_: NodeJS.Require) {
  const added: string[] = []
  scriptFileExtensionList.forEach((ext: string) => {
    assert(!ext.includes('.'))
    ext = `.${ext}`
    if (!require_.extensions[ext]) {
      require_.extensions[ext] = require_.extensions['.js']
      added.push(ext)
    }
  })
}
