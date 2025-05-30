export { createGlobalContextShared }
export { getGlobalContextSyncErrMsg }
export type { GlobalContextShared }
export type { GlobalContextSharedPublic }

import { changeEnumerable, objectAssign, unique } from './utils.js'
import type { PageFile } from './getPageFiles.js'
import { parseGlobResults } from './getPageFiles/parseGlobResults.js'
import { getUserFriendlyConfigsGlobal, getUserFriendlyConfigsPageEager } from './page-configs/getUserFriendlyConfigs.js'
import type { PageConfigRuntime } from './page-configs/PageConfig.js'
import { execHookGlobal } from './hooks/execHook.js'
import { prepareGlobalContextForPublicUsage } from './prepareGlobalContextForPublicUsage.js'
const getGlobalContextSyncErrMsg =
  "The global context isn't set yet, call getGlobalContextSync() later or use getGlobalContext() instead."

async function createGlobalContextShared<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  globalObject: { globalContext?: Record<string, unknown> },
  addGlobalContext?: (globalContext: GlobalContextShared) => Promise<GlobalContextAddendum>
) {
  const globalContext = createGlobalContextBase(virtualFileExports)

  const globalContextAddendum = await addGlobalContext?.(globalContext)
  objectAssign(globalContext, globalContextAddendum)

  if (!globalObject.globalContext) {
    globalObject.globalContext = globalContext

    // - We deliberately call onCreateGlobalContext() only at the beginning and only once per process.
    // - TO-DO/eventually: HMR
    //    - Once Photon supports it: `server.hot.send({ type: 'full-server-reload' })`
    //    - Either use:
    //      - import.meta.hot
    //        - https://vite.dev/guide/api-hmr.html
    //        - Use a Vite transformer to inject import.meta.hot code into each user-land `+onCreateGlobalContext.js` file
    //        - Seems more idiomatic
    //      - globalContext._viteDevServer.hot.send()
    //        - Send 'full-server-reload' signal whenever a onCreateGlobalContext() function is modified => we need a globalObject to track all hooks and see if one of them is new/modified.
    //        - Seems less idiomatic
    await execHookGlobal(
      'onCreateGlobalContext',
      globalContext._pageConfigGlobal,
      null,
      globalContext,
      prepareGlobalContextForPublicUsage
    )
  } else {
    // Singleton: ensure all `globalContext` user-land references are preserved & updated.
    // We don't use objectReplace() in order to keep user-land properties.
    objectAssign(globalObject.globalContext, globalContext, true)
  }

  return globalObject.globalContext as typeof globalContext
}

type GlobalContextSharedPublic = Pick<GlobalContextShared, 'config' | 'pages' | 'isGlobalContext'>
type GlobalContextShared = ReturnType<typeof createGlobalContextBase>
function createGlobalContextBase(virtualFileExports: unknown) {
  const {
    pageFilesAll,
    allPageIds,
    pageConfigs,
    pageConfigGlobal,
    userFriendlyConfigsGlobal,
    userFriendlyConfigsPageEager
  } = getConfigsAll(virtualFileExports)
  const globalContext = {
    /**
     * Useful for distinguishing `globalContext` from other objects and narrowing down TypeScript unions.
     *
     * https://vike.dev/globalContext#typescript
     */
    isGlobalContext: true as const,
    _isOriginalObject: true as const,
    _virtualFileExports: virtualFileExports,
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _allPageIds: allPageIds,
    _userFriendlyConfigsGlobal: userFriendlyConfigsGlobal,
    config: userFriendlyConfigsGlobal.config,
    pages: userFriendlyConfigsPageEager
  }
  changeEnumerable(globalContext, '_isOriginalObject', false)
  return globalContext
}

function getConfigsAll(virtualFileExports: unknown) {
  const { pageFilesAll, pageConfigs, pageConfigGlobal } = parseGlobResults(virtualFileExports)
  const allPageIds = getAllPageIds(pageFilesAll, pageConfigs)

  const userFriendlyConfigsGlobal = getUserFriendlyConfigsGlobal({
    pageConfigGlobalValues: pageConfigGlobal.configValues
  })

  const userFriendlyConfigsPageEager = Object.fromEntries(
    pageConfigs.map((pageConfig) => {
      return getUserFriendlyConfigsPageEager(pageConfigGlobal.configValues, pageConfig, pageConfig.configValues)
    })
  )

  return {
    pageFilesAll,
    allPageIds,
    pageConfigs,
    pageConfigGlobal,
    userFriendlyConfigsGlobal,
    userFriendlyConfigsPageEager
  }
}
function getAllPageIds(pageFilesAll: PageFile[], pageConfigs: PageConfigRuntime[]): string[] {
  const fileIds = pageFilesAll.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId)
  const allPageIds = unique(fileIds)
  const allPageIds2 = pageConfigs.map((p) => p.pageId)
  return [...allPageIds, ...allPageIds2]
}
