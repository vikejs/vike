import type { UserConfig } from 'vite'
import { isSSR_config } from './isSSR'
import { assert, assertUsage } from './assert'
import { assertPosixPath } from './filesystemPathHandling'

export { getOutDirs }
export { getOutDir }

function getOutDir(config: UserConfig): string {
  const outDir = config.build?.outDir || 'dist'
  assertIsNotAbsolute(outDir)
  const { outDirClient, outDirServer } = getOutDirs(outDir, { isRoot: true })
  if (isSSR_config(config)) {
    return outDirServer
  } else {
    return outDirClient
  }
}

function getOutDirs(outDir: string, options: { isRoot?: true } = {}) {
  assertPosixPath(outDir)
  let outDirRoot: string
  if (isNotRoot(outDir)) {
    assert(!options.isRoot, { outDir })
    assert('/client'.length === '/server'.length)
    outDirRoot = outDir.slice(0, -1 * '/client'.length)
  } else {
    outDirRoot = outDir
  }
  assert(isRoot(outDirRoot), { outDir, options })
  const outDirClient = `${outDirRoot}/client`
  const outDirServer = `${outDirRoot}/server`
  return { outDirRoot, outDirClient, outDirServer }
}

function isRoot(outDir: string) {
  const p = outDir.split('/').filter(Boolean)
  const dir = p[p.length - 1]
  return dir !== 'client' && dir !== 'server'
}
function isNotRoot(outDir: string) {
  return outDir.endsWith('/client') || outDir.endsWith('/server')
}

function assertIsNotAbsolute(outDir: string) {
  assertUsage(
    firstSegment(outDir) !== firstSegment(process.cwd()),
    "vite.config.js#build.outDir is not allowed to be an absolute path, e.g. set its value to 'build/' instead of `path.join(__dirname, 'build/')`"
  )
}

function firstSegment(p: string) {
  return p.split(/\/|\\/).filter(Boolean)[0]
}
