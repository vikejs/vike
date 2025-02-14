export { renderPage }
export { renderPage_addAsyncHookwrapper }

import {
  getPageContextInitEnhanced,
  renderPageAlreadyRouted,
  PageContextInitEnhanced
} from './renderPage/renderPageAlreadyRouted.js'
import { route } from '../../shared/route/index.js'
import {
  assert,
  hasProp,
  objectAssign,
  isUrl,
  parseUrl,
  onSetupRuntime,
  assertWarning,
  getGlobalObject,
  checkType,
  assertUsage,
  normalizeUrlPathname,
  removeBaseServer,
  modifyUrlPathname,
  prependBase,
  removeUrlOrigin,
  setUrlOrigin,
  createUrlFromComponents,
  isUri,
  type UrlPublic,
  getUrlPretty
} from './utils.js'
import {
  assertNoInfiniteAbortLoop,
  ErrorAbort,
  getPageContextFromAllRewrites,
  isAbortError,
  logAbortErrorHandled,
  PageContextFromRewrite
} from '../../shared/route/abort.js'
import { getGlobalContextInternal, initGlobalContext_renderPage, type GlobalContextInternal } from './globalContext.js'
import { handlePageContextRequestUrl } from './renderPage/handlePageContextRequestUrl.js'
import {
  createHttpResponseFavicon404,
  createHttpResponseRedirect,
  createHttpResponsePageContextJson,
  HttpResponse,
  createHttpResponseError
} from './renderPage/createHttpResponse.js'
import { logRuntimeError, logRuntimeInfo } from './renderPage/loggerRuntime.js'
import { isNewError } from './renderPage/isNewError.js'
import { assertArguments } from './renderPage/assertArguments.js'
import type { PageContextDebugRouteMatches } from './renderPage/debugPageFiles.js'
import { log404 } from './renderPage/log404/index.js'
import { isVikeConfigInvalid } from './renderPage/isVikeConfigInvalid.js'
import pc from '@brillout/picocolors'
import type { PageContextServer } from '../../types/index.js'
import { serializePageContextAbort, serializePageContextClientSide } from './html/serializePageContextClientSide.js'
import { getErrorPageId } from '../../shared/error-page.js'
import { handleErrorWithoutErrorPage } from './renderPage/handleErrorWithoutErrorPage.js'
import { loadUserFilesServerSide } from './renderPage/loadUserFilesServerSide.js'
import { resolveRedirects } from './renderPage/resolveRedirects.js'
import { PageContextBuiltInServerInternal } from '../../shared/types.js'
import type { PageFile } from '../../shared/getPageFiles.js'
import type { PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'

const globalObject = getGlobalObject('runtime/renderPage.ts', {
  httpRequestsCount: 0
})

type PageContextAfterRender = { httpResponse: HttpResponse } & Partial<PageContextBuiltInServerInternal>

// `renderPage()` calls `renderPageNominal()` while ensuring that errors are `console.error(err)` instead of `throw err`, so that Vike never triggers a server shut down. (Throwing an error in an Express.js middleware shuts down the whole Express.js server.)
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
  // Partial because rendering may fail at any user hook.
  // - `.pageContext.json` requests may fail while still returning the HTTP response `JSON.stringify({ serverSideError: true })`.
  PageContextInit & { httpResponse: HttpResponse } & Partial<PageContextServer & PageContextUserAdded>
> {
  assertArguments(...arguments)
  assert(hasProp(pageContextInit, 'urlOriginal', 'string')) // assertUsage() already implemented at assertArguments()
  assertIsUrl(pageContextInit.urlOriginal)
  onSetupRuntime()
  const pageContextInvalidRequest = renderInvalidRequest(pageContextInit)
  if (pageContextInvalidRequest) return pageContextInvalidRequest as any

  const httpRequestId = getRequestId()
  const urlOriginalPretty = getUrlPretty(pageContextInit.urlOriginal)
  logHttpRequest(urlOriginalPretty, httpRequestId)

  const { pageContextReturn } = await asyncHookWrapper(httpRequestId, () =>
    renderPageAndPrepare(pageContextInit, httpRequestId)
  )

  logHttpResponse(urlOriginalPretty, httpRequestId, pageContextReturn)

  checkType<PageContextAfterRender>(pageContextReturn)
  assert(pageContextReturn.httpResponse)
  return pageContextReturn as any
}

// Fallback wrapper if node:async_hooks isn't available
let asyncHookWrapper = async <PageContext>(_httpRequestId: number, ret: () => Promise<PageContext>) => ({
  pageContextReturn: await ret()
})
// Add node:async_hooks wrapper
function renderPage_addAsyncHookwrapper(wrapper: typeof asyncHookWrapper) {
  asyncHookWrapper = wrapper
}

async function renderPageAndPrepare(
  pageContextInit: { urlOriginal: string } & Record<string, unknown>,
  httpRequestId: number
): Promise<PageContextAfterRender> {
  // Invalid config
  if (isVikeConfigInvalid) {
    if (
      1 < 2 // Make TS happy
    ) {
      return renderInvalidVikeConfig(isVikeConfigInvalid.err, pageContextInit, httpRequestId)
    }
  }

  // Prepare context
  try {
    await initGlobalContext_renderPage()
  } catch (err) {
    // Errors are expected since assertUsage() is used in initGlobalContext_renderPage() such as:
    // ```bash
    // Re-build your app (you're using 1.2.3 but your app was built with 1.2.2)
    // ```
    // initGlobalContext_renderPage() doens't call any user hook => err isn't thrown from user code.
    assert(!isAbortError(err))
    logRuntimeError(err, httpRequestId)
    const pageContextWithError = getPageContextHttpResponseError(err, pageContextInit, null)
    return pageContextWithError
  }
  if (isVikeConfigInvalid) {
    return renderInvalidVikeConfig(isVikeConfigInvalid.err, pageContextInit, httpRequestId)
  } else {
    // From now on, globalContext contains all the configuration data; getVikeConfig() isn't called anymore for this request
  }
  const globalContext = await getGlobalContextInternal()

  // Check Base URL
  await assertBaseUrl(pageContextInit, globalContext)

  // Normalize URL
  {
    const pageContextHttpResponse = await normalizeUrl(pageContextInit, globalContext, httpRequestId)
    if (pageContextHttpResponse) return pageContextHttpResponse
  }

  // Permanent redirects (HTTP status code `301`)
  {
    const pageContextHttpResponse = await getPermanentRedirect(pageContextInit, globalContext, httpRequestId)
    if (pageContextHttpResponse) return pageContextHttpResponse
  }

  return await renderPageAlreadyPrepared(pageContextInit, globalContext, httpRequestId, [])
}

async function renderPageAlreadyPrepared(
  pageContextInit: { urlOriginal: string } & Record<string, unknown>,
  globalContext: GlobalContextInternal,
  httpRequestId: number,
  pageContextsFromRewrite: PageContextFromRewrite[]
): Promise<PageContextAfterRender> {
  assertNoInfiniteAbortLoop(
    pageContextsFromRewrite.length,
    // There doesn't seem to be a way to count the number of HTTP redirects (vike don't have access to the HTTP request headers/cookies)
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
    const pageContextInitEnhanced = await getPageContextInitEnhancedSSR(
      pageContextInit,
      globalContext,
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
      globalContext,
      errNominalPage,
      pageContextNominalPageInit,
      httpRequestId
    )

    // Handle `throw redirect()` and `throw render()` while rendering nominal page
    if (isAbortError(errNominalPage)) {
      const handled = await handleAbortError(
        errNominalPage,
        pageContextsFromRewrite,
        pageContextInit,
        pageContextNominalPageInit,
        httpRequestId,
        pageContextErrorPageInit,
        globalContext
      )
      if (handled.pageContextReturn) {
        // - throw redirect()
        // - throw render(url)
        // - throw render(abortStatusCode) if .pageContext.json request
        return handled.pageContextReturn
      } else {
        // - throw render(abortStatusCode) if not .pageContext.json request
      }
      Object.assign(pageContextErrorPageInit, handled.pageContextAbort)
    }

    {
      const errorPageId = getErrorPageId(globalContext.pageFilesAll, globalContext.pageConfigs)
      if (!errorPageId) {
        objectAssign(pageContextErrorPageInit, { pageId: null })
        return handleErrorWithoutErrorPage(pageContextErrorPageInit)
      } else {
        objectAssign(pageContextErrorPageInit, { pageId: errorPageId })
      }
    }

    let pageContextErrorPage: undefined | Awaited<ReturnType<typeof renderPageAlreadyRouted>>
    try {
      pageContextErrorPage = await renderPageAlreadyRouted(pageContextErrorPageInit)
    } catch (errErrorPage) {
      // Handle `throw redirect()` and `throw render()` while rendering error page
      if (isAbortError(errErrorPage)) {
        const handled = await handleAbortError(
          errErrorPage,
          pageContextsFromRewrite,
          pageContextInit,
          pageContextNominalPageInit,
          httpRequestId,
          pageContextErrorPageInit,
          globalContext
        )
        // throw render(abortStatusCode)
        if (!handled.pageContextReturn) {
          const pageContextAbort = errErrorPage._pageContextAbort
          assertWarning(
            false,
            `Failed to render error page because ${pc.cyan(
              pageContextAbort._abortCall
            )} was called: make sure ${pc.cyan(
              pageContextAbort._abortCaller
            )} doesn't occur while the error page is being rendered.`,
            { onlyOnce: false }
          )
          const pageContextHttpWithError = getPageContextHttpResponseError(
            errNominalPage,
            pageContextInit,
            pageContextErrorPageInit
          )
          return pageContextHttpWithError
        }
        // `throw redirect()` / `throw render(url)`
        return handled.pageContextReturn
      }
      if (isNewError(errErrorPage, errNominalPage)) {
        logRuntimeError(errErrorPage, httpRequestId)
      }
      const pageContextWithError = getPageContextHttpResponseError(
        errNominalPage,
        pageContextInit,
        pageContextErrorPageInit
      )
      return pageContextWithError
    }
    return pageContextErrorPage
  }
}

function logHttpRequest(urlOriginal: string, httpRequestId: number) {
  logRuntimeInfo?.(getRequestInfoMessage(urlOriginal), httpRequestId, 'info')
}
function getRequestInfoMessage(urlOriginal: string) {
  return `HTTP request: ${prettyUrl(urlOriginal)}`
}
function logHttpResponse(urlOriginalPretty: string, httpRequestId: number, pageContextReturn: PageContextAfterRender) {
  const statusCode = pageContextReturn.httpResponse?.statusCode ?? null

  let msg: `HTTP response ${string}` | `HTTP redirect ${string}`
  let isNominal: boolean
  {
    const { errorWhileRendering } = pageContextReturn
    const isSkipped = statusCode === null && !errorWhileRendering
    if (isSkipped) {
      // - URL doesn't include Base URL
      //   - Can we abort earlier so that `logHttpResponse()` and `logHttpRequest()` aren't even called?
      // - Error loading a Vike config file
      //   - We should show `HTTP response ${urlOriginalPretty} ERR` instead.
      //   - Maybe we can/should make the error available at pageContext.errorWhileRendering
      assert(errorWhileRendering === null || errorWhileRendering === undefined)
      msg = `HTTP response ${prettyUrl(urlOriginalPretty)} ${pc.dim('null')}`
      // Erroneous value (it shoud sometimes be `false`) but it's fine as it doesn't seem to have much of an impact.
      isNominal = true
    } else {
      const isSuccess = statusCode !== null && statusCode >= 200 && statusCode <= 399
      isNominal = isSuccess || statusCode === 404
      const color = (s: number | string) => pc.bold(isSuccess ? pc.green(String(s)) : pc.red(String(s)))
      const isRedirect = statusCode && 300 <= statusCode && statusCode <= 399
      const type = isRedirect ? 'redirect' : 'response'
      if (isRedirect) {
        assert(pageContextReturn.httpResponse)
        const headerRedirect = pageContextReturn.httpResponse.headers
          .slice()
          .reverse()
          .find((header) => header[0] === 'Location')
        assert(headerRedirect)
        const urlRedirect = headerRedirect[1]
        urlOriginalPretty = urlRedirect
      }
      msg = `HTTP ${type} ${prettyUrl(urlOriginalPretty)} ${color(statusCode ?? 'ERR')}`
    }
  }
  logRuntimeInfo?.(msg, httpRequestId, isNominal ? 'info' : 'error')
}
function prettyUrl(url: string) {
  return pc.bold(decodeURI(url))
}

function getPageContextHttpResponseError(
  err: unknown,
  pageContextInit: Record<string, unknown>,
  pageContext: null | {
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfigRuntime[]
  }
): PageContextAfterRender {
  const pageContextWithError = createPageContext(pageContextInit)
  const httpResponse = createHttpResponseError(pageContext)
  objectAssign(pageContextWithError, {
    httpResponse,
    errorWhileRendering: err
  })
  return pageContextWithError
}
function getPageContextHttpResponseFavicon404(pageContextInit: Record<string, unknown>): PageContextAfterRender {
  const pageContext = createPageContext(pageContextInit)
  const httpResponse = createHttpResponseFavicon404()
  objectAssign(pageContext, {
    httpResponse
  })
  checkType<PageContextAfterRender>(pageContext)
  return pageContext
}

function createPageContext(pageContextInit: Record<string, unknown>) {
  const pageContext = {
    _isPageContextObject: true
  }
  Object.assign(pageContext, pageContextInit)
  return pageContext
}

async function renderPageNominal(
  pageContext: { _urlRewrite: null | string; _httpRequestId: number } & PageContextInitEnhanced
) {
  objectAssign(pageContext, { errorWhileRendering: null })

  // Route
  {
    const pageContextFromRoute = await route(pageContext)
    objectAssign(pageContext, pageContextFromRoute)
    objectAssign(pageContext, { is404: pageContext.pageId ? null : true })
    if (pageContext.pageId === null) {
      const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._pageConfigs)
      if (!errorPageId) {
        assert(hasProp(pageContext, 'pageId', 'null'))
        return handleErrorWithoutErrorPage(pageContext)
      }
      objectAssign(pageContext, { pageId: errorPageId })
    }
  }
  assert(hasProp(pageContext, 'pageId', 'string'))
  assert(pageContext.errorWhileRendering === null)

  // Render
  const pageContextAfterRender = await renderPageAlreadyRouted(pageContext)
  assert(pageContext === pageContextAfterRender)
  return pageContextAfterRender
}

