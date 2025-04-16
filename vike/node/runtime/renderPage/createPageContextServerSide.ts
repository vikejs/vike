export { createPageContextServerSide }
export { createPageContextServerSideWithoutGlobalContext }
export type { PageContextCreatedServerSide }

import { assert, assertUsage, assertWarning, augmentType, normalizeHeaders, objectAssign } from '../utils.js'
import { getPageContextUrlComputed } from '../../../shared/getPageContextUrlComputed.js'
import type { GlobalContextInternal } from '../globalContext.js'
import type { PageContextInit } from '../renderPage.js'
import { createPageContextShared } from '../../../shared/createPageContextShared.js'

type PageContextCreatedServerSide = Awaited<ReturnType<typeof createPageContextServerSide>>
async function createPageContextServerSide(
  pageContextInit: PageContextInit,
  globalContext: GlobalContextInternal,
  {
    isPrerendering,
    ssr: { urlHandler, isClientSideNavigation } = {
      urlHandler: null,
      isClientSideNavigation: false
    }
  }:
    | {
        isPrerendering: false
        ssr: {
          urlHandler: null | ((url: string) => string)
          isClientSideNavigation: boolean
        }
      }
    | {
        isPrerendering: true
        ssr?: undefined
      }
) {
  assert(pageContextInit.urlOriginal)

  const pageContextCreated = createPageContext(pageContextInit, isPrerendering)

  objectAssign(pageContextCreated, pageContextInit)

  objectAssign(pageContextCreated, {
    // The following is defined on `pageContext` because we can eventually make these non-global
    _baseServer: globalContext.baseServer,
    _baseAssets: globalContext.baseAssets,
    // TODO/now: add meta.default
    _includeAssetsImportedByServer: globalContext.config.includeAssetsImportedByServer ?? true,
    // TODO/soon: use GloablContext instead
    _pageFilesAll: globalContext.pageFilesAll,
    _pageConfigs: globalContext.pageConfigs,
    _pageConfigGlobal: globalContext.pageConfigGlobal,
    _allPageIds: globalContext.allPageIds,
    _pageRoutes: globalContext.pageRoutes,
    _onBeforeRouteHook: globalContext.onBeforeRouteHook,
    _globalContext: globalContext,
    // TODO/now: add PageContext['globalContext']
    /** @experimental This is a beta feature https://vike.dev/getGlobalContext */
    globalContext: globalContext.globalContext_public,
    _pageContextInit: pageContextInit,
    _urlRewrite: null,
    _urlHandler: urlHandler,
    isClientSideNavigation
  })

  // pageContext.urlParsed
  const pageContextUrlComputed = getPageContextUrlComputed(pageContextCreated)
  objectAssign(pageContextCreated, pageContextUrlComputed)

  // pageContext.headers
  {
    let headers: null | Record<string, string>
    if (pageContextInit.headersOriginal) {
      headers = normalizeHeaders(pageContextInit.headersOriginal)
      assertUsage(
        !('headers' in pageContextInit),
        "You're defining pageContextInit.headersOriginal as well as pageContextInit.headers but you should only define pageContextInit.headersOriginal instead, see https://vike.dev/headers"
      )
    } else if (pageContextInit.headers) {
      headers = pageContextInit.headers as Record<string, string>
      // TODO/next-major-release: remove
      assertWarning(
        false,
        'Setting pageContextInit.headers is deprecated: set pageContextInit.headersOriginal instead, see https://vike.dev/headers',
        { onlyOnce: true }
      )
    } else {
      headers = null
    }
    objectAssign(pageContextCreated, { headers })
  }

  const pageContextAugmented = await createPageContextShared(pageContextCreated, globalContext.pageConfigGlobal)
  augmentType(pageContextCreated, pageContextAugmented)

  return pageContextCreated
}
function createPageContextServerSideWithoutGlobalContext(pageContextInit: PageContextInit) {
  const pageContext = createPageContext(pageContextInit, false)
  return pageContext
}
function createPageContext(pageContextInit: PageContextInit | null, isPrerendering: boolean) {
  const pageContext = {
    isClientSide: false,
    isPrerendering
  }
  objectAssign(pageContext, pageContextInit)
  return pageContext
}
