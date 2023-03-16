export { initGlobalContext }
export { getGlobalContext }
export { setGlobalContextViteDevServer }
export { setGlobalContextViteConfig }
export { getRuntimeManifest }

import { assert, assertUsage, getGlobalObject, isPlainObject } from './utils'
import type { ViteManifest } from '../shared/ViteManifest'
import type { ResolvedConfig } from 'vite'
import { loadBuild } from '../shared/loadImportBuildCjs'
import { setPageFiles } from '../../shared/getPageFiles'
import { assertPluginManifest, PluginManifest } from '../shared/assertPluginManifest'
import type { ConfigVpsResolved } from '../shared/ConfigVps'
import { getConfigVps } from '../shared/getConfigVps'
import type { ViteDevServerEnhanced } from '../plugin/plugins/setGlobalContext'
import { assertRuntimeManifest, type RuntimeManifest } from '../shared/assertRuntimeManifest'
const globalObject = getGlobalObject<{
  globalContext?: GlobalContext
  viteDevServer?: ViteDevServerEnhanced
  config?: ResolvedConfig
}>('globalContext.ts', {})

type GlobalContext = (
  | {
      isProduction: false
      isPrerendering: false
      viteDevServer: ViteDevServerEnhanced
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
  baseServer: string
  baseAssets: null | string
  includeAssetsImportedByServer: boolean
}

function getGlobalContext(): GlobalContext {
  assert(globalObject.globalContext)
  return globalObject.globalContext
}

function setGlobalContextViteDevServer(viteDevServer: ViteDevServerEnhanced) {
  if (globalObject.viteDevServer) return
  assert(!globalObject.globalContext)
  globalObject.viteDevServer = viteDevServer
}
function setGlobalContextViteConfig(config: ResolvedConfig): void {
  if (globalObject.config) return
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
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer
    }
  } else {
    assert(config)
    assert(!isPrerendering)
    const configVps = await getConfigVps(config)
    const pluginManifest = getRuntimeManifest(configVps)
    globalObject.globalContext = {
      isProduction,
      isPrerendering: false,
      clientManifest: null,
      pluginManifest: null,
      viteDevServer,
      config,
      configVps,
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer
    }
  }
}

function getRuntimeManifest(configVps: ConfigVpsResolved): RuntimeManifest {
  const { includeAssetsImportedByServer, baseServer, baseAssets } = configVps
  const manifest = {
    baseServer,
    baseAssets,
    includeAssetsImportedByServer
  }
  assertRuntimeManifest(manifest)
  return manifest
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

function assertViteManifest(manifest: unknown): asserts manifest is ViteManifest {
  assert(isPlainObject(manifest))
  Object.entries(manifest)
    // circumvent esbuild bug: esbuild adds a `default` key to JSON upon `require('./some.json')`.
    .filter(([key]) => key !== 'default')
    .forEach(([_, entry]) => {
      assert(isPlainObject(entry))
      assert(typeof entry.file === 'string')
    })
}