type PageContextErrorPageInit = Awaited<ReturnType<typeof getPageContextErrorPageInit>>
async function getPageContextErrorPageInit(
  pageContextInit: { urlOriginal: string },
  globalContext: GlobalContextInternal,
  errNominalPage: unknown,
  pageContextNominalPagePartial: Record<string, unknown>,
  httpRequestId: number
) {
  const pageContextInitEnhanced = await getPageContextInitEnhancedSSR(
    pageContextInit,
    globalContext,
    null,
    httpRequestId
  )

  assert(errNominalPage)
  const pageContext = {}
  objectAssign(pageContext, pageContextInitEnhanced)
  objectAssign(pageContext, {
    is404: false,
    errorWhileRendering: errNominalPage as Error,
    routeParams: {} as Record<string, string>
  })

  objectAssign(pageContext, {
    _debugRouteMatches:
      (pageContextNominalPagePartial as PageContextDebugRouteMatches)._debugRouteMatches || 'ROUTING_ERROR'
  })

  assert(pageContext.errorWhileRendering)
  return pageContext
}

async function getPageContextInitEnhancedSSR(
  pageContextInit: { urlOriginal: string },
  globalContext: GlobalContextInternal,
  urlRewrite: null | string,
  httpRequestId: number
) {
  const { isClientSideNavigation, _urlHandler } = handlePageContextUrl(pageContextInit.urlOriginal)
  const pageContextInitEnhanced = await getPageContextInitEnhanced(pageContextInit, globalContext, {
    ssr: {
      urlRewrite,
      urlHandler: _urlHandler,
      isClientSideNavigation
    }
  })
  objectAssign(pageContextInitEnhanced, { _httpRequestId: httpRequestId })
  return pageContextInitEnhanced
}

