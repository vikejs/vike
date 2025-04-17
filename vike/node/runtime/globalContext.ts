// Public use
export { getGlobalContext }
export { getGlobalContextSync }
export { getGlobalContextAsync }

// Internal use
export { getGlobalContextInternal }
export { getViteDevServer }
export { getViteConfig }
export { initGlobalContext_renderPage }
export { initGlobalContext_runPrerender }
export { initGlobalContext_getPagesAndRoutes }
export { setGlobalContext_viteDevServer }
export { setGlobalContext_viteConfig }
export { setGlobalContext_isPrerendering }
export { setGlobalContext_isProduction }
export { setGlobalContext_buildEntry }
export { clearGlobalContext }
export { assertBuildInfo }
export { updateUserFiles }
export type { BuildInfo }
export type { GlobalContextInternal }
export type { GlobalContextServerSidePublic }

// The core logic revolves around:
// - virtualFileExports is the main requirement
// - In production: globalObject.buildEntry which is the production entry set by @brillout/vite-plugin-server-entry
//   - loadBuildEntry() sets globalObject.buildEntry and then sets virtualFileExports
//   - With vike-server it's set at server start: @brillout/vite-plugin-server-entry injects `import './entry.mjs'` (the production entry generated by @brillout/vite-plugin-server-entry) as first line of code of dist/server/index.mjs while dist/server/entry.mjs calls setGlobalContext_buildEntry()
//   - Without vike-server it's manually loaded here using importServerProductionEntry() which uses @brillout/vite-plugin-server-entry's autoImporter or crawler
// - In development: globalObject.viteDevServer which is Vite's development server
//   - globalObject.viteDevServer is used by updateUserFiles() which then sets virtualFileExports

import {
  assert,
  onSetupRuntime,
  assertUsage,
  assertWarning,
  isPlainObject,
  objectReplace,
  isObject,
  hasProp,
  debugGlob,
  getGlobalObject,
  genPromise,
  createDebugger,
  getPublicProxy,
  checkType,
  PROJECT_VERSION,
  objectAssign
} from './utils.js'
import type { ViteManifest } from '../shared/ViteManifest.js'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import { importServerProductionEntry } from '@brillout/vite-plugin-server-entry/runtime'
import { virtualFileIdImportUserCodeServer } from '../shared/virtual-files/virtualFileImportUserCode.js'
import pc from '@brillout/picocolors'
import type { PageConfigUserFriendly } from '../../shared/page-configs/getPageConfigUserFriendly.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import { assertV1Design } from '../shared/assertV1Design.js'
import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
import { resolveBase } from '../shared/resolveBase.js'
import type { ViteConfigRuntime } from '../plugin/shared/getViteConfigRuntime.js'
type PageConfigsRuntime = ReturnType<typeof getPageConfigsRuntime>
const debug = createDebugger('vike:globalContext')
const globalObject_ = getGlobalObject<
  {
    viteDevServer?: ViteDevServer
    viteConfig?: ResolvedConfig
    viteConfigRuntime?: ViteConfigRuntime
    isPrerendering?: true
    initGlobalContext_runPrerender_alreadyCalled?: true
    buildEntry?: unknown
    buildEntryPrevious?: unknown
    pageConfigsRuntime?: PageConfigsRuntime
    waitForUserFilesUpdate?: Promise<void>
    isProduction?: boolean
    buildInfo?: BuildInfo
    // Move to buildInfo.assetsManifest ?
    assetsManifest?: ViteManifest
    isInitialized?: true
  } & ReturnType<typeof getInitialGlobalContext>
>('runtime/globalContext.ts', getInitialGlobalContext())
// Trick to break down TypeScript circular dependency
// https://chat.deepseek.com/a/chat/s/d7e9f90a-c7f3-4108-9cd5-4ad6caed3539
const globalObject = globalObject_ as typeof globalObject_ & {
  globalContext: GlobalContextInternal
  globalContext_public?: GlobalContextServerSidePublic
}

type GlobalContextInternal = Awaited<ReturnType<typeof setGlobalContext>>

