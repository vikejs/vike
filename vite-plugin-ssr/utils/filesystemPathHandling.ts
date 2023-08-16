export { toPosixPath }
export { assertPosixPath }

import { assert } from './assert.js'

function toPosixPath(path: string): string {
  const pathPosix = path.split('\\').join('/')
  assertPosixPath(pathPosix)
  return pathPosix
}

function assertPosixPath(path: string): void {
  const errMsg = (msg: string) => `Not a posix path: ${msg}`
  assert(path !== null, errMsg('null'))
  assert(typeof path === 'string', errMsg(`typeof path === '${typeof path}'`))
  assert(path !== '', errMsg('(empty string)'))
  assert(path)
  assert(!path.includes('\\'), errMsg(path))
}
