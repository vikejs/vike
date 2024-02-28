// Public use
export { getGlobalContextSync }
export { getGlobalContextAsync }

// Internal use
export { initGlobalContext }
export { getGlobalContext }
export { getViteDevServer }
export { getViteConfig }
export { setGlobalContext_viteDevServer }
export { setGlobalContext_prerender }
export { getRuntimeManifest }

import {
  assert,
  assertNodeEnv_runtime,
  assertUsage,
  assertWarning,
  getGlobalObject,
  isPlainObject,
  objectAssign,
  objectKeys
} from './utils.js'
import type { ViteManifest } from '../shared/ViteManifest.js'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import { loadImportBuild } from './globalContext/loadImportBuild.js'
import { setPageFiles } from '../../shared/getPageFiles.js'
import { assertPluginManifest, PluginManifest } from '../shared/assertPluginManifest.js'
import type { ConfigVikeResolved } from '../../shared/ConfigVike.js'
import { getConfigVike } from '../shared/getConfigVike.js'
import { assertRuntimeManifest, type RuntimeManifest } from '../shared/assertRuntimeManifest.js'
import pc from '@brillout/picocolors'
let resolveGlobalContext: (globalContext: GlobalContext) => void
const globalObject = getGlobalObject<{
  globalContext?: GlobalContext
  globalContextPromise: Promise<GlobalContext>
  viteDevServer?: ViteDevServer
  viteConfig?: ResolvedConfig
}>('globalContext.ts', {
  globalContextPromise: new Promise((r) => (resolveGlobalContext = r))
})

type GlobalContextPublic = {
  assetsManifest: null | ViteManifest
}
type GlobalContext = {
  baseServer: string
  baseAssets: null | string
  includeAssetsImportedByServer: boolean
  redirects: Record<string, string>
  trailingSlash: boolean
  disableUrlNormalization: boolean
} & (
  | {
      isProduction: false
      isPrerendering: false
      viteConfig: ResolvedConfig
      viteDevServer: ViteDevServer
      assetsManifest: null
      pluginManifest: null
    }
  | ({
      isProduction: true
      assetsManifest: ViteManifest
      pluginManifest: PluginManifest
      viteDevServer: null
    } & (
      | {
          isPrerendering: false
          viteConfig: null
        }
      | {
          isPrerendering: true
          viteConfig: ResolvedConfig
        }
    ))
)

function getGlobalContext(): GlobalContext {
  assert(globalObject.globalContext)
  return globalObject.globalContext
}

/** @experimental https://vike.dev/getGlobalContext */
function getGlobalContextSync(): GlobalContextPublic {
  assertUsage(
    globalObject.globalContext,
    "The global context isn't set yet, call getGlobalContextSync() later or use getGlobalContextAsync() instead."
  )
  return makePublic(globalObject.globalContext)
}
/** @experimental https://vike.dev/getGlobalContext */
async function getGlobalContextAsync(): Promise<GlobalContextPublic> {
  await globalObject.globalContextPromise
  assert(globalObject.globalContext)
  return makePublic(globalObject.globalContext)
}
function makePublic(globalContext: GlobalContext): GlobalContextPublic {
  const globalContextPublic = {
    assetsManifest: globalContext.assetsManifest
  }

  // Add internals (and prepended _ prefix to their keys)
  {
    const publicKeys = Object.keys(globalContextPublic)
    objectKeys(globalContext)
      .filter((key) => !publicKeys.includes(key))
      .forEach((key) => {
        const keyPublic = `_${key}`
        Object.defineProperty(globalContextPublic, keyPublic, {
          enumerable: true,
          get() {
            assertWarning(
              false,
              `Using internal globalContext.${keyPublic} which is discouraged: it may break in any minor version update. Instead, reach out on GitHub and elaborate your use case.`,
              {
                onlyOnce: true
              }
            )
            return globalContext[key]
          }
        })
      })
  }

  return globalContextPublic
}