async function getGlobalContextInternal() {
  // getGlobalContextInternal() should always be called after initGlobalContext()
  assert(globalObject.isInitialized)
  assertGlobalContextIsDefined()
  if (globalObject.isProduction !== true) await globalObject.waitForUserFilesUpdate
  const { globalContext } = globalObject
  assertIsDefined(globalContext)
  const { globalContext_public } = globalObject
  assert(globalContext_public)
  return { globalContext, globalContext_public }
}

function assertIsDefined<T extends GlobalContextInternal>(
  globalContext: undefined | null | T
): asserts globalContext is T {
  if (!globalContext) {
    debug('globalContext', globalContext)
    debug('assertIsDefined()', new Error().stack)
    assert(false)
  }
}
function assertGlobalContextIsDefined() {
  assertIsDefined(globalObject.globalContext)
  assert(globalObject.globalContext_public)
}

/**
 * Get runtime information about your app.
 *
 * https://vike.dev/getGlobalContext
 */
async function getGlobalContext(): Promise<GlobalContextServerSidePublic> {
  debug('getGlobalContext()')
  const { isProduction } = globalObject
  // This assertion cannot fail for vike-server users (because when using vike-server it's guaranteed that globalObject.isProduction is set before executing any user-land code and any Vike extension code).
  assertUsage(isProduction !== undefined, "The global context isn't set yet, use getGlobalContextAsync() instead.")
  assert(typeof globalObject.isProduction === 'boolean')
  return await getGlobalContextAsync(isProduction)
}
/**
 * Get runtime information about your app.
 *
 * https://vike.dev/getGlobalContext
 */
async function getGlobalContextAsync(isProduction: boolean): Promise<GlobalContextServerSidePublic> {
  debug('getGlobalContextAsync()')
  assertUsage(
    typeof isProduction === 'boolean',
    `[getGlobalContextAsync(isProduction)] Argument ${pc.cyan('isProduction')} ${
      isProduction === undefined ? 'is missing' : `should be ${pc.cyan('true')} or ${pc.cyan('false')}`
    }`
  )
  setIsProduction(isProduction)
  if (!globalObject.globalContext) await initGlobalContext_getGlobalContextAsync()
  if (!isProduction) await globalObject.waitForUserFilesUpdate
  assertGlobalContextIsDefined()
  const { globalContext_public } = globalObject
  assert(globalContext_public)
  return globalContext_public
}
/**
 * Get runtime information about your app.
 *
 * https://vike.dev/getGlobalContext
 *
 * @deprecated
 */
function getGlobalContextSync(): GlobalContextServerSidePublic {
  debug('getGlobalContextSync()')
  const { globalContext_public } = globalObject
  assertUsage(
    globalContext_public,
    "The global context isn't set yet, call getGlobalContextSync() later or use getGlobalContext() instead."
  )
  assertWarning(
    false,
    // We discourage users from using it because using `pageContext.globalContext` is better: it doesn't have the race condition issue that `getGlobalContextSync()` would have when called inside React/Vue components.
    // We're lying about "is going to be deprecated in the next major release": let's keep it and see if users need it (so far I can't see a use case for it).
    'getGlobalContextSync() is going to be deprecated in the next major release, see https://vike.dev/getGlobalContext',
    { onlyOnce: true }
  )
  return globalContext_public
}

type GlobalContextServerSidePublic = ReturnType<typeof makePublic>
function makePublic(globalContext: GlobalContextInternal) {
  const globalContextPublic = getPublicProxy(globalContext, 'globalContext', [
    'assetsManifest',
    'config',
    'viteConfig',
    'viteConfigRuntime',
    'pages',
    'baseServer',
    'baseAssets'
  ])
  return globalContextPublic
}

