// Lightweight alternative to Node.js module 'path'
// To avoid the need to shim Node.js's path module in Edge deploy environments

/* TODO: start use this

export { pathJoin }
export { pathDirname }

import {assert} from "./assert"
import {assertPosixPath} from "./filesystemPathHandling"

// Node.js code/shim: https://github.com/jinder/path
function pathDirname(path_: string): string {
  const { isAbsolute, parts } = parsePath(path_)
  assert(isAbsolute)
  const fileDir = '/' + parts.slice(0, -1).join('/')
  assert(!fileDir.endsWith('/'))
  return fileDir
}
function pathJoin(path1: string, path2: string): string {
  assert(!path2.startsWith('..')) // TODO
  const { isAbsolute, parts } = parsePath(path1)
  let path_ = [...parts, ...parsePath(path2).parts].join('/')
  if (isAbsolute) path_ = '/' + path_
  return path_
}
function parsePath(path_: string) {
  assertPosixPath(path_)
  const isAbsolute = path_.startsWith('/')
  let parts = path_.split('/').filter(Boolean)
  if (parts[0] === '.') parts = parts.slice(1)
  return { isAbsolute, parts }
}
//*/
