export { renderPage }
export { renderPage_addWrapper }

import {
  getRenderContext,
  getPageContextInitEnhanced,
  RenderContext,
  renderPageAlreadyRouted,
  PageContextInitEnhanced
} from './renderPage/renderPageAlreadyRouted.js'
import { route } from '../../shared/route/index.js'
import {
  assert,
  hasProp,
  objectAssign,
  isParsable,
  parseUrl,
  assertEnv,
  assertWarning,
  getGlobalObject,
  checkType,
  assertUsage,
  normalizeUrlPathname,
  removeBaseServer,
  modifyUrlPathname,
  prependBase
} from './utils.js'
import {
  assertNoInfiniteAbortLoop,
  ErrorAbort,
  getPageContextFromAllRewrites,
  isAbortError,
  logAbortErrorHandled,
  PageContextFromRewrite
} from '../../shared/route/abort.js'
import { getGlobalContext, initGlobalContext } from './globalContext.js'
import { handlePageContextRequestUrl } from './renderPage/handlePageContextRequestUrl.js'
import {
  createHttpResponseObjectRedirect,
  createHttpResponsePageContextJson,
  HttpResponse
} from './renderPage/createHttpResponseObject.js'
import { logRuntimeError, logRuntimeInfo } from './renderPage/loggerRuntime.js'
import { isNewError } from './renderPage/isNewError.js'
import { assertArguments } from './renderPage/assertArguments.js'
import type { PageContextDebug } from './renderPage/debugPageFiles.js'
import { log404 } from './renderPage/log404/index.js'
import { isConfigInvalid } from './renderPage/isConfigInvalid.js'
import pc from '@brillout/picocolors'
import type { PageContextBuiltIn } from '../../types/index.js'
import { serializePageContextAbort, serializePageContextClientSide } from './html/serializePageContextClientSide.js'
import { getErrorPageId } from '../../shared/error-page.js'
import { handleErrorWithoutErrorPage } from './renderPage/handleErrorWithoutErrorPage.js'
import { loadPageFilesServerSide } from './renderPage/loadPageFilesServerSide.js'
import { resolveRedirects } from '../../shared/route/resolveRedirects.js'

const globalObject = getGlobalObject('runtime/renderPage.ts', {
  httpRequestsCount: 0,
  pendingRequestsCount: 0
})
let renderPage_wrapper = async <PageContext>(_httpRequestId: number, ret: () => Promise<PageContext>) => ({
  pageContextReturn: await ret(),
  onRequestDone: () => {}
})
const renderPage_addWrapper = (wrapper: typeof renderPage_wrapper) => {
  renderPage_wrapper = wrapper
}

type PageContextAfterRender = { httpResponse: HttpResponse | null } & Partial<PageContextBuiltIn>

// `renderPage()` calls `renderPageNominal()` while ensuring that errors are `console.error(err)` instead of `throw err`, so that `vite-plugin-ssr` never triggers a server shut down. (Throwing an error in an Express.js middleware shuts down the whole Express.js server.)
async function renderPage<
  PageContextUserAdded extends {},
  PageContextInit extends {
    /** @deprecated */
    url?: string
    /** The URL of the HTTP request */
    urlOriginal: string
  }
>(
  pageContextInit: PageContextInit
): Promise<
  // Partial because rendering may fail at any user hook. Also Partial when httpResponse !== null because .pageContext.json requests may fail while still returning the HTTP response `JSON.stringify({ serverSideError: true })`.
  PageContextInit & { httpResponse: HttpResponse | null } & Partial<PageContextBuiltIn & PageContextUserAdded>
