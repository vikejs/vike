export { getOutDirs }
export { resolveOutDir }
export { resolveOutDir_configEnvironment }
export type { OutDirs }

import type { UserConfig, ResolvedConfig, Environment, EnvironmentOptions } from 'vite'
import pc from '@brillout/picocolors'
import { assert, assertPosixPath, assertUsage, createDebugger, pathJoin, toPosixPath } from '../utils.js'
import { isViteServerBuild } from './isViteServerBuild.js'
const debug = createDebugger('vike:outDir')

type OutDirs = {
  /** Absolute path to `outDir` */
  outDirRoot: string
  /** Absolute path to `${outDir}/client` */
  outDirClient: string
  /** Absolute path to `${outDir}/server` */
  outDirServer: string
}

function getOutDirs(configGlobal: ResolvedConfig, viteEnv?: Environment): OutDirs {
  const configEnv = viteEnv?.config ?? configGlobal
  debug('getOutDirs()', new Error().stack)
  const outDir = getOutDirFromViteResolvedConfig(configEnv)
  if (!isOutDirRoot(outDir)) assertOutDirResolved(outDir, configEnv)
  const outDirs = getOutDirsAll(outDir, configEnv.root)
  return outDirs
}

function resolveOutDir_configEnvironment(
  configGlobal: ResolvedConfig,
  envName: string,
  configEnv: EnvironmentOptions,
): string {
  const viteEnv = { name: envName, config: configEnv }
  const isServerSide = isViteServerBuild(configGlobal, viteEnv)
  assert_resolveOutDir_configEnvironment(isServerSide, configEnv)
  const res = resolveOutDir(configEnv, isServerSide)
  return res
}
function assert_resolveOutDir_configEnvironment(isServerSide1: boolean, configEnv: EnvironmentOptions) {
  if (configEnv.consumer) {
    const isServerSide2 = configEnv.consumer === 'server'
    assert(isServerSide1 === isServerSide2)
  }
}

/** Appends `client/` or `server/` to `config.build.outDir` */
function resolveOutDir(config: UserConfig, isServerSide: boolean): string {
  debug('resolveOutDir()', new Error().stack)
  debug('isServerSide', isServerSide)
  const outDir = getOutDirFromViteUserConfig(config) || 'dist'
  debug('outDir', outDir)
  /* outDir may already be resolved when using Telefunc + Vike (because both Telefunc and Vike use this logic)
  assert(isOutDirRoot(outDir))
  */

  const { outDirClient, outDirServer } = getOutDirsAll(outDir)
  if (isServerSide) {
    debug('outDirServer', 'outDirServer')
    return outDirServer
  } else {
    debug('outDirClient', 'outDirClient')
    return outDirClient
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

function getOutDirsAll(outDir: string, root?: string) {
  let outDirRoot: string
  {
    if (isOutDirRoot(outDir)) {
      outDirRoot = outDir
    } else {
      assert(outDir.endsWith('/server') || outDir.endsWith('/client'))
      assert('/client'.length === '/server'.length)
      outDirRoot = outDir.slice(0, -1 * '/client'.length)
    }
  }
  debug('outDirRoot', outDirRoot)
  let outDirs: OutDirs
  if (root) {
    outDirs = getOutDirsAllFromRootNormalized(outDirRoot, root)
  } else {
    outDirs = getOutDirsAllFromRoot(outDirRoot)
  }
  debug('outDirs', outDirs)
  return outDirs
}
function getOutDirsAllFromRoot(outDirRoot: string) {
  let { outDirClient, outDirServer } = determineOutDirs(outDirRoot)
  return { outDirRoot, outDirClient, outDirServer }
}
function getOutDirsAllFromRootNormalized(outDirRoot: string, root: string): OutDirs {
  if (root && !outDirIsAbsolutePath(outDirRoot)) {
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

/** Assert that `outDir` ends with `/server` or `/client` */
function assertOutDirResolved(outDir: string, config: UserConfig | ResolvedConfig) {
  assertPosixPath(outDir)
  assertIsNotOutDirRoot(outDir)

  assert('/client'.length === '/server'.length)
  const outDirCorrected = outDir.slice(0, -1 * '/client'.length)
  const wrongUsage = `You've set Vite's config.build.outDir to ${pc.cyan(outDir)} but you should set it to ${pc.cyan(
    outDirCorrected,
  )} instead.`

  if (isViteServerBuild(config, undefined)) {
    assertUsage(outDir.endsWith('/server'), wrongUsage)
  } else {
    assertUsage(outDir.endsWith('/client'), wrongUsage)
  }
}

function getOutDirFromViteUserConfig(config: UserConfig | ResolvedConfig): string | undefined {
  let outDir = config.build?.outDir
  if (outDir === undefined) return undefined
  outDir = normalizeOutDir(outDir)
  return outDir
}
function getOutDirFromViteResolvedConfig(config: ResolvedConfig): string {
  let outDir = config.build.outDir
  assert(outDir)
  outDir = normalizeOutDir(outDir)
  return outDir
}
function normalizeOutDir(outDir: string): string {
  outDir = toPosixPath(outDir)
  outDir = outDir.replace(/\/+$/, '') // remove trailing slashes
  return outDir
}

function outDirIsAbsolutePath(outDir: string) {
  // There doesn't seem to be a better alternative to determine whether `outDir` is an absolute path
  //  - Very unlikely that `outDir`'s first dir matches the filesystem's first dir
  //    - Although more likely to happen with Docker
  return getFirstDir(outDir) === getFirstDir(process.cwd())
}
function getFirstDir(p: string) {
  const firstDir = p.split(/\/|\\/).filter(Boolean)[0]
  return firstDir
}
