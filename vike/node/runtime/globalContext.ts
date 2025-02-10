// Public use
export { getGlobalContextSync }
export { getGlobalContextAsync }

// Internal use
export { getGlobalContext }
export { getViteDevServer }
export { getViteConfig }
export { initGlobalContext_renderPage }
export { initGlobalContext_runPrerender }
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
  checkType
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
import type { ConfigVitePluginServerEntry } from '@brillout/vite-plugin-server-entry/plugin'
type PageConfigsRuntime = ReturnType<typeof getPageConfigsRuntime>
const debug = createDebugger('vike:globalContext')
const globalObject = getGlobalObject<
  {
    globalContext?: GlobalContext
    globalContext_public?: GlobalContextPublic
    viteDevServer?: ViteDevServer
    isViteDev?: boolean
    viteConfig?: ResolvedConfig
    // TODO/soon remove
    vikeConfig?: VikeConfigObject
    outDirRoot?: string
    isPrerendering?: true
    initGlobalContext_runPrerender_alreadyCalled?: true
    buildEntry?: unknown
    buildEntryPrevious?: unknown
    pageConfigsRuntime?: PageConfigsRuntime
    waitForUserFilesUpdate?: Promise<void>
    isProduction?: boolean
    userFiles?: UserFiles
    buildInfo?: BuildInfo
    // Move to buildInfo.assetsManifest ?
    assetsManifest?: ViteManifest
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
  assertGlobalContextIsDefined()
  await globalObject.waitForUserFilesUpdate
  const { globalContext } = globalObject
  assertIsDefined(globalContext)
  return globalContext
}
function assertIsDefined(globalContext: undefined | null | GlobalContext): asserts globalContext is GlobalContext {
  if (!globalContext) {
    debug('globalContext', globalContext)
    debug('getGlobalContext()', new Error().stack)
    assert(false)
  }
}
function assertGlobalContextIsDefined() {
  assertIsDefined(globalObject.globalContext)
  assert(globalObject.globalContext_public)
}

/** @experimental https://vike.dev/getGlobalContext */
function getGlobalContextSync(): GlobalContextPublic {
  const { globalContext_public } = globalObject
  assertUsage(
    globalContext_public,
    "The global context isn't set yet, call getGlobalContextSync() later or use getGlobalContextAsync() instead."
  )
  return globalContext_public
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
  assertGlobalContextIsDefined()
  await globalObject.waitForUserFilesUpdate
  assertGlobalContextIsDefined()
  const { globalContext_public } = globalObject
  assert(globalContext_public)
  return globalContext_public
}

function makePublic(globalContext: GlobalContext): GlobalContextPublic {
  // TODO/soon: add `pages`
  const globalContextPublic = makePublicCopy(globalContext, 'globalContext', ['assetsManifest', 'config', 'viteConfig'])
  return globalContextPublic
}

async function setGlobalContext_viteDevServer(viteDevServer: ViteDevServer) {
  debug('setGlobalContext_viteDevServer()')
  setIsProduction(false)
  if (globalObject.viteDevServer) return
  assertIsNotInitilizedYet()
  assert(globalObject.viteConfig)
  globalObject.viteDevServer = viteDevServer
  await updateVirtualFile()
  assertGlobalContextIsDefined()
  globalObject.viteDevServerPromiseResolve(viteDevServer)
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
  assert(globalObject.isPrerendering === true)
  if (globalObject.initGlobalContext_runPrerender_alreadyCalled) return
  globalObject.initGlobalContext_runPrerender_alreadyCalled = true

  assert(globalObject.isPrerendering)
  assert(globalObject.viteConfig)
  assert(globalObject.outDirRoot)

  // We assume initGlobalContext_runPrerender() to be called before:
  // - initGlobalContext_renderPage()
  // - initGlobalContext_getGlobalContextAsync()
  assertIsNotInitilizedYet()

  await initGlobalContext(true)
}

