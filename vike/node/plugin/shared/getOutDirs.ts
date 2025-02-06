export { getOutDirs }
export { resolveOutDir }
export type { OutDirs }

import type { UserConfig, ResolvedConfig } from 'vite'
import pc from '@brillout/picocolors'
import { assert, assertPosixPath, assertUsage, createDebugger, pathJoin, toPosixPath } from '../utils.js'
import { viteIsSSR } from './viteIsSSR.js'
const debug = createDebugger('vike:outDir')

type OutDirs = {
  /** Absolute path to `outDir` */
  outDirRoot: string
  /** Absolute path to `${outDir}/client` */
  outDirClient: string
  /** Absolute path to `${outDir}/server` */
  outDirServer: string
}

function getOutDirs(config: ResolvedConfig): OutDirs {
  debug('getOutDirs()', new Error().stack)
  let outDirRoot: string
  {
    const outDir = getOutDirFromViteResolvedConfig(config)
    if (isOutDirRoot(outDir)) {
      outDirRoot = outDir
    } else {
      assertOutDirResolved(outDir, config)
      assert(outDir.endsWith('/server') || outDir.endsWith('/client'))
      assert('/client'.length === '/server'.length)
      outDirRoot = outDir.slice(0, -1 * '/client'.length)
    }
  }
  const outDirs = getOutDirsAll(outDirRoot, config.root)
  debug('outDirRoot', outDirRoot)
  debug('outDirs', outDirs)
  return outDirs
}

/** Appends `client/` or `server/` to `config.build.outDir` */
function resolveOutDir(config: UserConfig, forceSSR?: true): string {
  debug('resolveOutDir()', new Error().stack)
  const outDir = getOutDirFromViteUserConfig(config) || 'dist'
  debug('outDir', 'outDir')
  // outDir may already be resolved when using Telefunc + vike (because both Telefunc and vike use this logic)
  if (!isOutDirRoot(outDir)) {
    assertOutDirResolved(outDir, config)
    return outDir
  } else {
    const { outDirClient, outDirServer } = determineOutDirs(outDir)
    if (viteIsSSR(config) || forceSSR) {
      debug('outDirServer', 'outDirServer')
      return outDirServer
    } else {
      debug('outDirClient', 'outDirClient')
      return outDirClient
    }
  }
}

function determineOutDirs(outDirRoot: string) {
  assertPosixPath(outDirRoot)
  assert(!outDirRoot.endsWith('/'))
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
  const wrongUsage = `You've set Vite's config.build.outDir to ${pc.cyan(outDir)} but you should set it to ${pc.cyan(
    outDirCorrected
  )} instead.`
  if (viteIsSSR(config)) {
    assertUsage(outDir.endsWith('/server'), wrongUsage)
  } else {
    assertUsage(outDir.endsWith('/client'), wrongUsage)
  }
}

function getOutDirFromViteUserConfig(config: UserConfig | ResolvedConfig): string | undefined {
  let outDir = config.build?.outDir
  if (outDir === undefined) return undefined
  outDir = normalize(outDir)
  return outDir
}
function getOutDirFromViteResolvedConfig(config: ResolvedConfig): string {
  let outDir = config.build.outDir
  assert(outDir)
  outDir = normalize(outDir)
  return outDir
}
function normalize(outDir: string): string {
  outDir = toPosixPath(outDir)
  outDir = outDir.replace(/\/+$/, '') // remove trailing slashes
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