function handlePageContextUrl(urlOriginal: string): {
  isClientSideNavigation: boolean
  _urlHandler: (urlOriginal: string) => string
} {
  const { isPageContextRequest } = handlePageContextRequestUrl(urlOriginal)
  return {
    isClientSideNavigation: isPageContextRequest,
    _urlHandler: (url: string) => handlePageContextRequestUrl(url).urlWithoutPageContextRequestSuffix
  }
}

function getRequestId(): number {
  const httpRequestId = ++globalObject.httpRequestsCount
  assert(httpRequestId >= 1)
  return httpRequestId
}

function assertIsUrl(urlOriginal: string) {
  assertUsage(
    isUrl(urlOriginal),
    `${pc.code('renderPage(pageContextInit)')} (https://vike.dev/renderPage) called with ${pc.code(
      `pageContextInit.urlOriginal===${JSON.stringify(urlOriginal)}`
    )} which isn't a valid URL.`
  )
}
function assertIsNotViteRequest(urlPathname: string, urlOriginal: string) {
  const isViteRequest =
    urlPathname.startsWith('/@vite/client') || urlPathname.startsWith('/@fs/') || urlPathname.startsWith('/__vite_ping')
  if (!isViteRequest) return
  assertUsage(
    false,
    `${pc.code('renderPage(pageContextInit)')} called with ${pc.code(
      `pageContextInit.urlOriginal===${JSON.stringify(urlOriginal)}`
    )} which is unexpected because the URL ${pc.bold(urlOriginal)} should have already been handled by the development middleware: make sure the ${pc.cyan('createDevMiddleware()')} middleware is executed *before* the ${pc.cyan('renderPage()')} middleware, see ${pc.underline('https://vike.dev/renderPage')}`
  )
}

