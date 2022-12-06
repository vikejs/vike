export { initGlobalContext }
export { getGlobalContext }
export { setGlobalContextViteDevServer }
export { setGlobalContextViteConfig }
export { getViteDevServer }

import { assert, assertUsage, getGlobalObject } from './utils'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import { loadBuild } from './plugin/plugins/importBuild/loadBuild'
import { setPageFiles } from '../shared/getPageFiles'
import { assertViteManifest, type ViteManifest } from './viteManifest'
import { assertPluginManifest, PluginManifest } from './plugin/plugins/manifest/assertPluginManifest'
import { getRuntimeConfig, resolveRuntimeConfig, setRuntimeConfig } from './globalContext/runtimeConfig'
import { ConfigVpsResolved } from './plugin/plugins/config/ConfigVps'
import { getConfigVps } from './plugin/plugins/config/assertConfigVps'
const globalObject = getGlobalObject<{
  globalContext?: GlobalContext
  viteDevServer?: ViteDevServer
  config?: ResolvedConfig
}>('globalContext.ts', {})

type GlobalContext = (
  | {
      isProduction: false
      isPrerendering: false
      viteDevServer: ViteDevServer
      config: ResolvedConfig
      configVps: ConfigVpsResolved
      clientManifest: null
      pluginManifest: null
    }
  | {
      isProduction: true
      isPrerendering: boolean
      clientManifest: ViteManifest
      pluginManifest: PluginManifest
      config: null
      configVps: null
      viteDevServer: null
    }
) & {
  baseUrl: string
  baseAssets: null | string
  includeAssetsImportedByServer: boolean
}

function getGlobalContext(): GlobalContext {
  assert(globalObject.globalContext)
  return globalObject.globalContext
}

function setGlobalContextViteDevServer(viteDevServer: ViteDevServer) {
  assert(!globalObject.globalContext)
  globalObject.viteDevServer = viteDevServer
}
function setGlobalContextViteConfig(config: ResolvedConfig): void {
  assert(!globalObject.globalContext)
  globalObject.config = config
}

// TODO: remove
function getViteDevServer(): ViteDevServer | null {
  return globalObject.viteDevServer ?? null
}

async function initGlobalContext({ isPrerendering }: { isPrerendering?: true } = {}): Promise<void> {
  if (globalObject.globalContext) return

  const { viteDevServer, config } = globalObject
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
      config: null,
      configVps: null,
      baseUrl: runtimeConfig.baseUrl,
      baseAssets: runtimeConfig.baseAssets,
      includeAssetsImportedByServer: runtimeConfig.includeAssetsImportedByServer
    }
  } else {
    assert(config)
    assert(!isPrerendering)
    const configVps = await getConfigVps(config)
    {
      const runtimeConfig = resolveRuntimeConfig(config, configVps)
      setRuntimeConfig(runtimeConfig)
    }
    const runtimeConfig = getRuntimeConfig()
    globalObject.globalContext = {
      isProduction,
      isPrerendering: false,
      clientManifest: null,
      pluginManifest: null,
      viteDevServer,
      config,
      configVps,
      baseUrl: runtimeConfig.baseUrl,
      baseAssets: runtimeConfig.baseAssets,
      includeAssetsImportedByServer: runtimeConfig.includeAssetsImportedByServer
    }
  }
}

function assertBuildEntries<T>(buildEntries: T | null, isPreRendering: boolean): asserts buildEntries is T {
  const errMsg = [
    `You are tyring to run`,
    isPreRendering ? 'pre-rendering' : 'the server for production',
    "but your app isn't built yet. Run `$ vite build` before ",
    isPreRendering ? 'pre-rendering.' : 'running the server.'
  ].join(' ')
  assertUsage(buildEntries, errMsg)
}
