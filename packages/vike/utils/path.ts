export { pathJoin }
export { pathIsRelative }
export { pathIsAbsolute }
export { toPosixPath }
export { assertPosixPath }

// Utilities for handling file paths.
// - Shims `import * from "node:path"` for server runtime.
//   - Robust shim reference: https://github.com/unjs/pathe

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
// While this path shim also works on the client-side, let's try to not use it on the client-side in order to minimize KBs sent to the browser.
assertIsNotBrowser()

/**********************/
/****** SHIMS *********/
/**********************/

function pathJoin(path1: string, path2: string): string {
  assert(!path1.includes('\\'))
  assert(!path2.includes('\\'))
  let joined = [...path1.split('/'), ...path2.split('/')].filter(Boolean).join('/')
  if (path1.startsWith('/')) joined = '/' + joined
  return joined
}

// https://github.com/brillout/telefunc/blob/0fd44322acbd07857ae29361ba7c998607f17dd5/telefunc/utils/path-shim.ts#L17-L21
const IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/
function pathIsAbsolute(filePath: string) {
  return IS_ABSOLUTE_RE.test(filePath)
}

/**********************/
/****** UTILS *********/
/**********************/

function toPosixPath(path: string): string {
  const pathPosix = path.split('\\').join('/')
  assertPosixPath(pathPosix)
  return pathPosix
}

function assertPosixPath(path: string): void {
  const errMsg = (msg: string) => `Not a posix path: ${msg}`
  assert(path !== null, errMsg('null'))
  assert(typeof path === 'string', errMsg(`typeof path === ${JSON.stringify(typeof path)}`))
  assert(path !== '', errMsg('(empty string)'))
  assert(path)
  assert(!path.includes('\\'), errMsg(path))
}

// See also `import { isImportPathRelative } from './isImportPath.js'`
function pathIsRelative(path: string) {
  assertPosixPath(path)
  if (path.startsWith('./') || path.startsWith('../')) {
    return true
  } else {
    /* Not true if `path` starts with a hidden directory  (i.e. a directory with a name that starts with `.`)
    assert(!path.startsWith('.'))
    */
    return false
  }
}
