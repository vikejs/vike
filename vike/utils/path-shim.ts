export { pathJoin }

// Simple shim for `import * from "node:path"` used by the server runtime.
// Robust alternative: https://github.com/unjs/pathe

import { assert } from './assert.js'

function pathJoin(path1: string, path2: string): string {
  assert(!path1.includes('\\'))
  assert(!path2.includes('\\'))
  let joined = [...path1.split('/'), ...path2.split('/')].filter(Boolean).join('/')
  if (path1.startsWith('/')) joined = '/' + joined
  return joined
}

/* https://github.com/brillout/telefunc/blob/0fd44322acbd07857ae29361ba7c998607f17dd5/telefunc/utils/path-shim.ts#L17-L21
function isAbsolute(filePath: string) {
  // ...
}
*/