async function normalizeUrl(
  pageContextInit: { urlOriginal: string },
  globalContext: GlobalContextInternal,
  httpRequestId: number
) {
  const { trailingSlash, disableUrlNormalization } = globalContext.config
  if (disableUrlNormalization) return null
  const { urlOriginal } = pageContextInit
  const { isPageContextRequest } = handlePageContextRequestUrl(urlOriginal)
  if (isPageContextRequest) return null
  const urlNormalized = normalizeUrlPathname(urlOriginal, trailingSlash ?? false, globalContext.baseServer)
  if (!urlNormalized) return null
  logRuntimeInfo?.(
    `URL normalized from ${pc.cyan(urlOriginal)} to ${pc.cyan(urlNormalized)} (https://vike.dev/url-normalization)`,
    httpRequestId,
    'info'
  )
  const httpResponse = createHttpResponseRedirect({ url: urlNormalized, statusCode: 301 }, pageContextInit.urlOriginal)
  const pageContextHttpResponse = createPageContext(pageContextInit)
  objectAssign(pageContextHttpResponse, { httpResponse })
  return pageContextHttpResponse
}

async function getPermanentRedirect(
  pageContextInit: { urlOriginal: string },
  globalContext: GlobalContextInternal,
  httpRequestId: number
) {
  const urlWithoutBase = removeBaseServer(pageContextInit.urlOriginal, globalContext.baseServer)
  let origin: null | string = null
  let urlTargetExternal: null | string = null
  let urlTarget = modifyUrlPathname(urlWithoutBase, (urlPathname) => {
    const urlTarget = resolveRedirects(globalContext.config.redirects ?? [], urlPathname)
    if (urlTarget === null) return null
    if (!isUrl(urlTarget)) {
      // E.g. `urlTarget === 'mailto:some@example.com'`
      assert(isUri(urlTarget))
      urlTargetExternal = urlTarget
      return null
    }
    const { urlModified, origin: origin_ } = removeUrlOrigin(urlTarget)
    origin = origin_
    return urlModified
  })
  if (urlTargetExternal) {
    urlTarget = urlTargetExternal
  } else {
    let originChanged = false
    if (origin) {
      const urlModified = setUrlOrigin(urlTarget, origin)
      if (urlModified !== false) {
        originChanged = true
        urlTarget = urlModified
      }
    }
    if (normalize(urlTarget) === normalize(urlWithoutBase)) return null
    if (!originChanged) urlTarget = prependBase(urlTarget, globalContext.baseServer)
    assert(urlTarget !== pageContextInit.urlOriginal)
  }
  logRuntimeInfo?.(
    `Permanent redirection defined by config.redirects (https://vike.dev/redirects)`,
    httpRequestId,
    'info'
  )
  const httpResponse = createHttpResponseRedirect({ url: urlTarget, statusCode: 301 }, urlWithoutBase)
  const pageContextHttpResponse = createPageContext(pageContextInit)
  objectAssign(pageContextHttpResponse, { httpResponse })
  return pageContextHttpResponse
}
function normalize(url: string) {
  return url || '/'
}

