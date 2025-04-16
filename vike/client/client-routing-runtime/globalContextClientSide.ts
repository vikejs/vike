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

const getGlobalContext = await createGetGlobalContext(virtualFileExports, async () => {
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds
  )
  return {
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook
  }
})

import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
import { getGlobalObject, objectAssign, objectReplace } from './utils.js'

const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = getPageConfigsRuntime(virtualFileExports)

const globalObject = getGlobalObject<{
  globalContext?: Record<string, unknown>
}>('client-routing-runtime/globalContextClientSide.ts', {})

async function createGetGlobalContext<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  addGlobalContext?: () => Promise<GlobalContextAddendum>
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
    const globalContext = {
      _virtualFileExports: virtualFileExports,
      _pageFilesAll: pageFilesAll,
      _pageConfigs: pageConfigs,
      _pageConfigGlobal: pageConfigGlobal,
      _allPageIds: allPageIds
    }
    const globalContextAddendum = await addGlobalContext?.()
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
