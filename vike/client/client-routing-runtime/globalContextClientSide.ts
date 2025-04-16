export { getGlobalContext }
export type { GlobalContextClientSidePublic }

import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:client-routing'

type GlobalContextClientSidePublic = {
  // Nothing public for now
}
type GlobalContextClientSide = Awaited<ReturnType<typeof getGlobalContext>>

// TODO: eager call

const getGlobalContext = createGetGlobalContext(virtualFileExports, async (globalContext) => {
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    globalContext._pageFilesAll,
    globalContext._pageConfigs,
    globalContext._pageConfigGlobal,
    globalContext._allPageIds
  )
  return {
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook
  }
})

import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
import { getGlobalObject, objectAssign, objectReplace } from './utils.js'

const globalObject = getGlobalObject<{
  globalContext?: Record<string, unknown>
}>('client-routing-runtime/globalContextClientSide.ts', {})

function createGetGlobalContext<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  addGlobalContext?: (globalContext: ReturnType<typeof createGlobalContext>) => Promise<GlobalContextAddendum>
) {
  return async () => {
    // Cache
    if (
      globalObject.globalContext &&
      // Don't break HMR
      globalObject.globalContext._virtualFileExports !== virtualFileExports
    ) {
      return globalObject.globalContext as never
    }

    // Create
    const globalContext = createGlobalContext(virtualFileExports)
    const globalContextAddendum = await addGlobalContext?.(globalContext)
    objectAssign(globalContext, globalContextAddendum)

    // Singleton
    if (!globalObject.globalContext) {
      globalObject.globalContext = globalContext
    } else {
      // Ensure all `globalContext` references are preserved & updated
      objectReplace(globalObject.globalContext, globalContext)
    }

    // Return
    return globalContext
  }
}

function createGlobalContext(virtualFileExports: unknown) {
  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = getPageConfigsRuntime(virtualFileExports)
  const globalContext = {
    _virtualFileExports: virtualFileExports,
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _allPageIds: allPageIds
  }
  return globalContext
}
