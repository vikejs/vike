export { getOutDirs }
export { getOutDirs_prerender }
export { resolveOutDir }

import type { UserConfig, ResolvedConfig } from 'vite'
import { viteIsSSR } from './viteIsSSR.js'
import { assert, assertUsage } from './assert.js'
import { pathJoin } from './path-shim.js'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling.js'

type OutDirs = {
  /** Absolute path to `outDir` */
  outDirRoot: string
  /** Absolute path to `${outDir}/client` */
  outDirClient: string
  /** Absolute path to `${outDir}/server` */
  outDirServer: string
}

function getOutDirs(config: ResolvedConfig): OutDirs {
  const outDir = getOutDirFromResolvedConfig(config)
  assertOutDirResolved(outDir, config)
  assert(outDir.endsWith('/server') || outDir.endsWith('/client'))
  assert('/client'.length === '/server'.length)
  const outDirRoot = outDir.slice(0, -1 * '/client'.length)
  return getOutDirsAll(outDirRoot, config.root)
}
function getOutDirs_prerender(config: ResolvedConfig): OutDirs {
  const outDirRoot = getOutDirFromResolvedConfig(config)
  assert(isOutDirRoot(outDirRoot))
  return getOutDirsAll(outDirRoot, config.root)
}

/** Appends `client/` or `server/` to `config.build.outDir` */
function resolveOutDir(config: UserConfig): string {
  const outDir = getOutDirFromUserConfig(config) || 'dist'
  // outDir may already be resolved when using Telefunc + vite-plugin-ssr (because both Telefunc and vite-plugin-ssr use this logic)
  if (!isOutDirRoot(outDir)) {
    assertOutDirResolved(outDir, config)
    return outDir
  } else {
    const { outDirClient, outDirServer } = determineOutDirs(outDir)
    if (viteIsSSR(config)) {
      return outDirServer
    } else {
      return outDirClient
    }
  }
}

function determineOutDirs(outDirRoot: string) {
  assertPosixPath(outDirRoot)
  assert(isOutDirRoot(outDirRoot))
  const outDirClient = pathJoin(outDirRoot, 'client')
  const outDirServer = pathJoin(outDirRoot, 'server')
  assertIsNotOutDirRoot(outDirClient)
  assertIsNotOutDirRoot(outDirServer)
  return { outDirClient, outDirServer }
}

function getOutDirsAll(outDirRoot: string, root: string) {
  if (!outDirIsAbsolutePath(outDirRoot)) {
    assertPosixPath(outDirRoot)
    assertPosixPath(root)
    outDirRoot = pathJoin(root, outDirRoot)
  }

  let { outDirClient, outDirServer } = determineOutDirs(outDirRoot)
  outDirRoot = outDirRoot + '/'
  outDirClient = outDirClient + '/'
  outDirServer = outDirServer + '/'

  assertNormalization(outDirRoot)
  assertNormalization(outDirClient)
  assertNormalization(outDirServer)

  return { outDirRoot, outDirClient, outDirServer }
}
function assertNormalization(outDirAny: string) {
  assertPosixPath(outDirAny)
  assert(outDirIsAbsolutePath(outDirAny))
  assert(outDirAny.endsWith('/'))
  assert(!outDirAny.endsWith('//'))
}

function isOutDirRoot(outDirRot: string) {
  const p = outDirRot.split('/').filter(Boolean)
  const lastDir = p[p.length - 1]
  return lastDir !== 'client' && lastDir !== 'server'
}
function assertIsNotOutDirRoot(outDir: string) {
  assert(outDir.endsWith('/client') || outDir.endsWith('/server'))
}

/** `outDir` ends with `/server` or `/client` */
function assertOutDirResolved(outDir: string, config: UserConfig | ResolvedConfig) {
  assertPosixPath(outDir)
  assertIsNotOutDirRoot(outDir)
  assert('/client'.length === '/server'.length)
  const outDirCorrected = outDir.slice(0, -1 * '/client'.length)
  const wrongUsage = `You've set Vite's config.build.outDir to '${outDir}' but you should set it to '${outDirCorrected}' instead.`
  if (viteIsSSR(config)) {
    assertUsage(outDir.endsWith('/server'), wrongUsage)
  } else {
    assertUsage(outDir.endsWith('/client'), wrongUsage)
  }
}

function getOutDirFromUserConfig(config: UserConfig): string | undefined {
  let outDir = config.build?.outDir
  if (outDir === undefined) return undefined
  // I believe Vite normalizes config.build.outDir only if config is ResolvedConfig
  outDir = toPosixPath(outDir)
  return outDir
}
function getOutDirFromResolvedConfig(config: ResolvedConfig): string {
  let outDir = config.build.outDir
  // Vite seems to be buggy and doesn't always normalize config.build.outDir
  outDir = toPosixPath(outDir)
  return outDir
}

function outDirIsAbsolutePath(outDir: string) {
  // There doesn't seem to be a better alternative to determine whether `outDir` is an aboslute path
  //  - Very unlikely that `outDir`'s first dir macthes the filesystem's first dir
  //    - Although more likely to happen with Docker
  return getFirstDir(outDir) === getFirstDir(process.cwd())
}
function getFirstDir(p: string) {
  const firstDir = p.split(/\/|\\/).filter(Boolean)[0]
  return firstDir
}
