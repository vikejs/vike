import { assert } from './assert'
import { assertPosixPath } from './filesystemPathHandling'

export { getOutDirs }

function getOutDirs(outDir: string) {
  assert(outDir.endsWith('/client') || outDir.endsWith('/server'), { outDir })
  assertPosixPath(outDir)
  assert('/client'.length === '/server'.length)
  const outDirRoot = outDir.slice(0, -1 * '/client'.length)
  const outDirClient = `${outDirRoot}/client`
  const outDirServer = `${outDirRoot}/server`
  return { outDirRoot, outDirClient, outDirServer }
}
