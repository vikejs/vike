import { assert } from './assert'
import { assertPosixPath } from './filesystemPathHandling'

export { getOutDirs }

function getOutDirs(outDir: string, { prerenderConfig }: { prerenderConfig?: true } = {}) {
  assertPosixPath(outDir)
  let outDirRoot: string
  if (prerenderConfig) {
    assert(!outDir.endsWith('/client') && !outDir.endsWith('/server'), { outDir })
    outDirRoot = outDir
  } else {
    assert(outDir.endsWith('/client') || outDir.endsWith('/server'), { outDir })
    assert('/client'.length === '/server'.length)
    outDirRoot = outDir.slice(0, -1 * '/client'.length)
  }
  const outDirClient = `${outDirRoot}/client`
  const outDirServer = `${outDirRoot}/server`
  return { outDirRoot, outDirClient, outDirServer }
}
