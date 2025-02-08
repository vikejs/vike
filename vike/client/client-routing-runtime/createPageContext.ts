export { createPageContext }

import { getPageContextUrlComputed } from '../../shared/getPageContextUrlComputed.js'
import { getPageFilesAll, setPageFiles } from '../../shared/getPageFiles/getPageFiles.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import { getBaseServer } from './getBaseServer.js'
import { assert, isBaseServer, PromiseType, getGlobalObject, objectAssign } from './utils.js'

// @ts-ignore
import * as pageFilesExports from 'virtual:vike:importUserCode:client:client-routing'
setPageFiles(pageFilesExports)

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
