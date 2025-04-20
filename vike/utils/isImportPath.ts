export { isImportPath }
export { isImportPathRelative }

import { assertPosixPath } from './path.js'
import { assert } from './assert.js'
import { isImportPathNpmPackage_unreliable } from './parseNpmPackage.js'

function isImportPath(importPath: string) {
  return isImportPathRelative(importPath) || isImportPathNpmPackage_unreliable(importPath)
}

// See also `import { pathIsRelative } from './path'`
function isImportPathRelative(importPath: string) {
  assertPosixPath(importPath)
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return true
  } else {
    assert(!importPath.startsWith('.'))
    return false
  }
}
