export { toPosixPath }
export { assertPosixPath }
export { toSystemPath }
export { isPosixPath }

import { assert } from './assert'

const sepPosix = '/'
const sepWin32 = '\\'

function isPosixPath(path: string) {
  return !path.includes(sepWin32)
}

function toPosixPath(path: string) {
  const pathPosix = path.split(sepWin32).join(sepPosix)
  assertPosixPath(pathPosix)
  return pathPosix
}

function assertPosixPath(path: string) {
  const errMsg = (msg: string) => `Not a posix path: ${msg}`
  assert(path !== null, errMsg('null'))
  assert(typeof path === 'string', errMsg(`typeof path === '${typeof path}'`))
  assert(path !== '', errMsg('(empty string)'))
  assert(path)
  assert(!path.includes(sepWin32), errMsg(path))
}

function toSystemPath(path: string) {
  if (isPosixEnv()) {
    return toPosixPath(path)
  }
  if (isWin32Env()) {
    return path.split(sepPosix).join(sepWin32)
  }
  assert(false)
}

function isWin32Env() {
  return process.platform === 'win32'
}
function isPosixEnv() {
  return !isWin32Env()
}