> {
  assertArguments(...arguments)
  assert(hasProp(pageContextInit, 'urlOriginal', 'string'))
  assertEnv()

  if (skipRequest(pageContextInit.urlOriginal)) {
    const pageContextHttpReponseNull = getPageContextHttpResponseNull(pageContextInit)
    checkType<PageContextAfterRender>(pageContextHttpReponseNull)
    return pageContextHttpReponseNull as any
  }

  const httpRequestId = getRequestId()
  const urlToShowToUser = pc.bold(pageContextInit.urlOriginal)
  logHttpRequest(urlToShowToUser, httpRequestId)
  globalObject.pendingRequestsCount++

  const { pageContextReturn, onRequestDone } = await renderPage_wrapper(httpRequestId, () =>
    renderPageAndPrepare(pageContextInit, httpRequestId)
  )

  logHttpResponse(urlToShowToUser, httpRequestId, pageContextReturn)
  globalObject.pendingRequestsCount--
  onRequestDone()

  checkType<PageContextAfterRender>(pageContextReturn)
  return pageContextReturn as any
}
async function renderPageAndPrepare(
  pageContextInit: { urlOriginal: string } & Record<string, unknown>,
  httpRequestId: number
): Promise<PageContextAfterRender> {
  // Invalid config
  const handleInvalidConfig = () => {
    logRuntimeInfo?.(pc.red(pc.bold("Couldn't load configuration: see error above.")), httpRequestId, 'error')
    const pageContextHttpReponseNull = getPageContextHttpResponseNull(pageContextInit)
    return pageContextHttpReponseNull
  }
  if (isConfigInvalid) {
    return handleInvalidConfig()
  }

  {
    const pageContextHttpReponse = normalizePathname(pageContextInit)
    if (pageContextHttpReponse) return pageContextHttpReponse
  }

  // Prepare context
  let renderContext: RenderContext
  try {
    await initGlobalContext()
    renderContext = await getRenderContext()
  } catch (err) {
    // Errors are expected since assertUsage() is used in both initGlobalContext() and getRenderContext().
    // initGlobalContext() and getRenderContext() don't call any user hooks => err isn't thrown from user code
    assert(!isAbortError(err))
    logRuntimeError(err, httpRequestId)
    const pageContextHttpReponseNull = getPageContextHttpResponseNullWithError(err, pageContextInit)
    return pageContextHttpReponseNull
  }
  if (isConfigInvalid) {
    return handleInvalidConfig()
  } else {
    // From now on, renderContext.pageConfigs contains all the configuration data; getVikeConfig() isn't called anymore for this request
  }

  {
    const pageContextHttpReponse = getPermanentRedirect(pageContextInit)
    if (pageContextHttpReponse) return pageContextHttpReponse
  }

  return await renderPageAlreadyPrepared(pageContextInit, httpRequestId, renderContext, [])
}

