export { resolve }

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
import { assertIsNotProductionRuntime } from './assertIsNotProductionRuntime.js'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling.js'
import { scriptFileExtensionList } from './isScriptFile.js'
import { createRequire } from 'module'
// @ts-ignore Shimed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

assertIsNotBrowser()
assertIsNotProductionRuntime()

function resolve(importPath: string, cwd: string): string | null {
  assertPosixPath(cwd)
  const clean = addFileExtensionsToRequireResolve()
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
