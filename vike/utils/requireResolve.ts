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
import { assertIsImportPathNpmPackage, isImportPathNpmPackageOrPathAlias } from './parseNpmPackage.js'
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
  const require_ = createRequire(importerPath)
  if (!options?.doNotHandleFileExtension) {
    addFileExtensionsToRequireResolve(require_)
    importPath = removeFileExtention(importPath)
  }

  const paths = !options?.paths
    ? undefined
    : [
        // Seems like `importerPath` gets overriden by the `paths` argument, so we add it to `paths`. (For example, passing an empty array to `paths` kills the argument passed to `createRequire()`.)
        toDirPath(importerFile),
        ...(options?.paths || [])
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
  const paths = getExtraPathsForNpmPackageImport({ importPath, userRootDir })
  const res = requireResolve_(importPath, importerFile, { paths })
  if (res.hasFailed) return null
  return res.importedFile
}
function requireResolveOptionalDir({
  importPath,
  importerDir,
  userRootDir
}: { importPath: string; importerDir: string; userRootDir: string }): string | null {
  const importerFile = getFakeFilePath(importerDir)
  const paths = getExtraPathsForNpmPackageImport({ importPath, userRootDir })
  const res = requireResolve_(importPath, importerFile, { paths })
  if (res.hasFailed) return null
  return res.importedFile
}
function requireResolveNpmPackage({
  importPathNpmPackage,
  userRootDir
}: { importPathNpmPackage: string; userRootDir: string }): string {
  assertIsImportPathNpmPackage(importPathNpmPackage)
  const importerFile = getFakeFilePath(userRootDir)
  const paths = getExtraPathsForNpmPackageImport({ importPath: importPathNpmPackage, userRootDir })
  const res = requireResolve_(importPathNpmPackage, importerFile, { paths })
  if (res.hasFailed) throw res.err
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

function getExtraPathsForNpmPackageImport({ importPath, userRootDir }: { importPath: string; userRootDir: string }) {
  if (
    // Ideally we'd set `paths` only for npm packages, but unfortunately we cannot always disambiguate between npm package imports and path aliases.
    !isImportPathNpmPackageOrPathAlias(importPath)
  ) {
    return undefined
  }
  const paths = [
    // Workaround for monorepo resolve issue: https://github.com/vikejs/vike-react/pull/161/commits/dbaa6643e78015ac2797c237552800fef29b72a7
    userRootDir,
    // I can't think of a use case where this would be needed, but let's add it to be extra safe
    toDirPath(importMetaUrl)
  ]
  return paths
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

function getVikeNodeModulesRoot() {
  // [RELATIVE_PATH_FROM_DIST] Current file: vike/dist/esm/utils/requireResolve.js
  assert(importMetaUrl.includes('/dist/esm/') || importMetaUrl.includes('/dist/cjs/'))
  const vikeNodeModulesRoot = path.posix.join(removeFilePrefix(importMetaUrl), '../../../../')
  return vikeNodeModulesRoot
}

function toDirPath(filePath: string) {
  return path.posix.dirname(removeFilePrefix(filePath))
}

function getFakeFilePath(dirPath: string) {
  assertPosixPath(dirPath)
  assert(!dirPath.startsWith('file')) // The file:// prefix is bogus with path.join
  const filePath = path.posix.join(dirPath, 'fakeFileForNodeResolve.js')
  return filePath
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