async function initGlobalContext_getGlobalContextAsync(isProduction: boolean): Promise<void> {
  debug('initGlobalContext_getGlobalContextAsync()')
  await initGlobalContext(isProduction)
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

async function initGlobalContext(isProduction: boolean): Promise<void> {
  setIsProduction(isProduction)
  if (!isProduction) {
    await waitForViteDevServer()
  } else {
    await loadBuildEntry(globalObject.outDirRoot)
  }
  assertGlobalContextIsDefined()
  /* TODO/now
  onSetupRuntime()
  */
}
function setIsProduction(isProduction: boolean) {
  assert(typeof isProduction === 'boolean')
  // TODO/now use onSetupRuntime()
  if (globalObject.isProduction !== undefined) assert(globalObject.isProduction === isProduction)
  globalObject.isProduction = isProduction
}
function defineGlobalContext() {
  const globalContext = assembleGlobalContext()
  assertIsDefined(globalContext)
  globalObject.globalContext = globalContext
  globalObject.globalContext_public = makePublic(globalContext)
  assertGlobalContextIsDefined()
}
function assembleGlobalContext(): GlobalContext | null {
  const { viteDevServer, viteConfig, vikeConfig, isPrerendering, isProduction, userFiles } = globalObject
  assert(typeof isProduction === 'boolean')
  let globalContext: GlobalContext
  if (!isProduction) {
    // Requires globalObject.viteDevServer
    if (!viteDevServer) return null
    assert(viteConfig)
    assert(vikeConfig)
    assert(!isPrerendering)
    assert(userFiles)
    const viteConfigRuntime = getViteConfigRuntime(viteConfig)
    globalContext = {
      isProduction: false,
      isPrerendering: false,
      assetsManifest: null,
      viteDevServer,
      viteConfig,
      ...userFiles,
      viteConfigRuntime
    }
  } else {
    // Requires globalObject.buildEntry
    if (!globalObject.buildEntry) return null
    assert(userFiles)
    const { buildInfo, assetsManifest } = globalObject
    assert(buildInfo)
    assert(assetsManifest)
    const globalContext_ = {
      isProduction: true as const,
      assetsManifest,
      ...userFiles,
      viteDevServer: null,
      viteConfigRuntime: buildInfo.viteConfigRuntime,
      usesClientRouter: buildInfo.usesClientRouter
    }
    if (isPrerendering) {
      assert(viteConfig)
      objectAssign(globalContext_, {
        isPrerendering: true as const,
        viteConfig
      })
      globalContext = globalContext_
    } else {
      objectAssign(globalContext_, {
        isPrerendering: false as const,
        viteConfig: null
      })
      globalContext = globalContext_
    }
  }
  return globalContext
}

type UserFiles = Awaited<ReturnType<typeof getUserFiles>>
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

async function loadBuildEntry(outDir?: string) {
  debug('loadBuildEntry()')
  if (globalObject.userFiles) {
    assert(globalObject.buildInfo)
    assert(globalObject.assetsManifest)
    assert(globalObject.buildEntry)
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
    assertWarning(
      !globalObject.buildInfo?.viteConfigRuntime.vitePluginServerEntry.inject,
      // TODO/soon: show precise path
      // TODO/soon: make this warning work on test/vike-node/
      `Run the server production build (e.g. ${pc.cyan('$ node dist/server/index.mjs')}) instead of running the original server entry (e.g. ${pc.cyan('$ ts-node server/index.ts')})`,
      { onlyOnce: true }
    )
  }
  const { buildEntry } = globalObject
  assertBuildEntry(buildEntry)
  globalObject.assetsManifest = buildEntry.assetsManifest
  globalObject.buildInfo = buildEntry.buildInfo
  await setUserFiles(buildEntry.virtualFileExports)
}
async function setGlobalContext_buildEntry(buildEntry: unknown) {
  debug('setGlobalContext_buildEntry()')
  setIsProduction(true)
  assertBuildEntry(buildEntry)
  globalObject.buildEntry = buildEntry
  globalObject.buildEntryPrevious = buildEntry
  assert(globalObject.buildEntry) // ensure no infinite loop
  await loadBuildEntry()
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
    vitePluginServerEntry: {
      inject?: NonNullable<ConfigVitePluginServerEntry['vitePluginServerEntry']>['inject']
    }
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
  assert(hasProp(buildInfo.viteConfigRuntime, 'vitePluginServerEntry', 'object'))
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
function getViteConfigRuntime(
  viteConfig: ResolvedConfig & ConfigVitePluginServerEntry
): BuildInfo['viteConfigRuntime'] {
  assert(hasProp(viteConfig, '_baseViteOriginal', 'string'))
  const viteConfigRuntime = {
    _baseViteOriginal: viteConfig._baseViteOriginal,
    vitePluginServerEntry: {
      inject: viteConfig.vitePluginServerEntry?.inject
    }
  }
  return viteConfigRuntime
}

async function updateVirtualFile() {
  const { promise, resolve } = genPromise<void>()
  globalObject.waitForUserFilesUpdate = promise

  const viteDevServer = getViteDevServer()
  assert(viteDevServer)
  // TODO/soon: rename
  let moduleExports: Record<string, unknown>
  try {
    moduleExports = await viteDevServer.ssrLoadModule(virtualFileIdImportUserCodeServer)
  } catch (err) {
    debugGlob(`Glob error: ${virtualFileIdImportUserCodeServer} transpile error: `, err)
    throw err
  }
  moduleExports = (moduleExports as any).default || moduleExports
  debugGlob('Glob result: ', moduleExports)

  await setUserFiles(moduleExports)
  resolve()
}

async function setUserFiles(virtualFileExports: unknown) {
  globalObject.pageConfigsRuntime = getPageConfigsRuntime(virtualFileExports)
  const userFiles = await getUserFiles()
  globalObject.userFiles = userFiles
  defineGlobalContext()
  assertGlobalContextIsDefined()
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
