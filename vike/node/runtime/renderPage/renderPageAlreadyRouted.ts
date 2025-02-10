export { renderPageAlreadyRouted }
export { prerenderPage }
export { prerender404Page }
export { getPageContextInitEnhanced }
export type { PageContextAfterRender }
export type { PageContextInitEnhanced }

import { getErrorPageId } from '../../../shared/error-page.js'
import { getHtmlString } from '../html/renderHtml.js'
import { assert, assertUsage, assertWarning, hasProp, normalizeHeaders, objectAssign } from '../utils.js'
import { serializePageContextClientSide } from '../html/serializePageContextClientSide.js'
import { getPageContextUrlComputed, type PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { GlobalContext } from '../globalContext.js'
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
import { resolveBaseRuntime } from '../../shared/resolveBase.js'

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
      is404: null | boolean
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

async function prerender404Page(pageContextInit_: Record<string, unknown> | null, globalContext: GlobalContext) {
  const errorPageId = getErrorPageId(globalContext.pageFilesAll, globalContext.pageConfigs)
  if (!errorPageId) {
    return null
  }

  const pageContext = {
    pageId: errorPageId,
    _httpRequestId: null,
    _urlRewrite: null,
    is404: true,
    routeParams: {},
    // `prerender404Page()` is about generating `dist/client/404.html` for static hosts; there is no Client Routing.
    _usesClientRouter: false,
    _debugRouteMatches: []
  }

  const pageContextInit = {
    urlOriginal: '/fake-404-url' // A URL is needed for `applyViteHtmlTransform`
  }
  objectAssign(pageContextInit, pageContextInit_)
  {
    const pageContextInitEnhanced = await getPageContextInitEnhanced(pageContextInit, globalContext)
    objectAssign(pageContext, pageContextInitEnhanced)
  }

  objectAssign(pageContext, await loadUserFilesServerSide(pageContext))

  return prerenderPage(pageContext)
}

type PageContextInitEnhanced = Awaited<ReturnType<typeof getPageContextInitEnhanced>>
async function getPageContextInitEnhanced(
  pageContextInit: { urlOriginal: string; headersOriginal?: unknown; headers?: unknown },
  globalContext: GlobalContext,
  {
    ssr: { urlRewrite, urlHandler, isClientSideNavigation } = {
      urlRewrite: null,
      urlHandler: null,
      isClientSideNavigation: false
    }
  }: {
    ssr?: {
      urlRewrite: null | string
      urlHandler: null | ((url: string) => string)
      isClientSideNavigation: boolean
    }
  } = {}
) {
  assert(pageContextInit.urlOriginal)

  const { baseServer, baseAssets } = resolveBaseRuntime(globalContext)
  const pageContextInitEnhanced = {}
  objectAssign(pageContextInitEnhanced, pageContextInit)
  objectAssign(pageContextInitEnhanced, {
    _objectCreatedByVike: true,
    // The following is defined on `pageContext` because we can eventually make these non-global
    _baseServer: baseServer,
    _baseAssets: baseAssets,
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
    /** @experimental This is a beta feature https://vike.dev/getGlobalContext */
    globalContext: globalContext.globalContext_public,
    _pageContextInit: pageContextInit,
    _urlRewrite: urlRewrite,
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
      // TODO/next-major-release: assertUsage() instead of assertWarning()
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
