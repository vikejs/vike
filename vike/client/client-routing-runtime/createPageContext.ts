export { createPageContext }

import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
import { getPageContextUrlComputed } from '../../shared/getPageContextUrlComputed.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import { getBaseServer } from './getBaseServer.js'
import { assert, isBaseServer, objectAssign } from './utils.js'

// TODO/now: can we avoid optimizeDeps.exclude of client runtime?
// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:client-routing'
const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = getPageConfigsRuntime(virtualFileExports)

async function createPageContext(urlOriginal: string) {
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
