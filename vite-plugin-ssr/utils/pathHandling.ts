export { pathRelative }
export { pathIsAbsolute }
export { pathJoin }

import path from 'path'
import { toPosixPath } from './filesystemPathHandling'

function pathIsAbsolute(pathA: string) {
  pathA = toPosixPath(pathA)
  return path.win32.isAbsolute(pathA) || path.posix.isAbsolute(pathA)
}

function pathRelative(pathA: string, pathB: string) {
  pathA = toPosixPath(pathA)
  pathB = toPosixPath(pathB)
  if (!pathIsAbsolute(pathA) || !pathIsAbsolute(pathB)) {
    throw new Error('A relative path can only be computed from two absolute paths')
  }
  return path.posix.relative(pathA, pathB)
}

function pathJoin(pathA: string, pathB: string) {
  pathA = toPosixPath(pathA)
  pathB = toPosixPath(pathB)
  if (pathIsAbsolute(pathB)) {
    throw new Error('Cannot join two absolute paths')
  }
  return path.posix.join(pathA, pathB)
}