async function renderPageAlreadyPrepared(
  pageContextInit: { urlOriginal: string } & Record<string, unknown>,
  httpRequestId: number,
  renderContext: RenderContext,
  pageContextsFromRewrite: PageContextFromRewrite[]
): Promise<PageContextAfterRender> {
  assertNoInfiniteAbortLoop(
    pageContextsFromRewrite.length,
    // There doesn't seem to be a way to count the number of HTTP redirects (vite-plugin-ssr don't have access to the HTTP request headers/cookies)
    // https://stackoverflow.com/questions/9683007/detect-infinite-http-redirect-loop-on-server-side
    0
  )
  let pageContextNominalPageSuccess: undefined | Awaited<ReturnType<typeof renderPageNominal>>
  let pageContextNominalPageInit = {}
  {
    const pageContextFromAllRewrites = getPageContextFromAllRewrites(pageContextsFromRewrite)
    objectAssign(pageContextNominalPageInit, pageContextFromAllRewrites)
  }
  {
    const pageContextInitEnhanced = getPageContextInitEnhancedSSR(
      pageContextInit,
      renderContext,
      pageContextNominalPageInit._urlRewrite,
      httpRequestId
    )
    objectAssign(pageContextNominalPageInit, pageContextInitEnhanced)
  }
  let errNominalPage: unknown
  {
    try {
      pageContextNominalPageSuccess = await renderPageNominal(pageContextNominalPageInit)
    } catch (err) {
      errNominalPage = err
      assert(errNominalPage)
      logRuntimeError(errNominalPage, httpRequestId)
    }
    if (!errNominalPage) {
      assert(pageContextNominalPageSuccess === pageContextNominalPageInit)
    }
  }

  // Log upon 404
  if (
    pageContextNominalPageSuccess &&
    'is404' in pageContextNominalPageSuccess &&
    pageContextNominalPageSuccess.is404 === true
  ) {
    await log404(pageContextNominalPageSuccess)
  }

  if (errNominalPage === undefined) {
    assert(pageContextNominalPageSuccess)
    return pageContextNominalPageSuccess
  } else {
    assert(errNominalPage)
    assert(pageContextNominalPageSuccess === undefined)
    assert(pageContextNominalPageInit)
    assert(hasProp(pageContextNominalPageInit, 'urlOriginal', 'string'))

    const pageContextErrorPageInit = await getPageContextErrorPageInit(
      pageContextInit,
      errNominalPage,
      pageContextNominalPageInit,
      renderContext,
      httpRequestId
    )

    if (isAbortError(errNominalPage)) {
      const handled = await handleAbortError(
        errNominalPage,
        pageContextsFromRewrite,
        pageContextInit,
        pageContextNominalPageInit,
        httpRequestId,
        renderContext,
        pageContextErrorPageInit
      )
      if (handled.pageContextReturn) {
        // - throw redirect()
        // - throw render(url)
        // - throw render(statusCode) if .pageContext.json request
        return handled.pageContextReturn
      } else {
        // - throw render(statusCode) if not .pageContext.json request
      }
      Object.assign(pageContextErrorPageInit, handled.pageContextAbort)
    }

    {
      const errorPageId = getErrorPageId(renderContext.pageFilesAll, renderContext.pageConfigs)
      if (!errorPageId) {
        objectAssign(pageContextErrorPageInit, { _pageId: null })
        return handleErrorWithoutErrorPage(pageContextErrorPageInit)
      } else {
        objectAssign(pageContextErrorPageInit, { _pageId: errorPageId })
      }
    }

    let pageContextErrorPage: undefined | Awaited<ReturnType<typeof renderPageAlreadyRouted>>
    try {
      pageContextErrorPage = await renderPageAlreadyRouted(pageContextErrorPageInit)
    } catch (errErrorPage) {
      if (isAbortError(errErrorPage)) {
        const handled = await handleAbortError(
          errErrorPage,
          pageContextsFromRewrite,
          pageContextInit,
          pageContextNominalPageInit,
          httpRequestId,
          renderContext,
          pageContextErrorPageInit
        )
        // throw render(statusCode)
        if (!handled.pageContextReturn) {
          const abortCall = pc.cyan(errErrorPage._pageContextAbort._abortCall)
          const abortCaller = pc.cyan(`throw ${errErrorPage._pageContextAbort._abortCaller}()`)
          assertWarning(
            false,
            `Failed to render error page because ${abortCall} was called: make sure ${abortCaller} doesn't occur while the error page is being rendered.`,
            { onlyOnce: false }
          )
          const pageContextHttpReponseNull = getPageContextHttpResponseNullWithError(errNominalPage, pageContextInit)
          return pageContextHttpReponseNull
        }
        // `throw redirect()` / `throw render(url)`
        return handled.pageContextReturn
      }
      if (isNewError(errErrorPage, errNominalPage)) {
        logRuntimeError(errErrorPage, httpRequestId)
      }
      const pageContextHttpReponseNull = getPageContextHttpResponseNullWithError(errNominalPage, pageContextInit)
      return pageContextHttpReponseNull
    }
    return pageContextErrorPage
  }
}

function logHttpRequest(urlToShowToUser: string, httpRequestId: number) {
  const clearErrors = globalObject.pendingRequestsCount === 0
  logRuntimeInfo?.(`HTTP request: ${urlToShowToUser}`, httpRequestId, 'info', clearErrors)
}
function logHttpResponse(urlToShowToUser: string, httpRequestId: number, pageContextReturn: PageContextAfterRender) {
  const statusCode = pageContextReturn.httpResponse?.statusCode ?? null
  const isSuccess = statusCode !== null && statusCode >= 200 && statusCode <= 399
  const isNominal = isSuccess || statusCode === 404
  const color = (s: number | string) => pc.bold(isSuccess ? pc.green(s) : pc.red(s))
  const type = statusCode && 300 <= statusCode && statusCode <= 399 ? 'redirect' : 'response'
  logRuntimeInfo?.(
    `HTTP ${type} ${urlToShowToUser} ${color(statusCode ?? 'ERR')}`,
    httpRequestId,
    isNominal ? 'info' : 'error'
  )
}

function getPageContextHttpResponseNullWithError(err: unknown, pageContextInit: Record<string, unknown>) {
  const pageContextHttpReponseNull = {}
  objectAssign(pageContextHttpReponseNull, pageContextInit)
  objectAssign(pageContextHttpReponseNull, {
    httpResponse: null,
    errorWhileRendering: err
  })
  return pageContextHttpReponseNull
}
function getPageContextHttpResponseNull(pageContextInit: Record<string, unknown>): PageContextAfterRender {
  const pageContextHttpReponseNull = {}
  objectAssign(pageContextHttpReponseNull, pageContextInit)
  objectAssign(pageContextHttpReponseNull, {
    httpResponse: null,
    errorWhileRendering: null
  })
  return pageContextHttpReponseNull
}

