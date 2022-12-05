export { initGlobalContext }
export { getGlobalContext }
export { getGlobalContext2 }
export { setGlobalContextViteDevServer }
export { setGlobalContextConfigVps }
export { getViteDevServer }
export type { GlobalContext }

import { PromiseType, assert, assertUsage, objectAssign, getGlobalObject } from './utils'
import type { ViteDevServer } from 'vite'
import { loadBuild } from './plugin/plugins/importBuild/loadBuild'
import { setPageFiles } from '../shared/getPageFiles'
import { assertViteManifest, type ViteManifest } from './viteManifest'
import { assertPluginManifest, PluginManifest } from './plugin/plugins/manifest/assertPluginManifest'
import { getRuntimeConfig, setRuntimeConfig } from './globalContext/runtimeConfig'
import { ConfigVpsResolved } from './plugin/plugins/config/ConfigVps'
const globalObject = getGlobalObject<{
  viteDevServer?: ViteDevServer
  configVps?: ConfigVpsResolved
  globalContext?: GlobalContext2
}>('globalContext.ts', {})

type GlobalContext2 = (
  | {
      isProduction: false
      isPrerendering: false
      viteDevServer: ViteDevServer
      configVps: ConfigVpsResolved
      clientManifest: null
      pluginManifest: null
    }
  | {
      isProduction: true
      isPrerendering: boolean
      clientManifest: ViteManifest
      pluginManifest: PluginManifest
      configVps: null
      viteDevServer: null
    }
) & {
  baseUrl: null | string
  baseAssets: null | string
  includeAssetsImportedByServer: boolean
}

type GlobalContext = PromiseType<ReturnType<typeof getGlobalContext>>

function setGlobalContextViteDevServer(viteDevServer: ViteDevServer) {
  assert(!globalObject.globalContext)
  globalObject.viteDevServer = viteDevServer
}
function setGlobalContextConfigVps(configVps: ConfigVpsResolved): void {
  assert(!globalObject.globalContext)
  globalObject.configVps = configVps
}

// TODO: remove
function getViteDevServer(): ViteDevServer | null {
  return globalObject.viteDevServer ?? null
}

async function initGlobalContext({ isPrerendering }: { isPrerendering?: true } = {}): Promise<void> {
  if (globalObject.globalContext) return

  const { viteDevServer, configVps } = globalObject
  const isProduction = !viteDevServer

  if (isProduction) {
    const buildEntries = await loadBuild()
    assertBuildEntries(buildEntries, isPrerendering ?? false)
    const { pageFiles, clientManifest, pluginManifest } = buildEntries
    assertViteManifest(clientManifest)
    assertPluginManifest(pluginManifest)
    setRuntimeConfig(pluginManifest)
    setPageFiles(pageFiles)
    const runtimeConfig = getRuntimeConfig()
    globalObject.globalContext = {
      isProduction,
      isPrerendering: isPrerendering ?? false,
      clientManifest,
      pluginManifest,
      viteDevServer: null,
      configVps: null,
      baseUrl: runtimeConfig.baseUrl,
      baseAssets: runtimeConfig.baseAssets,
      includeAssetsImportedByServer: runtimeConfig.includeAssetsImportedByServer
    }
  } else {
    assert(configVps)
    assert(!isPrerendering)
    const runtimeConfig = getRuntimeConfig()
    globalObject.globalContext = {
      isProduction,
      isPrerendering: false,
      clientManifest: null,
      pluginManifest: null,
      viteDevServer,
      configVps,
      baseUrl: runtimeConfig.baseUrl,
      baseAssets: runtimeConfig.baseAssets,
      includeAssetsImportedByServer: runtimeConfig.includeAssetsImportedByServer
    }
  }
}

function getGlobalContext2(): GlobalContext2 {
  assert(globalObject.globalContext)
  return globalObject.globalContext
}

async function getGlobalContext(isPreRendering: boolean) {
  const { viteDevServer, configVps } = globalObject

  const globalContext = {}

  const isProduction = !viteDevServer
  if (isProduction) {
    const buildEntries = await loadBuild()
    assertBuildEntries(buildEntries, isPreRendering)
    const { pageFiles, clientManifest, pluginManifest } = buildEntries
    assertViteManifest(clientManifest)
    assertPluginManifest(pluginManifest)
    setPageFiles(pageFiles)
    objectAssign(globalContext, {
      _isProduction: true as const,
      _manifestClient: clientManifest,
      _manifestPlugin: pluginManifest,
      _configVps: null
    })
    setRuntimeConfig(pluginManifest)
  } else {
    assert(configVps)
    objectAssign(globalContext, {
      _isProduction: false as const,
      _manifestClient: null,
      _manifestPlugin: null,
      _configVps: configVps ?? null
    })
  }

  const runtimeConfig = getRuntimeConfig()
  objectAssign(globalContext, {
    _baseUrl: runtimeConfig.baseUrl, // TODO: remove from pageContext in favor of directly accessing globalContext?
    _baseAssets: runtimeConfig.baseAssets,
    _viteDevServer: viteDevServer ?? null,
    _includeAssetsImportedByServer: runtimeConfig.includeAssetsImportedByServer,
    _objectCreatedByVitePluginSsr: true // TODO: remove
  })

  return globalContext
}

function assertBuildEntries<T>(buildEntries: T | null, isPreRendering: boolean): asserts buildEntries is T {
  const errMsg = [
    `You are tyring to run`,
    isPreRendering ? '`$ vite-plugin-ssr prerender`' : 'the server for production',
    "but your app isn't built yet. Run `$ vite build` before ",
    isPreRendering ? 'pre-rendering.' : 'running the server.'
  ].join(' ')
  assertUsage(buildEntries, errMsg)
}
