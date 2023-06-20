export { createPageContext }

import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { getPageFilesAll } from '../../shared/getPageFiles'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes'
import { getBaseServer } from '../getBaseServer'
import { assert, isBaseServer, PromiseType, objectAssign, getGlobalObject } from './utils'
const globalObject = getGlobalObject<{
  pageFilesData?: PromiseType<ReturnType<typeof getPageFilesAll>>
}>('createPageContext.ts', {})

async function createPageContext<T extends { urlOriginal: string }>(pageContextBase?: T) {
  if (!globalObject.pageFilesData) {
    globalObject.pageFilesData = await getPageFilesAll(true)
  }
  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = globalObject.pageFilesData
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds
  )
  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))
  const pageContext = {
    _objectCreatedByVitePluginSsr: true,
    _urlHandler: null,
    _baseServer: baseServer,
    _isProduction: import.meta.env.PROD,
    // TODO: use GlobalContext instead
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _allPageIds: allPageIds,
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook
  }
  objectAssign(pageContext, pageContextBase)
  addComputedUrlProps(pageContext)
  return pageContext
}