async function renderPageNominal(
  pageContext: { _urlRewrite: null | string; _httpRequestId: number } & PageContextInitEnhanced
) {
  objectAssign(pageContext, { errorWhileRendering: null })

  // Check Base URL
  {
    const { urlWithoutPageContextRequestSuffix } = handlePageContextRequestUrl(pageContext.urlOriginal)
    const hasBaseServer =
      parseUrl(urlWithoutPageContextRequestSuffix, pageContext._baseServer).hasBaseServer || !!pageContext._urlRewrite
    if (!hasBaseServer) {
      objectAssign(pageContext, { httpResponse: null })
      return pageContext
    }
  }

  // Route
  {
    const routeResult = await route(pageContext)
    objectAssign(pageContext, routeResult.pageContextAddendum)
    objectAssign(pageContext, { is404: pageContext._pageId ? null : true })
    if (pageContext._pageId === null) {
      const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._pageConfigs)
      if (!errorPageId) {
        assert(hasProp(pageContext, '_pageId', 'null'))
        return handleErrorWithoutErrorPage(pageContext)
      }
      objectAssign(pageContext, { _pageId: errorPageId })
    }
  }
  assert(hasProp(pageContext, '_pageId', 'string'))

  // Render
  const pageContextAfterRender = await renderPageAlreadyRouted(pageContext)
  assert(pageContext === pageContextAfterRender)
  return pageContextAfterRender
}

type PageContextErrorPageInit = Awaited<ReturnType<typeof getPageContextErrorPageInit>>
async function getPageContextErrorPageInit(
  pageContextInit: { urlOriginal: string },
  errNominalPage: unknown,
  pageContextNominalPagePartial: Record<string, unknown>,
  renderContext: RenderContext,
  httpRequestId: number
) {
  const pageContextInitEnhanced = getPageContextInitEnhancedSSR(pageContextInit, renderContext, null, httpRequestId)

  assert(errNominalPage)
  const pageContext = {
    ...pageContextInitEnhanced,
    is404: false,
    errorWhileRendering: errNominalPage as Error,
    routeParams: {} as Record<string, string>
  }

  objectAssign(pageContext, {
    _routeMatches: (pageContextNominalPagePartial as PageContextDebug)._routeMatches || 'ROUTE_ERROR'
  })

  assert(pageContext.errorWhileRendering)
  return pageContext
}

function getPageContextInitEnhancedSSR(
  pageContextInit: { urlOriginal: string },
  renderContext: RenderContext,
  urlRewrite: null | string,
  httpRequestId: number
) {
  const { isClientSideNavigation, _urlHandler } = handleUrl(pageContextInit.urlOriginal, urlRewrite)
  const pageContextInitEnhanced = getPageContextInitEnhanced(pageContextInit, renderContext, {
    ssr: {
      urlRewrite,
      urlHandler: _urlHandler,
      isClientSideNavigation
    }
  })
  objectAssign(pageContextInitEnhanced, { _httpRequestId: httpRequestId })
  return pageContextInitEnhanced
}

function handleUrl(
  urlOriginal: string,
  urlRewrite: string | null
): {
  isClientSideNavigation: boolean
  _urlHandler: (urlOriginal: string) => string
} {
  assert(isUrlValid(urlOriginal))
  assert(urlRewrite === null || isUrlValid(urlRewrite))
  const { isPageContextRequest } = handlePageContextRequestUrl(urlOriginal)
  const pageContextAddendum = {
    isClientSideNavigation: isPageContextRequest,
    _urlHandler: (url: string) => handlePageContextRequestUrl(url).urlWithoutPageContextRequestSuffix
  }
  return pageContextAddendum
}

function isUrlValid(url: string) {
  return url.startsWith('/') || url.startsWith('http')
}

function getRequestId(): number {
  const httpRequestId = ++globalObject.httpRequestsCount
  assert(httpRequestId >= 1)
  return httpRequestId
}