function setGlobalContext_viteDevServer(viteDevServer: ViteDevServer) {
  if (globalObject.viteDevServer) return
  assert(!globalObject.globalContext)
  assert(!globalObject.globalContext)
  globalObject.viteConfig = viteDevServer.config
  globalObject.viteDevServer = viteDevServer
}
function getViteDevServer(): ViteDevServer | null {
  return globalObject.viteDevServer ?? null
}
function setGlobalContext_prerender(viteConfig: ResolvedConfig): void {
  if (globalObject.viteConfig) return
  assert(!globalObject.globalContext)
  globalObject.viteConfig = viteConfig
}
function getViteConfig(): ResolvedConfig | null {
  return globalObject.viteConfig ?? null
}

async function initGlobalContext(isPrerendering = false, outDir?: string): Promise<void> {
  if (globalObject.globalContext) return

  const { viteDevServer, viteConfig } = globalObject
  assertNodeEnv_runtime(!!viteDevServer)
  const isProduction = !viteDevServer

  if (!isProduction) {
    assert(viteConfig)
    assert(!isPrerendering)
    const configVike = await getConfigVike(viteConfig)
    const pluginManifest = getRuntimeManifest(configVike)
    globalObject.globalContext = {
      isProduction: false,
      isPrerendering: false,
      assetsManifest: null,
      pluginManifest: null,
      viteDevServer,
      viteConfig,
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer,
      redirects: pluginManifest.redirects,
      trailingSlash: pluginManifest.trailingSlash,
      disableUrlNormalization: pluginManifest.disableUrlNormalization
    }
  } else {
    const buildEntries = await loadImportBuild(outDir)
    assertBuildEntries(buildEntries, isPrerendering ?? false)
    const { pageFiles, assetsManifest, pluginManifest } = buildEntries
    setPageFiles(pageFiles)
    assertViteManifest(assetsManifest)
    assertPluginManifest(pluginManifest)
    const globalContext = {
      isProduction: true as const,
      assetsManifest,
      pluginManifest,
      viteDevServer: null,
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer,
      redirects: pluginManifest.redirects,
      trailingSlash: pluginManifest.trailingSlash,
      disableUrlNormalization: pluginManifest.disableUrlNormalization
    }
    if (isPrerendering) {
      assert(viteConfig)
      const configVike = await getConfigVike(viteConfig)
      assert(configVike)
      objectAssign(globalContext, {
        isPrerendering: true as const,
        viteConfig
      })
      globalObject.globalContext = globalContext
    } else {
      objectAssign(globalContext, {
        isPrerendering: false as const,
        viteConfig: null
      })
      globalObject.globalContext = globalContext
    }
  }

  resolveGlobalContext(globalObject.globalContext)
}

function getRuntimeManifest(configVike: ConfigVikeResolved): RuntimeManifest {
  const { includeAssetsImportedByServer, baseServer, baseAssets, redirects, trailingSlash, disableUrlNormalization } =
    configVike
  const manifest = {
    baseServer,
    baseAssets,
    includeAssetsImportedByServer,
    redirects,
    trailingSlash,
    disableUrlNormalization
  }
  assertRuntimeManifest(manifest)
  return manifest
}

function assertBuildEntries<T>(buildEntries: T | null, isPreRendering: boolean): asserts buildEntries is T {
  const errMsg = [
    `You are tyring to run`,
    isPreRendering ? 'pre-rendering' : 'the server for production',
    `but your app isn't built yet. Run ${pc.cyan('$ vite build')} before `,
    isPreRendering ? 'pre-rendering.' : 'running the server.'
  ].join(' ')
  assertUsage(buildEntries, errMsg)
}

function assertViteManifest(manifest: unknown): asserts manifest is ViteManifest {
  assert(isPlainObject(manifest))
  /* We should include these assertions but we don't as a workaround for PWA manifests: https://github.com/vikejs/vike/issues/769
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
