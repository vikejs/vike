export { createPageContext }

import { getPageContextUrlComputed } from '../../shared/getPageContextUrlComputed'
import { getPageFilesAll } from '../../shared/getPageFiles'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes'
import { getBaseServer } from './getBaseServer'
import { assert, isBaseServer, PromiseType, getGlobalObject, objectAssign } from './utils'
const globalObject = getGlobalObject<{
  pageFilesData?: PromiseType<ReturnType<typeof getPageFilesAll>>
}>('createPageContext.ts', {})

async function createPageContext(urlOriginal: string) {
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
    urlOriginal,
    _objectCreatedByVike: true,
    _urlHandler: null,
    _urlRewrite: null,
    _baseServer: baseServer,
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _allPageIds: allPageIds,
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook,
    _isPageContextObject: true
  }
  const pageContextUrlComputed = getPageContextUrlComputed(pageContext)
  objectAssign(pageContext, pageContextUrlComputed)
  return pageContext
}