async function setGlobalContext_viteDevServer(viteDevServer: ViteDevServer) {
  debug('setGlobalContext_viteDevServer()')
  setIsProduction(false)
  // We cannot cache globalObject.viteDevServer because it's fully replaced when the user modifies vite.config.js => Vite's dev server is fully reloaded and a new viteDevServer replaces the previous one.
  if (!globalObject.viteDevServer) {
    assertIsNotInitilizedYet()
  }
  assert(globalObject.viteConfig)
  globalObject.viteDevServer = viteDevServer
  await updateUserFiles()
  assertGlobalContextIsDefined()
  globalObject.viteDevServerPromiseResolve(viteDevServer)
}
function setGlobalContext_viteConfig(viteConfig: ResolvedConfig, viteConfigRuntime: ViteConfigRuntime): void {
  if (globalObject.viteConfig) return
  assertIsNotInitilizedYet()
  globalObject.viteConfig = viteConfig
  globalObject.viteConfigRuntime = viteConfigRuntime
}
function assertIsNotInitilizedYet() {
  // In development, globalObject.viteDevServer always needs to be awaited for before initializing globalObject.globalContext
  assert(!globalObject.globalContext)
}
function setGlobalContext_isPrerendering() {
  globalObject.isPrerendering = true
  setIsProduction(true)
}
function setGlobalContext_isProduction(isProduction: boolean, tolerateContraditction?: true) {
  if (globalObject.isProduction === undefined) {
    setIsProduction(isProduction)
  } else {
    assert(globalObject.isProduction === isProduction || tolerateContraditction)
  }
}
function getViteDevServer(): ViteDevServer | null {
  return globalObject.viteDevServer ?? null
}
function getViteConfig(): ResolvedConfig | null {
  return globalObject.viteConfig ?? null
}

async function initGlobalContext_renderPage(): Promise<void> {
  debug('initGlobalContext_renderPage()')

  // `globalObject.isProduction === undefined` when using production server without `vike-server`. (There isn't any reliable signal we can use to determine early whether the environement is production or development.)
  if (globalObject.isProduction === undefined) setIsProduction(true)

  await initGlobalContext()
}

async function initGlobalContext_runPrerender(): Promise<void> {
  debug('initGlobalContext_runPrerender()')
  assert(globalObject.isPrerendering === true)
  assert(globalObject.isProduction === true)
  if (globalObject.initGlobalContext_runPrerender_alreadyCalled) return
  globalObject.initGlobalContext_runPrerender_alreadyCalled = true

  assert(globalObject.isPrerendering)
  assert(globalObject.viteConfig)

  // We assume initGlobalContext_runPrerender() to be called before:
  // - initGlobalContext_renderPage()
  // - initGlobalContext_getGlobalContextAsync()
  assertIsNotInitilizedYet()

  await initGlobalContext()
}

async function initGlobalContext_getGlobalContextAsync(): Promise<void> {
  debug('initGlobalContext_getGlobalContextAsync()')
  await initGlobalContext()
}
async function initGlobalContext_getPagesAndRoutes(): Promise<void> {
  debug('initGlobalContext_getPagesAndRoutes()')
  setIsProduction(true)
  await initGlobalContext()
}
async function waitForViteDevServer() {
  debug('waitForViteDevServer()')
  const waitFor = 20
  const timeout = setTimeout(() => {
    assertWarning(false, `Vite's development server still not created after ${waitFor} seconds.`, {
      onlyOnce: false,
      showStackTrace: true
    })
  }, waitFor * 1000)
  await globalObject.viteDevServerPromise
  clearTimeout(timeout)
  assertGlobalContextIsDefined()
}

