// Public use
export { getGlobalContextSync }
export { getGlobalContextAsync }

// Internal use
export { getGlobalContext }
export { getViteDevServer }
export { getViteConfig }
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
export { assertBuildInfo }
export { getViteConfigRuntime }
export { updateVirtualFile }
export type { BuildInfo }

import {
  assert,
  onSetupRuntime,
  assertUsage,
  assertWarning,
  isPlainObject,
  objectAssign,
  objectReplace,
  isObject,
  hasProp,
  debugGlob,
  getGlobalObject,
  genPromise,
  createDebugger,
  makePublicCopy,
  projectInfo,
  checkType,
  objectAssignSafe
} from './utils.js'
import type { ViteManifest } from '../shared/ViteManifest.js'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import { importServerProductionEntry } from '@brillout/vite-plugin-server-entry/runtime'
import { virtualFileIdImportUserCodeServer } from '../shared/virtual-files/virtualFileImportUserCode.js'
import pc from '@brillout/picocolors'
import type { VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import type { ConfigUserFriendly } from '../../shared/page-configs/getPageConfigUserFriendly.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import { assertV1Design } from '../shared/assertV1Design.js'
import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
type PageConfigsRuntime = ReturnType<typeof getPageConfigsRuntime>
const debug = createDebugger('vike:globalContext')
const globalObject = getGlobalObject<
  {
    globalContext?: GlobalContext
    viteDevServer?: ViteDevServer
    isViteDev?: boolean
    viteConfig?: ResolvedConfig
    // TODO/now remove
    vikeConfig?: VikeConfigObject
    outDirRoot?: string
    isPrerendering?: true
    initGlobalContext_runPrerender_alreadyCalled?: true
    buildEntry?: unknown
    buildEntryPrevious?: unknown
    pageConfigsRuntime?: PageConfigsRuntime
    pageConfigsRuntimePromise?: Promise<void>
  } & ReturnType<typeof getInitialGlobalContext>
>('globalContext.ts', getInitialGlobalContext())

type GlobalContextPublic = Pick<GlobalContext, 'assetsManifest' | 'config' | 'viteConfig'>
type PageRuntimeInfo = Awaited<ReturnType<typeof getUserFiles>>
type GlobalContext = {
  viteConfigRuntime: {
    _baseViteOriginal: null | string
  }
  // global config
  config: ConfigUserFriendly['config']
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

async function getGlobalContext(): Promise<GlobalContext> {
  if (!globalObject.globalContext) {
    debug('getGlobalContext()', new Error().stack)
    assert(false)
  }
  await globalObject.pageConfigsRuntimePromise
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
  const globalContext = await getGlobalContext()
  assert(globalContext)
  return makePublic(globalContext)
}
function makePublic(globalContext: GlobalContext): GlobalContextPublic {
  const globalContextPublic = makePublicCopy(globalContext, 'globalContext', ['assetsManifest', 'config', 'viteConfig'])
  return globalContextPublic
}

function setGlobalContext_viteDevServer(viteDevServer: ViteDevServer) {
  if (globalObject.viteDevServer) return
  assertIsNotInitilizedYet()
  assert(globalObject.viteConfig)
  globalObject.viteDevServer = viteDevServer
  globalObject.viteDevServerPromiseResolve(viteDevServer)
  // Call it as early as possible here for better performance.
  updateVirtualFile()
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

// TODO/now: call initGlobalContext() sooner?
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
    const userFiles = await getUserFiles()
    const viteConfigRuntime = getViteConfigRuntime(viteConfig)
    globalObject.globalContext = {
      isProduction: false,
      isPrerendering: false,
      assetsManifest: null,
      viteDevServer,
      viteConfig,
      ...userFiles,
      viteConfigRuntime
    }
  } else {
    const buildEntry = await getBuildEntry(globalObject.outDirRoot, isPrerendering)
    const { assetsManifest, buildInfo } = buildEntry
    await updateVirtualFileExports(buildEntry.virtualFileExports)
    const userFiles = await getUserFiles()
    const globalContext = {
      isProduction: true as const,
      assetsManifest,
      ...userFiles,
      viteDevServer: null,
      viteConfigRuntime: buildInfo.viteConfigRuntime,
      usesClientRouter: buildInfo.usesClientRouter
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

async function getUserFiles() {
  // Help TypeScript resolve what TypeScript (wrongfully) believes to be cyclic dependency
  const globalObject_ = globalObject as { pageConfigsRuntime?: PageConfigsRuntime }
  const { pageConfigsRuntime } = globalObject_
  assert(pageConfigsRuntime)
  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal, globalConfig } = pageConfigsRuntime

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
    onBeforeRouteHook,
    config: globalConfig.config
  }
  assertV1Design(
    // pageConfigs is PageConfigRuntime[] but assertV1Design() requires PageConfigBuildTime[]
    pageConfigs.length > 0,
    pageFilesAll
  )
  return userFiles
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

async function getBuildEntry(outDir?: string, isPrerendering?: true) {
  debug('getBuildEntry()')
  if (!globalObject.buildEntry) {
    debug('importServerProductionEntry()')
    // importServerProductionEntry() loads dist/server/entry.mjs which calls setGlobalContext_buildEntry()
    await importServerProductionEntry({ outDir, doNotLoadServer: isPrerendering })
    if (!globalObject.buildEntry) {
      debug('globalObject.buildEntryPrevious')
      // Needed, for example, when calling the API prerender() then preview() because both trigger a importServerProductionEntry() call but only the first only is applied because of the import() cache. (A proper implementation would be to clear the import() cache, but it probably isn't possible on platforms such as Cloudflare Workers.)
      globalObject.buildEntry = globalObject.buildEntryPrevious
    }
    assert(globalObject.buildEntry)
  }
  const { buildEntry } = globalObject
  assertBuildEntry(buildEntry)
  return buildEntry
}
function setGlobalContext_buildEntry(buildEntry: unknown) {
  debug('setGlobalContext_buildEntry()')
  assertBuildEntry(buildEntry)
  globalObject.buildEntry = buildEntry
  globalObject.buildEntryPrevious = buildEntry
}

type BuildEntry = {
  virtualFileExports: Record<string, unknown>
  assetsManifest: ViteManifest
  buildInfo: BuildInfo
}
type BuildInfo = {
  versionAtBuildTime: string
  usesClientRouter: boolean // TODO/v1-release: remove
  viteConfigRuntime: {
    _baseViteOriginal: string
  }
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
  assert(hasProp(buildInfo, 'usesClientRouter', 'boolean'))
  checkType<BuildInfo>({ ...buildInfo, viteConfigRuntime: buildInfo.viteConfigRuntime })
}
function assertVersionAtBuildTime(versionAtBuildTime: string) {
  const versionAtRuntime = projectInfo.projectVersion
  const pretty = (version: string) => pc.bold(`vike@${version}`)
  assertUsage(
    versionAtBuildTime === versionAtRuntime,
    `Re-build your app (you're using ${pretty(versionAtRuntime)} but your app was built with ${pretty(versionAtBuildTime)})`
  )
}
function getViteConfigRuntime(viteConfig: ResolvedConfig): BuildInfo['viteConfigRuntime'] {
  assert(hasProp(viteConfig, '_baseViteOriginal', 'string'))
  const viteConfigRuntime = {
    _baseViteOriginal: viteConfig._baseViteOriginal
  }
  return viteConfigRuntime
}

async function updateVirtualFile() {
  const { promise, resolve } = genPromise<void>()
  globalObject.pageConfigsRuntimePromise = promise

  const viteDevServer = getViteDevServer()
  assert(viteDevServer)
  // TODO/now: rename
  let moduleExports: Record<string, unknown>
  try {
    moduleExports = await viteDevServer.ssrLoadModule(virtualFileIdImportUserCodeServer)
  } catch (err) {
    debugGlob(`Glob error: ${virtualFileIdImportUserCodeServer} transpile error: `, err)
    throw err
  }
  moduleExports = (moduleExports as any).default || moduleExports
  debugGlob('Glob result: ', moduleExports)

  await updateVirtualFileExports(moduleExports)
  resolve()
}

async function updateVirtualFileExports(virtualFileExports: unknown) {
  globalObject.pageConfigsRuntime = getPageConfigsRuntime(virtualFileExports)
  const userFiles = await getUserFiles()
  // TODO/now: is there a more elegant way?
  if (globalObject.globalContext) {
    objectAssignSafe(globalObject.globalContext, userFiles)
  }
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
