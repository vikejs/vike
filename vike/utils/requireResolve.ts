export { requireResolve }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from './assertIsNotProductionRuntime.js'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling.js'
import { scriptFileExtensionList } from './isScriptFile.js'
import { createRequire } from 'module'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

assertIsNotBrowser()
assertIsNotProductionRuntime()

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