async function initGlobalContext(): Promise<void> {
  const { isProduction } = globalObject
  assert(typeof isProduction === 'boolean')
  if (!isProduction) {
    await waitForViteDevServer()
  } else {
    await loadBuildEntry(globalObject.viteConfigRuntime?.build.outDir)
  }
  assertGlobalContextIsDefined()
  globalObject.isInitialized = true
}
function setIsProduction(isProduction: boolean) {
  debug('setIsProduction', isProduction)
  assert(typeof isProduction === 'boolean')
  if (globalObject.isProduction !== undefined) assert(globalObject.isProduction === isProduction)
  globalObject.isProduction = isProduction
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

async function loadBuildEntry(outDir?: string) {
  debug('loadBuildEntry()')
  if (globalObject.globalContext) {
    return
  }
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
    // If using `inject` then dist/server/index.js imports dist/server/entry.js and loadBuildEntry() isn't needed.
    // If dist/server/entry.js isn't imported then this means the user is running the original server entry `$ ts-node server/index.ts`.
    assertWarning(
      // vike-server => `inject === true`
      // vike-node => `inject === [ 'index' ]` => we don't show the warning to vike-node users (I don't remember why).
      globalObject.buildInfo?.viteConfigRuntime.vitePluginServerEntry.inject !== true || globalObject.isPrerendering,
      `Run the built server entry (e.g. ${pc.cyan('$ node dist/server/index.mjs')}) instead of the original server entry (e.g. ${pc.cyan('$ ts-node server/index.ts')})`,
      { onlyOnce: true }
    )
  }
  const { buildEntry } = globalObject
  assertBuildEntry(buildEntry)
  globalObject.assetsManifest = buildEntry.assetsManifest
  globalObject.buildInfo = buildEntry.buildInfo
  await setGlobalContext(buildEntry.virtualFileExports)
}
async function setGlobalContext_buildEntry(buildEntry: unknown) {
  debug('setGlobalContext_buildEntry()')
  setIsProduction(true)
  assertBuildEntry(buildEntry)
  globalObject.buildEntry = buildEntry
  globalObject.buildEntryPrevious = buildEntry
  assert(globalObject.buildEntry) // ensure no infinite loop
  await loadBuildEntry()
  assertGlobalContextIsDefined()
}

type BuildEntry = {
  virtualFileExports: Record<string, unknown>
  assetsManifest: ViteManifest
  buildInfo: BuildInfo
}
type BuildInfo = {
  versionAtBuildTime: string
  usesClientRouter: boolean // TODO/v1-release: remove
  viteConfigRuntime: ViteConfigRuntime
}
function assertBuildEntry(buildEntry: unknown): asserts buildEntry is BuildEntry {
  assert(isObject(buildEntry))
  assert(hasProp(buildEntry, 'virtualFileExports', 'object'))
  const { virtualFileExports } = buildEntry
  assert(hasProp(buildEntry, 'assetsManifest', 'object'))
  const { assetsManifest } = buildEntry
  assertViteManifest(assetsManifest)
  assert(hasProp(buildEntry, 'buildInfo', 'object'))
  const { buildInfo } = buildEntry
  assertBuildInfo(buildInfo)
  checkType<BuildEntry>({ virtualFileExports, assetsManifest, buildInfo })
}
function assertBuildInfo(buildInfo: unknown): asserts buildInfo is BuildInfo {
  assert(isObject(buildInfo))
  assert(hasProp(buildInfo, 'versionAtBuildTime', 'string'))
  assertVersionAtBuildTime(buildInfo.versionAtBuildTime)
  assert(hasProp(buildInfo, 'viteConfigRuntime', 'object'))
  assert(hasProp(buildInfo.viteConfigRuntime, '_baseViteOriginal', 'string'))
  assert(hasProp(buildInfo.viteConfigRuntime, 'root', 'string'))
  assert(hasProp(buildInfo.viteConfigRuntime, 'build', 'object'))
  assert(hasProp(buildInfo.viteConfigRuntime.build, 'outDir', 'string'))
  assert(hasProp(buildInfo.viteConfigRuntime, 'vitePluginServerEntry', 'object'))
  assert(hasProp(buildInfo, 'usesClientRouter', 'boolean'))
}
function assertVersionAtBuildTime(versionAtBuildTime: string) {
  const versionAtRuntime = PROJECT_VERSION
  const pretty = (version: string) => pc.bold(`vike@${version}`)
  assertUsage(
    versionAtBuildTime === versionAtRuntime,
    `Re-build your app (you're using ${pretty(versionAtRuntime)} but your app was built with ${pretty(versionAtBuildTime)})`
  )
}

