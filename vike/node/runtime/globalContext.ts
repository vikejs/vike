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
  genPromise,
  createDebugger
} from './utils.js'
import type { ViteManifest } from '../shared/ViteManifest.js'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import { importServerProductionEntry } from '@brillout/vite-plugin-server-entry/runtime'
import { virtualFileIdImportUserCodeServer } from '../shared/virtual-files/virtualFileImportUserCode.js'
import { getPageFilesAll, setPageFiles, setPageFilesAsync } from '../../shared/getPageFiles/getPageFiles.js'
import { assertPluginManifest } from '../shared/assertPluginManifest.js'
import type { VikeConfigGlobal } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import { assertRuntimeManifest, type RuntimeManifest } from '../shared/assertRuntimeManifest.js'
import pc from '@brillout/picocolors'
import { resolveBaseFromResolvedConfig } from '../shared/resolveBase.js'
import type { VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import type { ConfigUserFriendly } from '../../shared/page-configs/getPageConfigUserFriendly.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import { assertV1Design } from '../shared/assertV1Design.js'
const debug = createDebugger('vike:globalContext')
const globalObject = getGlobalObject<{
  globalContext?: GlobalContext
  viteDevServer?: ViteDevServer
  viteDevServerPromise: Promise<ViteDevServer>
  viteDevServerPromiseResolve: (viteDevServer: ViteDevServer) => void
  isViteDev?: boolean
  viteConfig?: ResolvedConfig
  // TODO/now remove
  vikeConfig?: VikeConfigObject
  outDirRoot?: string
  isPrerendering?: true
  initGlobalContext_runPrerender_alreadyCalled?: true
  buildEntry?: unknown
  buildEntryPrevious?: unknown
}>('globalContext.ts', getInitialGlobalContext())

initDevEntry()

type GlobalContextPublic = {
  assetsManifest: null | ViteManifest
}
type PageRuntimeInfo = Awaited<ReturnType<typeof getPageRuntimeInfo>>['userFiles']
type GlobalContext = {
  baseServer: string
  baseAssets: null | string
  includeAssetsImportedByServer: boolean
  trailingSlash: boolean
  disableUrlNormalization: boolean
  vikeConfig: {
    global: ConfigUserFriendly
  }
} & PageRuntimeInfo &
  (
    | {
        isProduction: false
        isPrerendering: false
        viteConfig: ResolvedConfig
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
  if (!globalObject.globalContext) {
    debug('getGlobalContext()', new Error().stack)
    assert(false)
  }
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
    // TODO/now: add viteConfig and vikeConfig
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
  debug('initGlobalContext_renderPage()')
  await initGlobalContext(!globalObject.isViteDev)
}

async function initGlobalContext_runPrerender(): Promise<void> {
  debug('initGlobalContext_runPrerender()')
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
  debug('initGlobalContext_getGlobalContextAsync()')
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

// TODO/now: refactor: move this to the top of the file
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
    const { globalConfig, userFiles } = await getPageRuntimeInfo(isProduction)
    const pluginManifest = getRuntimeManifest(vikeConfig.vikeConfigGlobal, viteConfig)
    globalObject.globalContext = {
      isProduction: false,
      isPrerendering: false,
      assetsManifest: null,
      viteDevServer,
      viteConfig,
      vikeConfig: {
        global: globalConfig
      },
      ...userFiles,
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer,
      trailingSlash: pluginManifest.trailingSlash,
      disableUrlNormalization: pluginManifest.disableUrlNormalization
    }
  } else {
    const buildEntry = await getBuildEntry(globalObject.outDirRoot)
    const { assetsManifest, pluginManifest } = buildEntry
    setPageFiles(buildEntry.pageFiles)
    const { globalConfig, userFiles } = await getPageRuntimeInfo(isProduction)
    assertViteManifest(assetsManifest)
    assertPluginManifest(pluginManifest)
    const globalContext = {
      isProduction: true as const,
      assetsManifest,
      vikeConfig: {
        global: globalConfig
      },
      ...userFiles,
      viteDevServer: null,
      baseServer: pluginManifest.baseServer,
      baseAssets: pluginManifest.baseAssets,
      includeAssetsImportedByServer: pluginManifest.includeAssetsImportedByServer,
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

async function getPageRuntimeInfo(isProduction: boolean) {
  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal, globalConfig } = await getPageFilesAll(
    false,
    isProduction
  )
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds
  )
  const userFiles = {
    pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds,
    pageRoutes,
    onBeforeRouteHook
  }
  assertV1Design(
    // pageConfigs is PageConfigRuntime[] but assertV1Design() requires PageConfigBuildTime[]
    pageConfigs.length > 0,
    pageFilesAll
  )
  return { userFiles, globalConfig }
}

function getRuntimeManifest(vikeConfigGlobal: VikeConfigGlobal, viteConfig: ResolvedConfig): RuntimeManifest {
  const { includeAssetsImportedByServer, trailingSlash, disableUrlNormalization } = vikeConfigGlobal
  const { baseServer, baseAssets } = resolveBaseFromResolvedConfig(
    vikeConfigGlobal.baseServer,
    vikeConfigGlobal.baseAssets,
    viteConfig
  )
  const manifest = {
    baseServer,
    baseAssets,
    includeAssetsImportedByServer,
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
  debug('getBuildEntry()')
  if (!globalObject.buildEntry) {
    debug('importServerProductionEntry()')
    // importServerProductionEntry() loads dist/server/entry.mjs which calls setGlobalContext_buildEntry()
    await importServerProductionEntry({ outDir })
    if (!globalObject.buildEntry) {
      debug('globalObject.buildEntryPrevious')
      // Needed, for example, when calling the API prerender() then preview() because both trigger a importServerProductionEntry() call but only the first only is applied because of the import() cache. (A proper implementation would be to clear the import() cache, but it probably isn't possible on platforms such as Cloudflare Workers.)
      globalObject.buildEntry = globalObject.buildEntryPrevious
    }
    assert(globalObject.buildEntry)
  }
  const { buildEntry } = globalObject
  assert(isObject(buildEntry))
  assert(hasProp(buildEntry, 'pageFiles', 'object'))
  assert(hasProp(buildEntry, 'assetsManifest', 'object'))
  assert(hasProp(buildEntry, 'pluginManifest', 'object'))
  return buildEntry
}
function setGlobalContext_buildEntry(buildEntry: unknown) {
  debug('setGlobalContext_buildEntry()')
  globalObject.buildEntry = buildEntry
  globalObject.buildEntryPrevious = buildEntry
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
  debug('clearGlobalContext()')
  objectReplace(globalObject, getInitialGlobalContext(), ['buildEntryPrevious'])
}

function getInitialGlobalContext() {
  debug('getInitialGlobalContext()')
  const { promise: viteDevServerPromise, resolve: viteDevServerPromiseResolve } = genPromise<ViteDevServer>()
  return {
    viteDevServerPromise,
    viteDevServerPromiseResolve
  }
}
