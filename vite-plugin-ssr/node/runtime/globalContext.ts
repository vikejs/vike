export { initGlobalContext }
export { getGlobalContext }
export { getViteDevServer }
export { getViteConfig }
export { setGlobalContext_viteDevServer }
export { setGlobalContext_vitePreviewServer }
export { setGlobalContext_viteConfig }
export { getRuntimeManifest }

import {
  assert,
  assertUsage,
  assertWarning,
  getGlobalObject,
  getNodeEnv,
  isPlainObject,
  objectAssign
} from './utils.js'
import type { ViteManifest } from '../shared/ViteManifest.js'
import type { ResolvedConfig, ViteDevServer, PreviewServerForHook as VitePreviewServer } from 'vite'
import { loadImportBuild } from './globalContext/loadImportBuild.js'
import { setPageFiles } from '../../shared/getPageFiles.js'
import { assertPluginManifest, PluginManifest } from '../shared/assertPluginManifest.js'
import type { ConfigVpsResolved } from '../../shared/ConfigVps.js'
import { getConfigVps } from '../shared/getConfigVps.js'
import { assertRuntimeManifest, type RuntimeManifest } from '../shared/assertRuntimeManifest.js'
const globalObject = getGlobalObject<{
  globalContext?: GlobalContext
  viteDevServer?: ViteDevServer
  vitePreviewServer?: VitePreviewServer
  viteConfig?: ResolvedConfig
}>('globalContext.ts', {})

type GlobalContext = (
  | {
      isProduction: false
      isPrerendering: false
      viteConfig: ResolvedConfig
      configVps: ConfigVpsResolved
      viteDevServer: ViteDevServer
      vitePreviewServer: null
      clientManifest: null
      pluginManifest: null
    }
  | ({
      isProduction: true
      clientManifest: ViteManifest
      pluginManifest: PluginManifest
      viteDevServer: null
      vitePreviewServer: null | VitePreviewServer
    } & (
      | {
          isPrerendering: false
          viteConfig: null
          configVps: null
        }
      | {
          isPrerendering: true
          viteConfig: ResolvedConfig
          configVps: ConfigVpsResolved
        }
    ))
) & {
  baseServer: string
  baseAssets: null | string
  includeAssetsImportedByServer: boolean
  redirects: Record<string, string>
}

function getGlobalContext(): GlobalContext {
  assert(globalObject.globalContext)
  return globalObject.globalContext
}

function setGlobalContext_viteDevServer(viteDevServer: ViteDevServer) {
  if (globalObject.viteDevServer) return
  assert(!globalObject.globalContext)
  globalObject.viteDevServer = viteDevServer
}
function setGlobalContext_vitePreviewServer(vitePreviewServer: VitePreviewServer) {
  if (globalObject.vitePreviewServer) return
  assert(!globalObject.globalContext)
  globalObject.vitePreviewServer = vitePreviewServer
}
function getViteDevServer(): ViteDevServer | null {
  return globalObject.viteDevServer ?? null
}
function setGlobalContext_viteConfig(viteConfig: ResolvedConfig): void {
  if (globalObject.viteConfig) return
  assert(!globalObject.globalContext)
  globalObject.viteConfig = viteConfig
}
function getViteConfig(): ResolvedConfig | null {
  return globalObject.viteConfig ?? null
}

async function initGlobalContext(isPrerendering = false, outDir?: string): Promise<void> {
  if (globalObject.globalContext) return

  const { viteDevServer, vitePreviewServer, viteConfig } = globalObject
  assertNodeEnv(!!viteDevServer)
  const isProduction = !viteDevServer

  if (!isProduction) {
    assert(viteConfig)
    assert(!isPrerendering)
    assert(!vitePreviewServer)
    const configVps = await getConfigVps(viteConfig)
    const pluginManifest = getRuntimeManifest(configVps)
    globalObject.globalContext = {
      isProduction: false,
      isPrerendering: false,
      clientManifest: null,
      pluginManifest: null,
      viteDevServer,
      vitePreviewServer: null,
      viteConfig,
      configVps,
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer,
      redirects: pluginManifest.redirects
    }
  } else {
    const buildEntries = await loadImportBuild(outDir)
    assertBuildEntries(buildEntries, isPrerendering ?? false)
    const { pageFiles, clientManifest, pluginManifest } = buildEntries
    setPageFiles(pageFiles)
    assertViteManifest(clientManifest)
    assertPluginManifest(pluginManifest)
    const globalContext = {
      isProduction: true as const,
      clientManifest,
      pluginManifest,
      viteDevServer: null,
      vitePreviewServer: vitePreviewServer ?? null,
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer,
      redirects: pluginManifest.redirects
    }
    if (isPrerendering) {
      assert(viteConfig)
      const configVps = await getConfigVps(viteConfig)
      assert(configVps)
      objectAssign(globalContext, {
        isPrerendering: true as const,
        viteConfig,
        configVps
      })
      globalObject.globalContext = globalContext
    } else {
      objectAssign(globalContext, {
        isPrerendering: false as const,
        viteConfig: null,
        configVps: null
      })
      globalObject.globalContext = globalContext
    }
  }
}

function getRuntimeManifest(configVps: ConfigVpsResolved): RuntimeManifest {
  const { includeAssetsImportedByServer, baseServer, baseAssets, redirects } = configVps
  const manifest = {
    baseServer,
    baseAssets,
    includeAssetsImportedByServer,
    redirects
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
    )}\` which is contradictory, see https://vite-plugin-ssr.com/NODE_ENV`,
    { onlyOnce: true }
  )
}
