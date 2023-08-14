export { createPageContext }

import { addUrlComputedProps } from '../../shared/UrlComputedProps.mjs'
import { getPageFilesAll } from '../../shared/getPageFiles.mjs'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.mjs'
import { getBaseServer } from './getBaseServer.mjs'
import { assert, isBaseServer, PromiseType, objectAssign, getGlobalObject } from './utils.mjs'
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
    _urlRewrite: null,
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
  addUrlComputedProps(pageContext)
  return pageContext
}
