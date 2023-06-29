export { getOutDirs }
export { getOutDirs_prerender }
export { resolveOutDir }

import type { UserConfig, ResolvedConfig } from 'vite'
import { viteIsSSR } from './viteIsSSR'
import { assert } from './assert'
import { pathJoin } from './path-shim'
import { assertPosixPath, toPosixPath } from './filesystemPathHandling'

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
  assert('/client'.length === '/server'.length)
  const outDirRoot = outDir.slice(0, -1 * '/client'.length)
  return getAllOutDirs(outDirRoot, config.root)
}
function getOutDirs_prerender(config: ResolvedConfig): OutDirs {
  const outDirRoot = getOutDirFromResolvedConfig(config)
  assertPosixPath(outDirRoot)
  assertIsOutDirRoot(outDirRoot)
  return getAllOutDirs(outDirRoot, config.root)
}

/** Appends `client/` or `server/` to `config.build.outDir` */
function resolveOutDir(config: UserConfig): string {
  const outDir = getOutDirFromUserConfig(config) || 'dist'
  assertPosixPath(outDir)
  if (!isOutDirRoot(outDir)) {
    // If using Telefunc + vite-plugin-ssr then config.build.outDir may already have been resolved (because both Telefunc and vite-plugin-ssr use this logic)
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

function getAllOutDirs(outDirRoot: string, root: string) {
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

function determineOutDirs(outDirRoot: string) {
  assertIsOutDirRoot(outDirRoot)
  assertPosixPath(outDirRoot)
  const outDirClient = pathJoin(outDirRoot, 'client')
  const outDirServer = pathJoin(outDirRoot, 'server')
  assertIsNotOutDirRoot(outDirClient)
  assertIsNotOutDirRoot(outDirServer)
  return { outDirClient, outDirServer }
}

function assertIsOutDirRoot(outDir: string) {
  assert(isOutDirRoot(outDir))
}
function isOutDirRoot(outDir: string) {
  const p = outDir.split('/').filter(Boolean)
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
  if (viteIsSSR(config)) {
    assert(outDir.endsWith('/server'))
  } else {
    assert(outDir.endsWith('/client'))
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
  return getFirstDir(outDir) === getFirstDir(process.cwd())
}
function getFirstDir(p: string) {
  const firstDir = p.split(/\/|\\/).filter(Boolean)[0]
  return firstDir
}
