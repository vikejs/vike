import { assert } from './assert'
import { assertPosixPath } from './filesystemPathHandling'

export { getOutDirs }

function getOutDirs(outDir: string, { prerenderConfig }: { prerenderConfig?: true } = {}) {
  assertPosixPath(outDir)
  let outDirRoot: string
  if (prerenderConfig) {
    assertIsRoot(outDir)
    outDirRoot = outDir
  } else {
    assertIsNotRoot(outDir)
    assert('/client'.length === '/server'.length)
    outDirRoot = outDir.slice(0, -1 * '/client'.length)
  }
  const outDirClient = `${outDirRoot}/client`
  const outDirServer = `${outDirRoot}/server`
  return { outDirRoot, outDirClient, outDirServer }
}

function assertIsRoot(outDir: string) {
  const p = outDir.split('/').filter(Boolean)
  const dir = p[p.length - 1]
  assert(dir !== 'client' && dir !== 'server', { outDir })
}
function assertIsNotRoot(outDir: string) {
  assert(outDir.endsWith('/client') || outDir.endsWith('/server'), { outDir })
}
