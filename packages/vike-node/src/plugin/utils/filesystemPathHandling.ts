export { toPosixPath }
export { assertPosixPath }

import { assert } from '../../utils/assert.js'

function toPosixPath(path: string): string {
  const pathPosix = path.split('\\').join('/')
  assertPosixPath(pathPosix)
  return pathPosix
}

function assertPosixPath(path: string): void {
  assert(path !== null)
  assert(typeof path === 'string')
  assert(path !== '')
  assert(path)
  assert(!path.includes('\\'))
}
