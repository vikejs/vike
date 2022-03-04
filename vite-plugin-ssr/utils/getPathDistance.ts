import { assert } from './assert'
import { assertPosixPath } from './filesystemPathHandling'

export { getPathDistance }

function getPathDistance(pathA: string, pathB: string): number {
  assertPosixPath(pathA)
  assertPosixPath(pathB)
  assert(pathA.startsWith('/'))
  assert(pathB.startsWith('/'))

  let charIdx = 0
  for (; charIdx < pathA.length && charIdx < pathB.length; charIdx++) {
    if (pathA[charIdx] !== pathB[charIdx]) break
  }

  const pathAWithoutCommon = pathA.slice(charIdx)
  const pathBWithoutCommon = pathB.slice(charIdx)

  const distanceA = pathAWithoutCommon.split('/').length
  const distanceB = pathBWithoutCommon.split('/').length

  const distance = distanceA + distanceB

  return distance
}
