export { createPageContext }

import { addUrlComputedProps } from '../../shared/UrlComputedProps.js'
import { getPageFilesAll } from '../../shared/getPageFiles.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import { getBaseServer } from './getBaseServer.js'
import { assert, isBaseServer, PromiseType, objectAssign, getGlobalObject } from './utils.js'
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
  // @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
  const isProd: boolean = import.meta.env.PROD
  const pageContext = {
    _objectCreatedByVitePluginSsr: true,
    _urlHandler: null,
    _urlRewrite: null,
    _baseServer: baseServer,
    _isProduction: isProd,
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
