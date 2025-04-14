export { renderPageAlreadyRouted }
export { prerenderPage }
export { createPageContextServerSide }
export { createPageContextWithoutGlobalContext }
export type { PageContextAfterRender }

import { getErrorPageId } from '../../../shared/error-page.js'
import { getHtmlString } from '../html/renderHtml.js'
import { assert, assertUsage, assertWarning, hasProp, normalizeHeaders, objectAssign } from '../utils.js'
import { serializePageContextClientSide } from '../html/serializePageContextClientSide.js'
import { getPageContextUrlComputed, type PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { GlobalContextInternal } from '../globalContext.js'
import { createHttpResponsePage, createHttpResponsePageContextJson, HttpResponse } from './createHttpResponse.js'
import {
  loadUserFilesServerSide,
  PageContext_loadUserFilesServerSide,
  type PageFiles
} from './loadUserFilesServerSide.js'
import { executeOnRenderHtmlHook } from './executeOnRenderHtmlHook.js'
import { executeOnBeforeRenderAndDataHooks } from './executeOnBeforeRenderAndDataHooks.js'
import { logRuntimeError } from './loggerRuntime.js'
import { isNewError } from './isNewError.js'
import { preparePageContextForUserConsumptionServerSide } from './preparePageContextForUserConsumptionServerSide.js'
import { executeGuardHook } from '../../../shared/route/executeGuardHook.js'
import pc from '@brillout/picocolors'
import { isServerSideError } from '../../../shared/misc/isServerSideError.js'
import type { PageContextInit } from '../renderPage.js'

type PageContextAfterRender = { httpResponse: HttpResponse; errorWhileRendering: null | Error }

async function renderPageAlreadyRouted<
  PageContext extends {
    pageId: string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
    is404: null | boolean
    routeParams: Record<string, string>
    errorWhileRendering: null | Error
    _httpRequestId: number
  } & PageContextInitEnhanced &
    PageContextUrlInternal &
    PageContext_loadUserFilesServerSide
>(pageContext: PageContext): Promise<PageContext & PageContextAfterRender> {
  // pageContext.pageId can either be the:
  //  - ID of the page matching the routing, or the
  //  - ID of the error page `_error.page.js`.
  assert(hasProp(pageContext, 'pageId', 'string'))

  const isError: boolean = pageContext.is404 || !!pageContext.errorWhileRendering
  assert(isError === (pageContext.pageId === getErrorPageId(pageContext._pageFilesAll, pageContext._pageConfigs)))

  objectAssign(pageContext, await loadUserFilesServerSide(pageContext))

  if (!isError) {
    await executeGuardHook(pageContext, (pageContext) => preparePageContextForUserConsumptionServerSide(pageContext))
  }

  if (!isError) {
    await executeOnBeforeRenderAndDataHooks(pageContext)
  } else {
    try {
      await executeOnBeforeRenderAndDataHooks(pageContext)
    } catch (err) {
      if (isNewError(err, pageContext.errorWhileRendering)) {
        logRuntimeError(err, pageContext._httpRequestId)
      }
    }
  }

  if (pageContext.isClientSideNavigation) {
    if (isError) {
      objectAssign(pageContext, { [isServerSideError]: true })
    }
    const pageContextSerialized: string = serializePageContextClientSide(pageContext)
    const httpResponse = await createHttpResponsePageContextJson(pageContextSerialized)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }

  const renderHookResult = await executeOnRenderHtmlHook(pageContext)

  const { htmlRender, renderHook } = renderHookResult
  const httpResponse = await createHttpResponsePage(htmlRender, renderHook, pageContext)
  objectAssign(pageContext, { httpResponse })
  return pageContext
}

async function prerenderPage(
  pageContext: PageContextInitEnhanced &
    PageFiles & {
      routeParams: Record<string, string>
      pageId: string
      _urlRewrite: null
      _httpRequestId: number | null
      _usesClientRouter: boolean
      _pageContextAlreadyProvidedByOnPrerenderHook?: true
      is404: boolean
    }
) {
  objectAssign(pageContext, {
    isClientSideNavigation: false,
    _urlHandler: null
  })

  /* Should we execute the guard() hook upon pre-rendering? Is there a use case for this?
   *  - It isn't trivial to implement, as it requires to duplicate / factor out the isAbortError() handling
  await executeGuardHook(pageContext, (pageContext) => preparePageContextForUserConsumptionServerSide(pageContext))
  */

  await executeOnBeforeRenderAndDataHooks(pageContext)

  const { htmlRender, renderHook } = await executeOnRenderHtmlHook(pageContext)
  assertUsage(
    htmlRender !== null,
    `Cannot pre-render ${pc.cyan(pageContext.urlOriginal)} because the ${renderHook.hookName}() hook defined by ${
      renderHook.hookFilePath
    } didn't return an HTML string.`
  )
  assert(pageContext.isClientSideNavigation === false)
  const documentHtml = await getHtmlString(htmlRender)
  assert(typeof documentHtml === 'string')
  if (!pageContext._usesClientRouter) {
    return { documentHtml, pageContextSerialized: null, pageContext }
  } else {
    const pageContextSerialized = serializePageContextClientSide(pageContext)
    return { documentHtml, pageContextSerialized, pageContext }
  }
}

type PageContextInitEnhanced = Awaited<ReturnType<typeof createPageContextServerSide>>
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

  const pageContextInitEnhanced = createPageContext(pageContextInit, isPrerendering)
  objectAssign(pageContextInitEnhanced, pageContextInit)
  objectAssign(pageContextInitEnhanced, {
    _objectCreatedByVike: true,
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
  const pageContextUrlComputed = getPageContextUrlComputed(pageContextInitEnhanced)
  objectAssign(pageContextInitEnhanced, pageContextUrlComputed)

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
    objectAssign(pageContextInitEnhanced, { headers })
  }

  return pageContextInitEnhanced
}

function createPageContextWithoutGlobalContext(pageContextInit: PageContextInit) {
  const pageContext = createPageContext(pageContextInit, false)
  return pageContext
}
function createPageContext(pageContextInit: PageContextInit | null, isPrerendering: boolean) {
  const pageContext = {
    _isPageContextObject: true,
    isClientSide: false,
    isPrerendering
  }
  objectAssign(pageContext, pageContextInit)
  return pageContext
}
