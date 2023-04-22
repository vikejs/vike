export { initGlobalContext }
export { getGlobalContext }
export { setGlobalContextViteDevServer }
export { setGlobalContextViteConfig }
export { getRuntimeManifest }

import { assert, assertUsage, assertWarning, getGlobalObject, getNodeEnv, isPlainObject } from './utils'
import type { ViteManifest } from '../shared/ViteManifest'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import { loadImportBuild } from './globalContext/loadImportBuild'
import { setPageFiles } from '../../shared/getPageFiles'
import { assertPluginManifest, PluginManifest } from '../shared/assertPluginManifest'
import type { ConfigVpsResolved } from '../../shared/ConfigVps'
import { getConfigVps } from '../shared/getConfigVps'
import { assertRuntimeManifest, type RuntimeManifest } from '../shared/assertRuntimeManifest'
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
  baseServer: string
  baseAssets: null | string
  includeAssetsImportedByServer: boolean
}

function getGlobalContext(): GlobalContext {
  assert(globalObject.globalContext)
  return globalObject.globalContext
}

function setGlobalContextViteDevServer(viteDevServer: ViteDevServer) {
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
  assertNodeEnv(!!viteDevServer)
  const isProduction = !viteDevServer

  if (isProduction) {
    const buildEntries = await loadImportBuild()
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
  /* We should include these assertions but we don't as a workaround for PWA manifests: https://github.com/brillout/vite-plugin-ssr/issues/769
     Instead, we should rename the vite manifest e.g. with https://vitejs.dev/config/build-options.html#build-manifest
  Object.entries(manifest)
    // circumvent esbuild bug: esbuild adds a `default` key to JSON upon `require('./some.json')`.
    .filter(([key]) => key !== 'default')
    .forEach(([_, entry]) => {
      assert(isPlainObject(entry))
      assert(typeof entry.file === 'string')
    })
  */
}

function assertNodeEnv(hasViteDevServer: boolean) {
  const nodeEnv = getNodeEnv()
  if (nodeEnv === null || nodeEnv === 'test') return
  const isDevNodeEnv = [undefined, '', 'dev', 'development'].includes(nodeEnv)
  // calling Vite's createServer() is enough for hasViteDevServer to be true, even without actually adding Vite's development middleware to the server: https://github.com/brillout/vite-plugin-ssr/issues/792#issuecomment-1516830759
  assertWarning(
    hasViteDevServer === isDevNodeEnv,
    `Vite's development server was${hasViteDevServer ? '' : "n't"} instantiated while the environment is set to be a ${
      isDevNodeEnv ? 'development' : 'production'
    } environment by \`process.env.NODE_ENV === ${JSON.stringify(
      nodeEnv
    )}\` which is contradictory, see https://vite-plugin-ssr.com/renderPage#node-env`,
    { showStackTrace: false, onlyOnce: true }
  )
}
