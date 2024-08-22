// Public use
export { getGlobalContextSync }
export { getGlobalContextAsync }

// Internal use
export { getGlobalContext }
export { getViteDevServer }
export { getViteConfig }
export { getRuntimeManifest }
export { initGlobalContext_renderPage }
export { initGlobalContext_runPrerender }
export { setGlobalContext_viteDevServer }
export { setGlobalContext_viteConfig }
export { setGlobalContext_isDev }

import {
  assert,
  assertNodeEnv_runtime,
  assertUsage,
  assertWarning,
  getGlobalObject,
  isPlainObject,
  objectAssign,
  objectKeys,
  genPromise
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
import { getPageFilesExports } from './page-files/getPageFilesExports.js'
const globalObject = getGlobalObject<{
  globalContext?: GlobalContext
  globalContextPromise: Promise<GlobalContext>
  globalContextPromiseResolve: (globalContext: GlobalContext) => void
  viteDevServer?: ViteDevServer
  isDev?: boolean
  viteConfig?: ResolvedConfig
  outDirRoot?: string
}>(
  'globalContext.ts',
  (() => {
    const { promise: globalContextPromise, resolve: globalContextPromiseResolve } = genPromise<GlobalContext>()
    return {
      globalContextPromise,
      globalContextPromiseResolve
    }
  })()
)

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
  assert(globalObject.viteConfig)
  globalObject.viteDevServer = viteDevServer
  eagerlyLoadUserFiles()
}
function setGlobalContext_viteConfig(viteConfig: ResolvedConfig, outDirRoot: string): void {
  if (globalObject.viteConfig) return
  assert(!globalObject.globalContext)
  globalObject.viteConfig = viteConfig
  globalObject.outDirRoot = outDirRoot
}
function setGlobalContext_isDev(isDev: boolean) {
  globalObject.isDev = isDev
}
function getViteDevServer(): ViteDevServer | null {
  return globalObject.viteDevServer ?? null
}
function getViteConfig(): ResolvedConfig | null {
  return globalObject.viteConfig ?? null
}

async function initGlobalContext_renderPage(): Promise<void> {
  const mode = globalObject.isDev ? 'dev' : 'prod'
  await initGlobalContext(mode)
}

async function initGlobalContext_runPrerender(skipAssertOutDirRoot?: true): Promise<void> {
  if (!skipAssertOutDirRoot) assert(globalObject.outDirRoot)
  await initGlobalContext('prerender')
}

async function initGlobalContext(mode: 'dev' | 'prod' | 'prerender'): Promise<void> {
  if (globalObject.globalContext) {
    const modeAlreadySet: typeof mode = (() => {
      if (!globalObject.globalContext.isProduction) {
        return 'dev'
      }
      if (globalObject.globalContext.isPrerendering) {
        return 'prerender'
      }
      return 'prod'
    })()
    assert(modeAlreadySet === mode)
    return
  }

  const { viteDevServer, viteConfig, isDev } = globalObject
  assertNodeEnv_runtime(isDev ?? false)

  if (mode === 'dev') {
    assert(viteConfig)
    assert(viteDevServer)
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
    const buildEntries = await loadImportBuild(globalObject.outDirRoot)
    assertBuildEntries(buildEntries, mode === 'prerender')
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
    if (mode === 'prerender') {
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

  globalObject.globalContextPromiseResolve(globalObject.globalContext)
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

function eagerlyLoadUserFiles() {
  // Other than here, the getPageFilesExports() function is only called only upon calling the renderPage() function.
  // We call it as early as possible here for better performance.
  getPageFilesExports()
}
