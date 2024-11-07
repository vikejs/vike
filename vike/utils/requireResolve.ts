export { requireResolve }

import { assert } from './assert'
import { assertIsNotBrowser } from './assertIsNotBrowser'
import { assertIsNotProductionRuntime } from './assertIsNotProductionRuntime'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling'
import { scriptFileExtensionList } from './isScriptFile'
import { createRequire } from 'module'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

assertIsNotBrowser()
assertIsNotProductionRuntime()

// We still can't use import.meta.resolve() as of 23.1.0 (November 2024) because `parent` argument requires an experimental flag.
// - https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules#comment139581675_62272600
function requireResolve(importPath: string, cwd: string): string | null {
  assertPosixPath(cwd)
  const clean = addFileExtensionsToRequireResolve()
  importPath = removeFileExtention(importPath)
  let importedFile: string | null
  try {
    importedFile = require_.resolve(importPath, { paths: [cwd] })
  } catch {
    importedFile = null
  } finally {
    clean()
  }
  if (importedFile) {
    importedFile = toPosixPath(importedFile)
  }
  return importedFile
}

function removeFileExtention(importPath: string) {
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
    if (!require.extensions[ext]) {
      require.extensions[ext] = require.extensions['.js']
      added.push(ext)
    }
  })
  const clean = () => {
    added.forEach((ext) => {
      delete require.extensions[ext]
    })
  }
  return clean
}