async function handleAbortError(
  errAbort: ErrorAbort,
  pageContextsFromRewrite: PageContextFromRewrite[],
  pageContextInit: { urlOriginal: string },
  // handleAbortError() creates a new pageContext object and we don't merge pageContextNominalPageInit to it: we only use some pageContextNominalPageInit information.
  pageContextNominalPageInit: {
    urlOriginal: string
    urlParsed: UrlPublic
    _urlRewrite: null | string
    isClientSideNavigation: boolean
  },
  httpRequestId: number,
  pageContextErrorPageInit: PageContextErrorPageInit,
  globalContext: GlobalContextInternal
): Promise<
  | { pageContextReturn: PageContextAfterRender; pageContextAbort?: never }
  | { pageContextReturn?: never; pageContextAbort: Record<string, unknown> }
> {
  logAbortErrorHandled(errAbort, globalContext.isProduction, pageContextNominalPageInit)

  const pageContextAbort = errAbort._pageContextAbort
  let pageContextSerialized: string
  if (pageContextNominalPageInit.isClientSideNavigation) {
    if (pageContextAbort.abortStatusCode) {
      const errorPageId = getErrorPageId(globalContext.pageFilesAll, globalContext.pageConfigs)
      const abortCall = pageContextAbort._abortCall
      assert(abortCall)
      assertUsage(
        errorPageId,
        `You called ${pc.cyan(
          abortCall
        )} but you didn't define an error page, make sure to define one https://vike.dev/error-page`
      )
      const pageContext = createPageContext({})
      objectAssign(pageContext, { pageId: errorPageId })
      objectAssign(pageContext, pageContextAbort)
      objectAssign(pageContext, pageContextErrorPageInit)
      objectAssign(pageContext, await loadUserFilesServerSide(pageContext))
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
    const pageContextReturn = await renderPageAlreadyPrepared(pageContextInit, globalContext, httpRequestId, [
      ...pageContextsFromRewrite,
      pageContextAbort
    ])
    Object.assign(pageContextReturn, pageContextAbort)
    return { pageContextReturn }
  }
  if (pageContextAbort._urlRedirect) {
    const pageContextReturn = createPageContext(pageContextInit)
    objectAssign(pageContextReturn, pageContextAbort)
    const httpResponse = createHttpResponseRedirect(
      pageContextAbort._urlRedirect,
      (() => {
        const { pathname, searchOriginal } = pageContextNominalPageInit.urlParsed
        const urlLogical = createUrlFromComponents(
          null,
          pathname,
          searchOriginal,
          // The server-side doesn't have access to the hash
          null
        )
        return urlLogical
      })()
    )
    objectAssign(pageContextReturn, { httpResponse })
    return { pageContextReturn }
  }
  assert(pageContextAbort.abortStatusCode)
  return { pageContextAbort }
}

async function assertBaseUrl(pageContextInit: { urlOriginal: string }, globalContext: GlobalContextInternal) {
  const { baseServer } = globalContext
  const { urlOriginal } = pageContextInit
  const { urlWithoutPageContextRequestSuffix } = handlePageContextRequestUrl(urlOriginal)
  const { isBaseMissing } = parseUrl(urlWithoutPageContextRequestSuffix, baseServer)
  assertUsage(
    !isBaseMissing,
    `${pc.code('renderPage(pageContextInit)')} (https://vike.dev/renderPage) called with ${pc.code(
      `pageContextInit.urlOriginal===${JSON.stringify(urlOriginal)}`
    )} which doesn't start with Base URL ${pc.code(baseServer)} (https://vike.dev/base-url)`
  )
}

function renderInvalidRequest(pageContextInit: { urlOriginal: string }) {
  const urlPathnameWithBase = parseUrl(pageContextInit.urlOriginal, '/').pathname
  assertIsNotViteRequest(urlPathnameWithBase, pageContextInit.urlOriginal)
  if (urlPathnameWithBase.endsWith('/favicon.ico')) return getPageContextHttpResponseFavicon404(pageContextInit)
  return null
}

function renderInvalidVikeConfig(err: unknown, pageContextInit: { urlOriginal: string }, httpRequestId: number) {
  logRuntimeInfo?.(pc.bold(pc.red('Error while loading a Vike config file, see error above.')), httpRequestId, 'error')
  const pageContextWithError = getPageContextHttpResponseError(err, pageContextInit, null)
  return pageContextWithError
}
