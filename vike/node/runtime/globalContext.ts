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
export { initGlobalContext_getGlobalContextAsync }
export { setGlobalContext_viteDevServer }
export { setGlobalContext_viteConfig }
export { setGlobalContext_vikeConfig }
export { setGlobalContext_isViteDev }
export { setGlobalContext_isPrerendering }
export { setGlobalContext_buildEntry }
export { clearGlobalContext }

import {
  assert,
  onSetupRuntime,
  assertUsage,
  assertWarning,
  isPlainObject,
  objectAssign,
  objectReplace,
  objectKeys,
  isObject,
  hasProp,
  debugGlob,
  getGlobalObject,
  genPromise
} from './utils.js'
import type { ViteManifest } from '../shared/ViteManifest.js'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import { importServerProductionEntry } from '@brillout/vite-plugin-server-entry/runtime'
import { virtualFileIdImportUserCodeServer } from '../shared/virtual-files/virtualFileImportUserCode.js'
import { setPageFiles, setPageFilesAsync } from '../../shared/getPageFiles/getPageFiles.js'
import { assertPluginManifest } from '../shared/assertPluginManifest.js'
import type { VikeConfigGlobal } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import { assertRuntimeManifest, type RuntimeManifest } from '../shared/assertRuntimeManifest.js'
import pc from '@brillout/picocolors'
import { resolveBaseFromResolvedConfig } from '../shared/resolveBase.js'
import type { VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
const globalObject = getGlobalObject<{
  globalContext?: GlobalContext
  viteDevServer?: ViteDevServer
  viteDevServerPromise: Promise<ViteDevServer>
  viteDevServerPromiseResolve: (viteDevServer: ViteDevServer) => void
  isViteDev?: boolean
  viteConfig?: ResolvedConfig
  vikeConfig?: VikeConfigObject
  outDirRoot?: string
  isPrerendering?: true
  initGlobalContext_runPrerender_alreadyCalled?: true
  buildEntry?: {
    pageFiles: Record<string, unknown>
    assetsManifest: Record<string, unknown>
    pluginManifest: Record<string, unknown>
  }
}>('globalContext.ts', getInitialGlobalContext())

initDevEntry()

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
      vikeConfig: VikeConfigObject
      viteDevServer: ViteDevServer
      assetsManifest: null
    }
  | ({
      isProduction: true
      assetsManifest: ViteManifest
      viteDevServer: null
    } & (
      | {
          isPrerendering: false
          viteConfig: null
        }
      | {
          isPrerendering: true
          usesClientRouter: boolean
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
async function getGlobalContextAsync(isProduction: boolean): Promise<GlobalContextPublic> {
  assertUsage(
    typeof isProduction === 'boolean',
    `[getGlobalContextAsync(isProduction)] Argument ${pc.cyan('isProduction')} ${
      isProduction === undefined ? 'is missing' : `should be ${pc.cyan('true')} or ${pc.cyan('false')}`
    }`
  )
  await initGlobalContext_getGlobalContextAsync(isProduction)
  const { globalContext } = globalObject
  assert(globalContext)
  return makePublic(globalContext)
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
  assertIsNotInitilizedYet()
  assert(globalObject.viteConfig)
  globalObject.viteDevServer = viteDevServer
  globalObject.viteDevServerPromiseResolve(viteDevServer)
  eagerlyLoadUserFiles()
}
function setGlobalContext_viteConfig(viteConfig: ResolvedConfig, outDirRoot: string): void {
  if (globalObject.viteConfig) return
  assertIsNotInitilizedYet()
  globalObject.viteConfig = viteConfig
  globalObject.outDirRoot = outDirRoot
}
function setGlobalContext_vikeConfig(vikeConfig: VikeConfigObject): void {
  if (globalObject.vikeConfig) return
  assertIsNotInitilizedYet()
  globalObject.vikeConfig = vikeConfig
}
function assertIsNotInitilizedYet() {
  // In develpoment, globalObject.viteDevServer always needs to be awaited for before initializing globalObject.globalContext
  assert(!globalObject.globalContext)
}
function setGlobalContext_isViteDev(isViteDev: boolean) {
  globalObject.isViteDev = isViteDev
}
function setGlobalContext_isPrerendering() {
  globalObject.isPrerendering = true
}
function getViteDevServer(): ViteDevServer | null {
  return globalObject.viteDevServer ?? null
}
function getViteConfig(): ResolvedConfig | null {
  return globalObject.viteConfig ?? null
}

async function initGlobalContext_renderPage(): Promise<void> {
  await initGlobalContext(!globalObject.isViteDev)
}

async function initGlobalContext_runPrerender(): Promise<void> {
  if (globalObject.initGlobalContext_runPrerender_alreadyCalled) return
  globalObject.initGlobalContext_runPrerender_alreadyCalled = true

  assert(globalObject.isPrerendering)
  assert(globalObject.viteConfig)
  assert(globalObject.outDirRoot)

  // We assume initGlobalContext_runPrerender() to be called before:
  // - initGlobalContext_renderPage()
  // - initGlobalContext_getGlobalContextAsync()
  assert(!globalObject.globalContext)

  await initGlobalContext(true)
}

async function initGlobalContext_getGlobalContextAsync(isProduction: boolean): Promise<void> {
  if (!isProduction) {
    const waitFor = 20
    const timeout = setTimeout(() => {
      assertWarning(false, `Vite's development server still not created after ${waitFor} seconds.`, {
        onlyOnce: false,
        showStackTrace: true
      })
    }, waitFor * 1000)
    await globalObject.viteDevServerPromise
    clearTimeout(timeout)
  }
  await initGlobalContext(isProduction)
}

async function initGlobalContext(isProduction: boolean): Promise<void> {
  if (globalObject.globalContext) {
    assert(globalObject.globalContext.isProduction === isProduction)
    // We assume setGlobalContext_isPrerendering() is called before initGlobalContext()
    assert(globalObject.globalContext.isPrerendering === (globalObject.isPrerendering ?? false))
    return
  }

  const { viteDevServer, viteConfig, vikeConfig, isPrerendering } = globalObject
  onSetupRuntime()

  if (!isProduction) {
    assert(viteConfig)
    assert(vikeConfig)
    assert(viteDevServer)
    assert(!isPrerendering)
    const pluginManifest = getRuntimeManifest(vikeConfig.vikeConfigGlobal, viteConfig)
    globalObject.globalContext = {
      isProduction: false,
      isPrerendering: false,
      assetsManifest: null,
      viteDevServer,
      viteConfig,
      vikeConfig,
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer,
      redirects: pluginManifest.redirects,
      trailingSlash: pluginManifest.trailingSlash,
      disableUrlNormalization: pluginManifest.disableUrlNormalization
    }
  } else {
    const buildEntry = await getBuildEntry(globalObject.outDirRoot)
    const { assetsManifest, pluginManifest } = buildEntry
    setPageFiles(buildEntry.pageFiles)
    assertViteManifest(assetsManifest)
    assertPluginManifest(pluginManifest)
    const globalContext = {
      isProduction: true as const,
      assetsManifest,
      viteDevServer: null,
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer,
      redirects: pluginManifest.redirects,
      trailingSlash: pluginManifest.trailingSlash,
      usesClientRouter: pluginManifest.usesClientRouter,
      disableUrlNormalization: pluginManifest.disableUrlNormalization
    }
    if (isPrerendering) {
      assert(viteConfig)
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
}

function getRuntimeManifest(vikeConfigGlobal: VikeConfigGlobal, viteConfig: ResolvedConfig): RuntimeManifest {
  const { includeAssetsImportedByServer, redirects, trailingSlash, disableUrlNormalization } = vikeConfigGlobal
  const { baseServer, baseAssets } = resolveBaseFromResolvedConfig(
    vikeConfigGlobal.baseServer,
    vikeConfigGlobal.baseAssets,
    viteConfig
  )
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

async function getBuildEntry(outDir?: string) {
  if (!globalObject.buildEntry) {
    await importServerProductionEntry({ outDir })
    assert(globalObject.buildEntry)
  }
  return globalObject.buildEntry
}
function setGlobalContext_buildEntry(buildEntry: unknown) {
  assert(isObject(buildEntry))
  assert(hasProp(buildEntry, 'pageFiles', 'object'))
  assert(hasProp(buildEntry, 'assetsManifest', 'object'))
  assert(hasProp(buildEntry, 'pluginManifest', 'object'))
  globalObject.buildEntry = buildEntry
}

function initDevEntry() {
  setPageFilesAsync(getPageFilesExports)
}
async function getPageFilesExports(): Promise<Record<string, unknown>> {
  const viteDevServer = getViteDevServer()
  assert(viteDevServer)
  let moduleExports: Record<string, unknown>
  try {
    moduleExports = await viteDevServer.ssrLoadModule(virtualFileIdImportUserCodeServer)
  } catch (err) {
    debugGlob(`Glob error: ${virtualFileIdImportUserCodeServer} transpile error: `, err)
    throw err
  }
  moduleExports = (moduleExports as any).default || moduleExports
  debugGlob('Glob result: ', moduleExports)
  assert(isObject(moduleExports))
  return moduleExports
}

function clearGlobalContext() {
  objectReplace(globalObject, getInitialGlobalContext())
}

function getInitialGlobalContext() {
  const { promise: viteDevServerPromise, resolve: viteDevServerPromiseResolve } = genPromise<ViteDevServer>()
  return {
    viteDevServerPromise,
    viteDevServerPromiseResolve
  }
}
