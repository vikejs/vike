export { createGlobalContextShared }
export { getGlobalContextSyncErrMsg }
export type { GlobalContextBase }
export type { GlobalContextBasePublic }
export type GlobalContextInternal = GlobalContextServerInternal | GlobalContextClientInternal

import { changeEnumerable, objectAssign, objectReplace, unique } from './utils.js'
import type { PageFile } from './getPageFiles.js'
import { parseVirtualFileExports } from './getPageFiles/parseVirtualFileExports.js'
import {
  resolveVikeConfigPublicGlobal,
  resolveVikeConfigPublicPageEager,
} from './page-configs/resolveVikeConfigPublic.js'
import type { PageConfigRuntime } from '../types/PageConfig.js'
import { execHookGlobal } from './hooks/execHook.js'
import { prepareGlobalContextForPublicUsage } from './prepareGlobalContextForPublicUsage.js'
import type { GlobalContextServerInternal } from '../node/runtime/globalContext.js'
import type { GlobalContextClientInternal } from '../client/runtime-client-routing/globalContext.js'
import { getHookFromPageConfigGlobalCumulative, type Hook } from './hooks/getHook.js'
const getGlobalContextSyncErrMsg =
  "The global context isn't set yet, call getGlobalContextSync() later or use getGlobalContext() instead."

async function createGlobalContextShared<GlobalContextAddendum extends Record<string, any>>(
  virtualFileExports: unknown,
  globalObject: { globalContext?: Record<string, unknown>; onCreateGlobalContextHooks?: Hook[] },
  addGlobalContextAsync?: (globalContext: GlobalContextBase) => Promise<GlobalContextAddendum>,
) {
  const globalContext = createGlobalContextBase(virtualFileExports)

  const globalContextAddendum = await addGlobalContextAsync?.(globalContext)
  objectAssign(globalContext, globalContextAddendum)

  const onCreateGlobalContextHooks = getHookFromPageConfigGlobalCumulative(
    globalContext._pageConfigGlobal,
    'onCreateGlobalContext',
  )
  let hooksCalled = false
  if (!hooksAreEqual(globalObject.onCreateGlobalContextHooks ?? [], onCreateGlobalContextHooks)) {
    globalObject.onCreateGlobalContextHooks = onCreateGlobalContextHooks
    await execHookGlobal(
      'onCreateGlobalContext',
      globalContext._pageConfigGlobal,
      null,
      globalContext,
      prepareGlobalContextForPublicUsage,
    )
    hooksCalled = true
  }

  if (!globalObject.globalContext) {
    globalObject.globalContext = globalContext
  } else {
    // Singleton: ensure all `globalContext` user-land references are preserved & updated.
    if (hooksCalled) {
      objectReplace(globalObject.globalContext, globalContext)
    } else {
      // We don't use objectReplace() in order to keep user-land properties.
      objectAssign(globalObject.globalContext, globalContext, true)
    }
  }

  return globalObject.globalContext as typeof globalContext
}

type GlobalContextBasePublic = Pick<GlobalContextBase, 'config' | 'pages' | 'isGlobalContext'>
type GlobalContextBase = ReturnType<typeof createGlobalContextBase>
function createGlobalContextBase(virtualFileExports: unknown) {
  const {
    pageFilesAll,
    allPageIds,
    pageConfigs,
    pageConfigGlobal,
    vikeConfigPublicGlobal,
    vikeConfigPublicPagesEager,
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
    _vikeConfigPublicGlobal: vikeConfigPublicGlobal,
    config: vikeConfigPublicGlobal.config,
    pages: vikeConfigPublicPagesEager,
  }
  changeEnumerable(globalContext, '_isOriginalObject', false)
  return globalContext
}

function getConfigsAll(virtualFileExports: unknown) {
  const { pageFilesAll, pageConfigs, pageConfigGlobal } = parseVirtualFileExports(virtualFileExports)
  const allPageIds = getAllPageIds(pageFilesAll, pageConfigs)

  const vikeConfigPublicGlobal = resolveVikeConfigPublicGlobal({
    pageConfigGlobalValues: pageConfigGlobal.configValues,
  })

  const vikeConfigPublicPagesEager = Object.fromEntries(
    pageConfigs.map((pageConfig) => {
      return resolveVikeConfigPublicPageEager(pageConfigGlobal.configValues, pageConfig, pageConfig.configValues)
    }),
  )

  return {
    pageFilesAll,
    allPageIds,
    pageConfigs,
    pageConfigGlobal,
    vikeConfigPublicGlobal,
    vikeConfigPublicPagesEager,
  }
}
function getAllPageIds(pageFilesAll: PageFile[], pageConfigs: PageConfigRuntime[]): string[] {
  const fileIds = pageFilesAll.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId)
  const allPageIds = unique(fileIds)
  const allPageIds2 = pageConfigs.map((p) => p.pageId)
  return [...allPageIds, ...allPageIds2]
}

function hooksAreEqual(hooks1: Hook[], hooks2: Hook[]): boolean {
  const hooksFn1 = hooks1.map((hook) => hook.hookFn)
  const hooksFn2 = hooks2.map((hook) => hook.hookFn)
  return (
    hooksFn1.every((hook) => hooksFn2.includes(hook)) &&
    //
    hooksFn2.every((hook) => hooksFn1.includes(hook))
  )
}
