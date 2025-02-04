export { pathJoin }

// Utilites for handling file paths.
// - Shims `import * from "node:path"` for server runtime.
//   - Robust shim reference: https://github.com/unjs/pathe

import { assert } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

function pathJoin(path1: string, path2: string): string {
  assert(!path1.includes('\\'))
  assert(!path2.includes('\\'))
  let joined = [...path1.split('/'), ...path2.split('/')].filter(Boolean).join('/')
  if (path1.startsWith('/')) joined = '/' + joined
  return joined
}

/* https://github.com/brillout/telefunc/blob/0fd44322acbd07857ae29361ba7c998607f17dd5/telefunc/utils/path-shim.ts#L17-L21
const IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/
function pathIsAbsolute(filePath: string) {
  return IS_ABSOLUTE_RE.test(filePath)
}
//*/
