export { initGlobalContext }
export { getGlobalContext }
export { setGlobalContextViteDevServer }
export { setGlobalContextViteConfig }
export { getRuntimeManifest }
export { assertRuntimeManifest }

import { assert, assertUsage, getGlobalObject, isObject, hasProp, assertBaseUrl, checkType } from './utils'
import { assertViteManifest, type ViteManifest } from './helpers'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import { loadBuild } from './plugin/plugins/importBuild/loadBuild'
import { setPageFiles } from '../shared/getPageFiles'
import { assertPluginManifest, PluginManifest } from './plugin/plugins/manifest/assertPluginManifest'
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

async function initGlobalContext({ isPrerendering }: { isPrerendering?: true } = {}): Promise<void> {
  if (globalObject.globalContext) return

  const { viteDevServer, config } = globalObject
  const isProduction = !viteDevServer

  if (isProduction) {
    const buildEntries = await loadBuild()
    assertBuildEntries(buildEntries, isPrerendering ?? false)
    const { pageFiles, clientManifest, pluginManifest } = buildEntries
    setPageFiles(pageFiles)
    assertViteManifest(clientManifest)
    assertPluginManifest(pluginManifest)
    globalObject.globalContext = {
      isProduction,
      isPrerendering: isPrerendering ?? false,
      clientManifest,
      pluginManifest,
      viteDevServer: null,
      config: null,
      configVps: null,
      baseUrl: pluginManifest.baseUrl,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer
    }
  } else {
    assert(config)
    assert(!isPrerendering)
    const configVps = await getConfigVps(config)
    const pluginManifest = getRuntimeManifest(config, configVps)
    globalObject.globalContext = {
      isProduction,
      isPrerendering: false,
      clientManifest: null,
      pluginManifest: null,
      viteDevServer,
      config,
      configVps,
      baseUrl: pluginManifest.baseUrl,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer
    }
  }
}

type RuntimeManifest = {
  baseUrl: string
  baseAssets: string | null
  includeAssetsImportedByServer: boolean
}
function getRuntimeManifest(config: ResolvedConfig, configVps: ConfigVpsResolved): RuntimeManifest {
  const { baseUrl, baseAssets } = resolveBase(config.base)
  const { includeAssetsImportedByServer } = configVps
  const manifest = {
    baseUrl,
    baseAssets,
    includeAssetsImportedByServer
  }
  assertRuntimeManifest(manifest)
  return manifest
}
function assertRuntimeManifest(obj: unknown): asserts obj is RuntimeManifest & Record<string, unknown> {
  assert(obj)
  assert(isObject(obj))
  assert(hasProp(obj, 'baseUrl', 'string'))
  assertBaseUrl(obj.baseUrl)
  assert(hasProp(obj, 'baseAssets', 'string') || hasProp(obj, 'baseAssets', 'null'))
  assert(hasProp(obj, 'includeAssetsImportedByServer', 'boolean'))
  checkType<RuntimeManifest>(obj)
}
function resolveBase(base: string): { baseUrl: string; baseAssets: string | null } {
  assertUsage(
    base.startsWith('/') || base.startsWith('http://') || base.startsWith('https://'),
    "vite.config.js#base should start with '/', 'http://', or 'https://'"
  )
  let baseUrl = '/'
  let baseAssets = null
  assert(base)
  if (base.startsWith('http')) {
    baseAssets = base
  } else {
    baseUrl = base
  }
  return {
    baseUrl,
    baseAssets
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
