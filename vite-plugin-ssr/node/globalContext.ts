export { getGlobalContext }
export { setViteDevServer }
export { getViteDevServer }
export type { GlobalContext }

import { PromiseType, assert, assertUsage, hasProp, objectAssign } from './utils'
import type { ViteDevServer } from 'vite'
import { loadDistEntries } from './plugin/plugins/distEntries/loadDistEntries'
import { setPageFiles } from '../shared/getPageFiles'
import { assertViteManifest } from './viteManifest'
import { assertPluginManifest } from './plugin/plugins/manifest/assertPluginManifest'
import { getRuntimeConfig, setRuntimeConfig } from './globalContext/runtimeConfig'

type GlobalContext = PromiseType<ReturnType<typeof getGlobalContext>>

let viteDevServer: ViteDevServer | null = null
function setViteDevServer(viteDevServer_: ViteDevServer) {
  viteDevServer = viteDevServer_
  assert(viteDevServer)
}
function getViteDevServer() {
  return viteDevServer
}

async function getGlobalContext(isPreRendering: boolean) {
  assertProdEnv(viteDevServer)

  const globalContext = {}

  const isProduction = isPreRendering || viteDevServer === null
  if (isProduction) {
    assert(viteDevServer === null)
    const distEntries = await loadDistEntries({
      // TODO
      distPath: null,
      /*
      root: process.cwd(),
      outDir: 'dist/'
      */
    })
    assertDistEntries(distEntries, isPreRendering)
    const { pageFiles, clientManifest, pluginManifest } = distEntries
    assertViteManifest(clientManifest)
    assertPluginManifest(pluginManifest)
    setPageFiles(pageFiles)
    objectAssign(globalContext, {
      _isProduction: true as const,
      _manifestClient: clientManifest,
      _manifestPlugin: pluginManifest,
    })
    setRuntimeConfig(pluginManifest)
  } else {
    objectAssign(globalContext, {
      _isProduction: false as const,
      _manifestClient: null,
      _manifestPlugin: null,
    })
  }

  const runtimeConfig = getRuntimeConfig()
  objectAssign(globalContext, {
    _baseUrl: runtimeConfig.baseUrl,
    _baseAssets: runtimeConfig.baseAssets,
    _viteDevServer: viteDevServer,
    //_outDir: viteDevServer?.runtimeConfig.build.outDir ?? getPluginManifest().outDir)
    _objectCreatedByVitePluginSsr: true,
  })
  /*
  if( !viteDevServer ) {
    return {
    isProduction: true,
    root: process.cwd(),
    outDir: 'dist',
    baseUrl: '/',
    baseAssets: null,
    viteDevServer: undefined,
    }
  }
  return {
    isProduction: false,
    root: process.cwd(),
    outDir: 'dist',
    baseUrl: '/',
    baseAssets: null,
    viteDevServer,
  }
  */

  return globalContext
}

function assertDistEntries<T>(distEntries: T | null, isPreRendering: boolean): asserts distEntries is T {
  // "Do not install vite-plugin-ssr after building your app. Instead, install your app's dependencies before building.",
  const errMsg = [
    `You are tyring to run`,
    isPreRendering ? '`$ vite-plugin-ssr prerender`' : 'the server for production',
    "but your app isn't built yet. Run `$ vite build && vite build --ssr` before ",
    isPreRendering ? 'pre-rendering.' : 'running the server.',
  ].join(' ')
  assertUsage(distEntries, errMsg)
}

function assertProdEnv(viteDevServer: null | ViteDevServer) {
  assertUsage(
    !(isProdEnv() && viteDevServer),
    "You created a Vite dev server with `createServer()` (`import { createServer } from 'vite'`) while setting `process.env.NODE_ENV` to `production`. This is contradictory: for production skip `createServer()`, and for development do not set `process.env.NODE_ENV` to `production`.",
  )
}
function isProdEnv() {
  if (typeof process == 'undefined' || !hasProp(process, 'env')) return true
  return process.env.NODE_ENV === 'production'
}
