export { requireResolve }
export { requireResolveOptional }
export { requireResolveNonUserFile }
export { requireResolveOptionalNonUserFile }

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
  cwd = resolveCwd(cwd)
  const require_ = createRequire(cwd)
  if (!options?.doNotHandleFileExtension) {
    addFileExtensionsToRequireResolve(require_)
    importPath = removeFileExtention(importPath)
  }
  let importedFile: string
  try {
    // We still can't use import.meta.resolve() as of 23.1.0 (November 2024) because `parent` argument requires an experimental flag.
    // - https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules#comment139581675_62272600
    importedFile = require_.resolve(importPath, {
      paths: [
        ...(options?.paths || []),
        // TODO/now: comment
        importMetaUrl
      ]
    })
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
function requireResolveOptionalNonUserFile(importPath: string, cwd: string): string | null {
  const res = requireResolve_(importPath, cwd, { doNotHandleFileExtension: true })
  if (res.hasFailed) return null
  return res.importedFile
}
function requireResolveNonUserFile(importPath: string, cwd: string) {
  const res = requireResolve_(importPath, cwd, { doNotHandleFileExtension: true })
  if (res.hasFailed) throw res.err
  return res.importedFile
}
function requireResolve(importPath: string, cwd: string): string {
  const res = requireResolve_(importPath, cwd)
  if (res.hasFailed) throw res.err
  return res.importedFile
}

function resolveCwd(cwd: string) {
  let prefix = 'file://'
  if (process.platform === 'win32') prefix += '/'
  if (cwd.startsWith(prefix)) {
    cwd = cwd.slice(prefix.length)
    cwd = path.posix.dirname(cwd)
  }
  assert(!cwd.startsWith('file:'))
  return cwd
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
