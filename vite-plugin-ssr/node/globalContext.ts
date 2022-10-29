export { getGlobalContext }
export { setViteDevServer }
export { getViteDevServer }
export type { GlobalContext }

import { PromiseType, assert, assertUsage, hasProp, objectAssign, getGlobalObject } from './utils'
import type { ViteDevServer } from 'vite'
import { loadBuild } from './plugin/plugins/importBuild/loadBuild'
import { setPageFiles } from '../shared/getPageFiles'
import { assertViteManifest } from './viteManifest'
import { assertPluginManifest } from './plugin/plugins/manifest/assertPluginManifest'
import { getRuntimeConfig, setRuntimeConfig } from './globalContext/runtimeConfig'
const globalObject = getGlobalObject<{ viteDevServer: null | ViteDevServer }>('globalContext.ts', {
  viteDevServer: null
})

type GlobalContext = PromiseType<ReturnType<typeof getGlobalContext>>

function setViteDevServer(viteDevServer: ViteDevServer) {
  assert(viteDevServer)
  globalObject.viteDevServer = viteDevServer
}
function getViteDevServer(): ViteDevServer | null {
  return globalObject.viteDevServer
}

async function getGlobalContext(isPreRendering: boolean) {
  const { viteDevServer } = globalObject
  assertProdEnv(viteDevServer)

  const globalContext = {}

  const isProduction = isPreRendering || viteDevServer === null
  if (isProduction) {
    assert(viteDevServer === null)
    const buildEntries = await loadBuild()
    assertBuildEntries(buildEntries, isPreRendering)
    const { pageFiles, clientManifest, pluginManifest } = buildEntries
    assertViteManifest(clientManifest)
    assertPluginManifest(pluginManifest)
    setPageFiles(pageFiles)
    objectAssign(globalContext, {
      _isProduction: true as const,
      _manifestClient: clientManifest,
      _manifestPlugin: pluginManifest
    })
    setRuntimeConfig(pluginManifest)
  } else {
    objectAssign(globalContext, {
      _isProduction: false as const,
      _manifestClient: null,
      _manifestPlugin: null
    })
  }

  const runtimeConfig = getRuntimeConfig()
  objectAssign(globalContext, {
    _baseUrl: runtimeConfig.baseUrl,
    _baseAssets: runtimeConfig.baseAssets,
    _viteDevServer: viteDevServer,
    _includeAssetsImportedByServer: runtimeConfig.includeAssetsImportedByServer,
    //_outDir: viteDevServer?.runtimeConfig.build.outDir ?? getPluginManifest().outDir)
    _objectCreatedByVitePluginSsr: true
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

function assertBuildEntries<T>(buildEntries: T | null, isPreRendering: boolean): asserts buildEntries is T {
  // "Don't install vite-plugin-ssr after building your app. Instead, install your app's dependencies before building.",
  const errMsg = [
    `You are tyring to run`,
    isPreRendering ? '`$ vite-plugin-ssr prerender`' : 'the server for production',
    "but your app isn't built yet. Run `$ vite build` before ",
    isPreRendering ? 'pre-rendering.' : 'running the server.'
  ].join(' ')
  assertUsage(buildEntries, errMsg)
}

function assertProdEnv(viteDevServer: null | ViteDevServer) {
  assertUsage(
    !(isProdEnv() && viteDevServer),
    "You created a Vite dev server with `createServer()` (`import { createServer } from 'vite'`) while setting `process.env.NODE_ENV` to `production`. This is contradictory: for production skip `createServer()`, and for development don't set `process.env.NODE_ENV` to `production`."
  )
}
function isProdEnv() {
  if (typeof process == 'undefined' || !hasProp(process, 'env')) return true
  return process.env.NODE_ENV === 'production'
}