async function updateUserFiles() {
  const { promise, resolve } = genPromise<void>()
  assert(!globalObject.isProduction)
  globalObject.waitForUserFilesUpdate = promise

  const { viteDevServer } = globalObject
  assert(viteDevServer)
  let virtualFileExports: Record<string, unknown>
  try {
    virtualFileExports = await viteDevServer.ssrLoadModule(virtualFileIdImportUserCodeServer)
  } catch (err) {
    debugGlob(`Glob error: ${virtualFileIdImportUserCodeServer} transpile error: `, err)
    throw err
  }
  virtualFileExports = (virtualFileExports as any).default || virtualFileExports
  debugGlob('Glob result: ', virtualFileExports)

  // Avoid race condition: abort if there is a new globalObject.viteDevServer (happens when vite.config.js is modified => Vite's dev server is fully reloaded).
  if (viteDevServer !== globalObject.viteDevServer) return

  await setGlobalContext(virtualFileExports)
  resolve()
}

async function setGlobalContext(virtualFileExports: unknown) {
  const pageConfigsRuntime = getPageConfigsRuntime(virtualFileExports)

  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal, globalConfig, pageConfigsUserFriendly } =
    pageConfigsRuntime

  const globalContext = {
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _allPageIds: allPageIds
  }
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds
  )
  objectAssign(globalContext, {
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook,
    pages: pageConfigsUserFriendly,
    config: globalConfig.config
  })
  assertV1Design(
    // pageConfigs is PageConfigRuntime[] but assertV1Design() requires PageConfigBuildTime[]
    pageConfigs.length > 0,
    pageFilesAll
  )

  const globalContextAddendum = (() => {
    const { viteDevServer, viteConfig, viteConfigRuntime, isPrerendering, isProduction } = globalObject
    assert(typeof isProduction === 'boolean')
    if (!isProduction) {
      assert(viteDevServer)
      assert(globalContext) // main common requirement
      assert(viteConfig)
      assert(viteConfigRuntime)
      assert(!isPrerendering)
      return {
        _isProduction: false as const,
        _isPrerendering: false as const,
        assetsManifest: null,
        _viteDevServer: viteDevServer,
        viteConfig,
        ...globalContext,
        viteConfigRuntime,
        ...resolveBaseRuntime(viteConfigRuntime, globalContext.config)
      }
    } else {
      assert(globalObject.buildEntry)
      assert(globalContext) // main common requiement
      const { buildInfo, assetsManifest } = globalObject
      assert(buildInfo)
      assert(assetsManifest)
      const globalContextBase = {
        _isProduction: true as const,
        assetsManifest,
        ...globalContext,
        _viteDevServer: null,
        viteConfigRuntime: buildInfo.viteConfigRuntime,
        _usesClientRouter: buildInfo.usesClientRouter,
        ...resolveBaseRuntime(buildInfo.viteConfigRuntime, globalContext.config)
      }
      if (isPrerendering) {
        assert(viteConfig)
        return {
          ...globalContextBase,
          _isPrerendering: true as const,
          viteConfig
        }
      } else {
        return {
          ...globalContextBase,
          _isPrerendering: false as const,
          viteConfig: null
        }
      }
    }
  })()
  objectAssign(globalContext, globalContextAddendum)

  // Internal usage
  if (!globalObject.globalContext) {
    globalObject.globalContext = globalContext
  } else {
    // Ensure all globalContext user-land references are preserved & updated
    // globalContext_public is just a proxy of globalContext
    objectReplace(globalObject.globalContext, globalContext)
  }

  // Public usage
  globalObject.globalContext_public = makePublic(globalContext)

  assertGlobalContextIsDefined()
  onSetupRuntime()

  // Never actually used, only used for TypeScript `ReturnType<typeof setGlobalContext>`
  return globalContext
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

function resolveBaseRuntime(
  viteConfigRuntime: BuildInfo['viteConfigRuntime'],
  config: PageConfigUserFriendly['config']
) {
  const baseViteOriginal = viteConfigRuntime._baseViteOriginal
  const baseServerUnresolved = config.baseServer ?? null
  const baseAssetsUnresolved = config.baseAssets ?? null
  return resolveBase(baseViteOriginal, baseServerUnresolved, baseAssetsUnresolved)
}
