export { getGlobalContext }
export type { GlobalContextClientSidePublic }

import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import { getGlobalObject, objectReplace } from './utils.js'

// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:client-routing'
const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = getPageConfigsRuntime(virtualFileExports)

type GlobalContextClientSidePublic = {
  // Nothing public for now
}
type GlobalContextClientSide = Awaited<ReturnType<typeof createGlobalContext>>

const globalObject = getGlobalObject<{
  globalContext?: GlobalContextClientSide
}>('client-routing-runtime/globalContextClientSide.ts', {})

async function getGlobalContext(): Promise<GlobalContextClientSide> {
  if (
    !globalObject.globalContext ||
    // Don't break HMR
    globalObject.globalContext._virtualFileExports !== virtualFileExports
  ) {
    const globalContextCreated = await createGlobalContext()
    if (!globalObject.globalContext) {
      globalObject.globalContext = globalContextCreated
    } else {
      objectReplace(globalObject.globalContext, globalContextCreated)
    }
  }
  return globalObject.globalContext
}

async function createGlobalContext() {
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds
  )
  const globalContext = {
    _virtualFileExports: virtualFileExports,
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook,
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _allPageIds: allPageIds
  }
  return globalContext
}
