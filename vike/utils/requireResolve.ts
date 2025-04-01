export { requireResolveOptional }
export { requireResolveNonUserFile }
export { requireResolveExpected }
export { requireResolveExpectedNonUserFile }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from './assertSetup.js'
import { assertPosixPath, toPosixPath } from './path.js'
import { scriptFileExtensionList } from './isScriptFile.js'
import { createRequire } from 'node:module'
import path from 'node:path'
// @ts-ignore import.meta.url is shimmed at dist/cjs by dist-cjs-fixup.js.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

assertIsNotBrowser()
assertIsNotProductionRuntime()

function requireResolve_(importPath: string, cwd: string, options?: { doNotHandleFileExtension?: true }) {
  assertPosixPath(cwd)
  assertPosixPath(importPath)
  cwd = resolveCwd(cwd)
  let clean = () => {}
  if (!options?.doNotHandleFileExtension) {
    clean = addFileExtensionsToRequireResolve()
    importPath = removeFileExtention(importPath)
  }
  let importedFile: string
  try {
    // We still can't use import.meta.resolve() as of 23.1.0 (November 2024) because `parent` argument requires an experimental flag.
    // - https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules#comment139581675_62272600
    importedFile = require_.resolve(importPath, { paths: [cwd] })
  } catch (err) {
    clean()
    return { importedFile: undefined, err, hasFailed: true as const }
  }
  clean()
  importedFile = toPosixPath(importedFile)
  return { importedFile, err: undefined, hasFailed: false as const }
}
function requireResolveOptional(importPath: string, cwd: string): string | null {
  const res = requireResolve_(importPath, cwd)
  if (res.hasFailed) return null
  return res.importedFile
}
function requireResolveNonUserFile(importPath: string, cwd: string): string | null {
  const res = requireResolve_(importPath, cwd, { doNotHandleFileExtension: true })
  if (res.hasFailed) return null
  return res.importedFile
}
function requireResolveExpectedNonUserFile(importPath: string, cwd: string) {
  const res = requireResolve_(importPath, cwd, { doNotHandleFileExtension: true })
  if (res.hasFailed) throw res.err
  return res.importedFile
}
function requireResolveExpected(importPath: string, cwd: string): string {
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

function addFileExtensionsToRequireResolve() {
  const added: string[] = []
  scriptFileExtensionList.forEach((ext: string) => {
    assert(!ext.includes('.'))
    ext = `.${ext}`
    if (!require_.extensions[ext]) {
      require_.extensions[ext] = require_.extensions['.js']
      added.push(ext)
    }
  })
  const clean = () => {
    added.forEach((ext) => {
      delete require_.extensions[ext]
    })
  }
  return clean
}
