export { createPageContext }

import { getPageContextUrlComputed } from '../../shared/getPageContextUrlComputed.js'
import { getPageFilesAll } from '../../shared/getPageFiles.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import { getBaseServer } from './getBaseServer.js'
import { assert, isBaseServer, PromiseType, getGlobalObject, objectAssign, isObject } from './utils.js'
const globalObject = getGlobalObject<{
  onBootResult?: Record<string, unknown>,
  pageFilesData?: PromiseType<ReturnType<typeof getPageFilesAll>>
}>('createPageContext.ts', {})

async function createPageContext(urlOriginal: string) {
  if (!globalObject.pageFilesData) {
    globalObject.pageFilesData = await getPageFilesAll(true)
  }
  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = globalObject.pageFilesData
  const { pageRoutes, onBeforeRouteHook, onBootHook } = await loadPageRoutes(
    pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds
  )
  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))

  let pageContext = {
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

  if (!globalObject.onBootResult && onBootHook) {
    globalObject.onBootResult = await onBootHook.hookFn(pageContext) as Record<string, unknown>
  }

  if (isObject(globalObject.onBootResult)) {
    pageContext = {
      ...pageContext,
      ...globalObject.onBootResult
    }
  }

  const pageContextUrlComputed = getPageContextUrlComputed(pageContext)
  objectAssign(pageContext, pageContextUrlComputed)
  return pageContext
}
