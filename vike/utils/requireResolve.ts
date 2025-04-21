export { requireResolve }
export { requireResolveOptional }
export { requireResolveOptionalDir }
export { requireResolveNonUserFile }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from './assertSetup.js'
import { assertPosixPath, toPosixPath } from './path.js'
import { scriptFileExtensionList } from './isScriptFile.js'
import { createRequire } from 'node:module'
import path from 'node:path'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url

assertIsNotBrowser()
assertIsNotProductionRuntime()

function requireResolve_(
  importPath: string,
  cwd: string,
  options?: { doNotHandleFileExtension?: true; paths?: string[] }
) {
  assertPosixPath(cwd)
  assertPosixPath(importPath)
  assertPosixPath(importMetaUrl)
  assert(path.posix.basename(cwd).includes('.'), { cwd })
  const importerPath = toFilePath(cwd)
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
    toDirPath(cwd),
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
function requireResolveOptional(importPath: string, cwd: string, userRootDir: string): string | null {
  const res = requireResolve_(importPath, cwd, { paths: [userRootDir] })
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
function requireResolveNonUserFile(importPath: string, { importMetaUrl }: { importMetaUrl: string }) {
  const res = requireResolve_(importPath, importMetaUrl, { doNotHandleFileExtension: true })
  if (res.hasFailed) throw res.err
  return res.importedFile
}
function requireResolve(importPath: string, cwd: string): string {
  const res = requireResolve_(importPath, cwd)
  if (res.hasFailed) throw res.err
  return res.importedFile
}

function toDirPath(filePath: string) {
  let dirPath = path.posix.dirname(filePath)
  const prefix = getFilePrefix()
  if (dirPath.startsWith(prefix)) {
    dirPath = dirPath.slice(prefix.length)
  }
  assert(!dirPath.startsWith('file'))
  return dirPath
}
function toFilePath(filePath: string) {
  const filePrefix = getFilePrefix()
  if (!filePath.startsWith(filePrefix)) {
    assert(!filePath.startsWith('file'))
    filePath = filePrefix + filePath
  }
  return filePath
}
function getFakeFilePath(dirPath: string) {
  assertPosixPath(dirPath)
  const filePath = path.posix.join(dirPath, 'fakeFileForNodeResolve.js')
  return filePath
}
function getFilePrefix() {
  let prefix = 'file://'
  if (process.platform === 'win32') prefix += '/'
  return prefix
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