function skipRequest(urlOriginal: string): boolean {
  const isViteClientRequest = urlOriginal.endsWith('/@vite/client') || urlOriginal.startsWith('/@fs/')
  assertWarning(
    !isViteClientRequest,
    `The vite-plugin-ssr middleware renderPage() was called with the URL ${urlOriginal} which is unexpected because the HTTP request should have already been handled by Vite's development middleware. Make sure to 1. install Vite's development middleware and 2. add Vite's middleware *before* vite-plugin-ssr's middleware, see https://vite-plugin-ssr.com/renderPage`,
    { onlyOnce: true }
  )
  return (
    urlOriginal.endsWith('/__vite_ping') ||
    urlOriginal.endsWith('/favicon.ico') ||
    !isParsable(urlOriginal) ||
    isViteClientRequest
  )
}
function normalizePathname(pageContextInit: { urlOriginal: string }) {
  const { urlOriginal } = pageContextInit
  const urlNormalized = normalizeUrlPathname(urlOriginal)
  if (!urlNormalized) return null
  const httpResponse = createHttpResponseObjectRedirect(
    { url: urlNormalized, statusCode: 301 },
    pageContextInit.urlOriginal
  )
  const pageContextHttpResponse = { ...pageContextInit, httpResponse }
  return pageContextHttpResponse
}

function getPermanentRedirect(pageContextInit: { urlOriginal: string }) {
  const { redirects, baseServer } = getGlobalContext()
  const urlWithoutBase = removeBaseServer(pageContextInit.urlOriginal, baseServer)
  let urlPathname: undefined | string
  let urlRedirect = modifyUrlPathname(urlWithoutBase, (urlPathname_) => {
    urlPathname = urlPathname_
    return resolveRedirects(redirects, urlPathname)
  })
  assert(urlPathname)
  if (urlRedirect === urlWithoutBase) return null
  urlRedirect = prependBase(urlRedirect, baseServer)
  assert(urlRedirect !== pageContextInit.urlOriginal)
  const httpResponse = createHttpResponseObjectRedirect({ url: urlRedirect, statusCode: 301 }, urlPathname)
  const pageContextHttpResponse = { ...pageContextInit, httpResponse }
  return pageContextHttpResponse
}

async function handleAbortError(
  errAbort: ErrorAbort,
  pageContextsFromRewrite: PageContextFromRewrite[],
  pageContextInit: { urlOriginal: string },
  pageContextNominalPageInit: {
    urlOriginal: string
    urlPathname: string
    _urlRewrite: null | string
    isClientSideNavigation: boolean
  },
  httpRequestId: number,
  renderContext: RenderContext,
  pageContextErrorPageInit: PageContextErrorPageInit
): Promise<
  | { pageContextReturn: PageContextAfterRender; pageContextAbort?: never }
  | { pageContextReturn?: never; pageContextAbort: Record<string, unknown> }
> {
  logAbortErrorHandled(errAbort, getGlobalContext().isProduction, pageContextNominalPageInit)

  const pageContextAbort = errAbort._pageContextAbort
  let pageContextSerialized: string
  if (pageContextNominalPageInit.isClientSideNavigation) {
    if (pageContextAbort._abortStatusCode) {
      const errorPageId = getErrorPageId(renderContext.pageFilesAll, renderContext.pageConfigs)
      const abortCall = pageContextAbort._abortCall
      assert(abortCall)
      assertUsage(
        errorPageId,
        `You called ${pc.cyan(
          abortCall
        )} but you didn't define an error page, make sure to define one https://vite-plugin-ssr.com/error-page`
      )
      const pageContext = {
        _pageId: errorPageId,
        ...pageContextAbort,
        ...pageContextErrorPageInit,
        ...renderContext
      }
      objectAssign(pageContext, await loadPageFilesServerSide(pageContext))
      // We include pageContextInit: we don't only serialize pageContextAbort because the error page may need to access pageContextInit
      pageContextSerialized = serializePageContextClientSide(pageContext)
    } else {
      pageContextSerialized = serializePageContextAbort(pageContextAbort)
    }
    const httpResponse = await createHttpResponsePageContextJson(pageContextSerialized)
    const pageContextReturn = { httpResponse }
    return { pageContextReturn }
  }

  if (pageContextAbort._urlRewrite) {
    const pageContextReturn = await renderPageAlreadyPrepared(pageContextInit, httpRequestId, renderContext, [
      ...pageContextsFromRewrite,
      pageContextAbort
    ])
    Object.assign(pageContextReturn, pageContextAbort)
    return { pageContextReturn }
  }
  if (pageContextAbort._urlRedirect) {
    const pageContextReturn = {
      ...pageContextInit,
      ...pageContextAbort
    }
    const httpResponse = createHttpResponseObjectRedirect(
      pageContextAbort._urlRedirect,
      pageContextNominalPageInit.urlPathname
    )
    objectAssign(pageContextReturn, { httpResponse })
    return { pageContextReturn }
  }
  assert(pageContextAbort._abortStatusCode)
  return { pageContextAbort }
}
