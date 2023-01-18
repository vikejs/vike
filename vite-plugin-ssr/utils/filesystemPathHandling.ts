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
  assert(path && !path.includes(sepWin32), `Wrongly formatted path: ${path}`)
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
