export { renderPage }
export { renderPage_addAsyncHookwrapper }
export type { PageContextInit }
export type { PageContextBegin }

import { renderPageAlreadyRouted } from './renderPage/renderPageAlreadyRouted.js'
import {
  createPageContextServerSide,
  createPageContextServerSideWithoutGlobalContext
} from './renderPage/createPageContextServerSide.js'
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
  isUri,
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
import {
  getGlobalContextServerInternal,
  initGlobalContext_renderPage,
  type GlobalContextServerInternal
} from './globalContext.js'
import { handlePageContextRequestUrl } from './renderPage/handlePageContextRequestUrl.js'
import {
  type HttpResponse,
  createHttpResponse404,
  createHttpResponseRedirect,
  createHttpResponsePageContextJson,
  createHttpResponseError,
  createHttpResponseErrorWithoutGlobalContext,
  createHttpResponseBaseIsMissing
} from './renderPage/createHttpResponse.js'
import { logRuntimeError, logRuntimeInfo } from './renderPage/loggerRuntime.js'
import { isNewError } from './renderPage/isNewError.js'
import { assertArguments } from './renderPage/assertArguments.js'
import type { PageContextDebugRouteMatches } from './renderPage/debugPageFiles.js'
import { log404 } from './renderPage/log404/index.js'
import { isVikeConfigInvalid } from './renderPage/isVikeConfigInvalid.js'
import pc from '@brillout/picocolors'
import type { PageContextServer } from '../../types/index.js'
import { getPageContextClientSerializedAbort, getPageContextClientSerialized } from './html/serializeContext.js'
import { getErrorPageId } from '../../shared/error-page.js'
import { handleErrorWithoutErrorPage } from './renderPage/handleErrorWithoutErrorPage.js'
import { loadPageConfigsLazyServerSide } from './renderPage/loadPageConfigsLazyServerSide.js'
import { resolveRedirects } from './renderPage/resolveRedirects.js'
import type { PageContextInternalServer } from '../../shared/types.js'

const globalObject = getGlobalObject('runtime/renderPage.ts', {
  httpRequestsCount: 0
})

type PageContextAfterRender = { httpResponse: HttpResponse } & Partial<PageContextInternalServer>
type PageContextInit = Pick<PageContextInternalServer, 'urlOriginal' | 'headersOriginal'> & {
  /** @deprecated Set `pageContextInit.urlOriginal` instead  */ // TODO/next-major: remove
  url?: string
  /** @deprecated Set pageContextInit.headersOriginal instead */ // TODO/next-major: remove
  headers?: Record<string, string>
}
type PageContextBegin = Awaited<ReturnType<typeof getPageContextBegin>>

// `renderPage()` calls `renderPageNominal()` while ensuring that errors are `console.error(err)` instead of `throw err`, so that Vike never triggers a server shut down. (Throwing an error in an Express.js middleware shuts down the whole Express.js server.)
async function renderPage<PageContextUserAdded extends {}, PageContextInitUser extends PageContextInit>(
  pageContextInit: PageContextInitUser
): Promise<
  // Partial because rendering may fail at any user hook.
  // - `.pageContext.json` requests may fail while still returning the HTTP response `JSON.stringify({ serverSideError: true })`.
  PageContextInitUser & { httpResponse: HttpResponse } & Partial<PageContextServer & PageContextUserAdded>
> {
  assertArguments(...arguments)
  assert(hasProp(pageContextInit, 'urlOriginal', 'string')) // assertUsage() already implemented at assertArguments()
  assertIsUrl(pageContextInit.urlOriginal)
  onSetupRuntime()
  const pageContextSkipRequest = getPageContextSkipRequest(pageContextInit)
  if (pageContextSkipRequest) return pageContextSkipRequest as any

  const httpRequestId = getRequestId()
  const urlOriginalPretty = getUrlPretty(pageContextInit.urlOriginal)
  logHttpRequest(urlOriginalPretty, httpRequestId)

  const { pageContextReturn } = await asyncHookWrapper(httpRequestId, () =>
    renderPagePrepare(pageContextInit, httpRequestId)
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

async function renderPagePrepare(
  pageContextInit: PageContextInit,
  httpRequestId: number
): Promise<PageContextAfterRender> {
  // Invalid config
  if (
    isVikeConfigInvalid &&
    (true as boolean) // Make TS happy
  ) {
    return getPageContextInvalidVikeConfig(isVikeConfigInvalid.err, pageContextInit, httpRequestId)
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
    const pageContextWithError = getPageContextHttpResponseErrorWithoutGlobalContext(err, pageContextInit)
    return pageContextWithError
  }
  if (isVikeConfigInvalid) {
    return getPageContextInvalidVikeConfig(isVikeConfigInvalid.err, pageContextInit, httpRequestId)
  } else {
    // `globalContext` now contains the entire Vike config and getVikeConfig() isn't called anymore for this request.
  }
  const { globalContext } = await getGlobalContextServerInternal()

  const pageContextBegin = await getPageContextBegin(pageContextInit, globalContext, httpRequestId)

  // Check Base URL
  {
    const pageContextHttpResponse = await checkBaseUrl(pageContextBegin, globalContext)
    if (pageContextHttpResponse) return pageContextHttpResponse
  }

  // Normalize URL
  {
    const pageContextHttpResponse = await normalizeUrl(pageContextBegin, globalContext, httpRequestId)
    if (pageContextHttpResponse) return pageContextHttpResponse
  }

  // Permanent redirects (HTTP status code `301`)
  {
    const pageContextHttpResponse = await getPermanentRedirect(pageContextBegin, globalContext, httpRequestId)
    if (pageContextHttpResponse) return pageContextHttpResponse
  }

  return await renderPageAlreadyPrepared(pageContextBegin, globalContext, httpRequestId, [])
}

async function renderPageAlreadyPrepared(
  pageContextBegin: PageContextBegin,
  globalContext: GlobalContextServerInternal,
  httpRequestId: number,
  pageContextsFromRewrite: PageContextFromRewrite[]
): Promise<PageContextAfterRender> {
  const pageContextNominalPageBegin = forkPageContext(pageContextBegin)
  assertNoInfiniteAbortLoop(
    pageContextsFromRewrite.length,
    // There doesn't seem to be a way to count the number of HTTP redirects (vike don't have access to the HTTP request headers/cookies)
    // https://stackoverflow.com/questions/9683007/detect-infinite-http-redirect-loop-on-server-side
    0
  )
  let pageContextNominalPageSuccess: undefined | Awaited<ReturnType<typeof renderPageNominal>>
  const pageContextFromAllRewrites = getPageContextFromAllRewrites(pageContextsFromRewrite)
  // This is where pageContext._urlRewrite is set
  assert(pageContextFromAllRewrites._urlRewrite === null || typeof pageContextFromAllRewrites._urlRewrite === 'string')
  objectAssign(pageContextNominalPageBegin, pageContextFromAllRewrites)
  let errNominalPage: unknown
  {
    try {
      pageContextNominalPageSuccess = await renderPageNominal(pageContextNominalPageBegin)
    } catch (err) {
      errNominalPage = err
      assert(errNominalPage)
      logRuntimeError(errNominalPage, httpRequestId)
    }
    if (!errNominalPage) {
      assert(pageContextNominalPageSuccess === pageContextNominalPageBegin)
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
    assert(pageContextNominalPageBegin)
    assert(hasProp(pageContextNominalPageBegin, 'urlOriginal', 'string'))

    const pageContextErrorPageInit = await getPageContextErrorPageInit(
      pageContextBegin,
      errNominalPage,
      pageContextNominalPageBegin
    )

    // Handle `throw redirect()` and `throw render()` while rendering nominal page
    if (isAbortError(errNominalPage)) {
      const handled = await handleAbortError(
        errNominalPage,
        pageContextsFromRewrite,
        pageContextBegin,
        pageContextNominalPageBegin,
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
      const errorPageId = getErrorPageId(globalContext._pageFilesAll, globalContext._pageConfigs)
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
          pageContextBegin,
          pageContextNominalPageBegin,
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
          const pageContextHttpWithError = getPageContextHttpResponseError(errNominalPage, pageContextBegin)
          return pageContextHttpWithError
        }
        // `throw redirect()` / `throw render(url)`
        return handled.pageContextReturn
      }
      if (isNewError(errErrorPage, errNominalPage)) {
        logRuntimeError(errErrorPage, httpRequestId)
      }
      const pageContextWithError = getPageContextHttpResponseError(errNominalPage, pageContextBegin)
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
  try {
    url = decodeURI(url)
  } catch {
    // https://github.com/vikejs/vike/pull/2367#issuecomment-2800967564
  }
  return pc.bold(url)
}

function getPageContextHttpResponseError(err: unknown, pageContextBegin: PageContextBegin): PageContextAfterRender {
  const pageContextWithError = forkPageContext(pageContextBegin)
  const httpResponse = createHttpResponseError(pageContextBegin)
  objectAssign(pageContextWithError, {
    httpResponse,
    errorWhileRendering: err
  })
  return pageContextWithError
}
function getPageContextHttpResponseErrorWithoutGlobalContext(
  err: unknown,
  pageContextInit: PageContextInit
): PageContextAfterRender {
  const pageContextWithError = createPageContextServerSideWithoutGlobalContext(pageContextInit)
  const httpResponse = createHttpResponseErrorWithoutGlobalContext()
  objectAssign(pageContextWithError, {
    httpResponse,
    errorWhileRendering: err
  })
  return pageContextWithError
}

async function renderPageNominal(pageContext: PageContextBegin) {
  objectAssign(pageContext, { errorWhileRendering: null })

  // Route
  {
    const pageContextFromRoute = await route(pageContext)
    objectAssign(pageContext, pageContextFromRoute)
    objectAssign(pageContext, { is404: pageContext.pageId ? null : true })
    if (pageContext.pageId === null) {
      const errorPageId = getErrorPageId(
        pageContext._globalContext._pageFilesAll,
        pageContext._globalContext._pageConfigs
      )
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
  pageContextBegin: PageContextBegin,
  errNominalPage: unknown,
  pageContextNominalPagePartial: Record<string, unknown>
) {
  const pageContext = forkPageContext(pageContextBegin)

  assert(errNominalPage)
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

async function getPageContextBegin(
  pageContextInit: PageContextInit,
  globalContext: GlobalContextServerInternal,
  httpRequestId: number
) {
  const { isClientSideNavigation, _urlHandler } = handlePageContextUrl(pageContextInit.urlOriginal)
  const pageContextBegin = await createPageContextServerSide(pageContextInit, globalContext, {
    isPrerendering: false,
    ssr: {
      urlHandler: _urlHandler,
      isClientSideNavigation
    }
  })
  objectAssign(pageContextBegin, { _httpRequestId: httpRequestId })
  return pageContextBegin
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
  pageContextBegin: PageContextBegin,
  globalContext: GlobalContextServerInternal,
  httpRequestId: number
) {
  const pageContext = forkPageContext(pageContextBegin)
  const { trailingSlash, disableUrlNormalization } = globalContext.config
  if (disableUrlNormalization) return null
  const { urlOriginal } = pageContext
  const { isPageContextRequest } = handlePageContextRequestUrl(urlOriginal)
  if (isPageContextRequest) return null
  const urlNormalized = normalizeUrlPathname(urlOriginal, trailingSlash ?? false, globalContext.baseServer)
  if (!urlNormalized) return null
  logRuntimeInfo?.(
    `URL normalized from ${pc.cyan(urlOriginal)} to ${pc.cyan(urlNormalized)} (https://vike.dev/url-normalization)`,
    httpRequestId,
    'info'
  )
  const httpResponse = createHttpResponseRedirect({ url: urlNormalized, statusCode: 301 }, pageContext)
  objectAssign(pageContext, { httpResponse })
  return pageContext
}

async function getPermanentRedirect(
  pageContextBegin: PageContextBegin,
  globalContext: GlobalContextServerInternal,
  httpRequestId: number
) {
  const pageContext = forkPageContext(pageContextBegin)
  const urlWithoutBase = removeBaseServer(pageContext.urlOriginal, globalContext.baseServer)
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
    assert(urlTarget !== pageContext.urlOriginal)
  }
  logRuntimeInfo?.(
    `Permanent redirection defined by config.redirects (https://vike.dev/redirects)`,
    httpRequestId,
    'info'
  )
  const httpResponse = createHttpResponseRedirect({ url: urlTarget, statusCode: 301 }, pageContext)
  objectAssign(pageContext, { httpResponse })
  return pageContext
}
function normalize(url: string) {
  return url || '/'
}

async function handleAbortError(
  errAbort: ErrorAbort,
  pageContextsFromRewrite: PageContextFromRewrite[],
  pageContextBegin: PageContextBegin,
  // handleAbortError() creates a new pageContext object and we don't merge pageContextNominalPageBegin to it: we only use some pageContextNominalPageBegin information.
  pageContextNominalPageBegin: PageContextBegin,
  httpRequestId: number,
  pageContextErrorPageInit: PageContextErrorPageInit,
  globalContext: GlobalContextServerInternal
): Promise<
  | { pageContextReturn: PageContextAfterRender; pageContextAbort?: never }
  | { pageContextReturn?: never; pageContextAbort: Record<string, unknown> }
> {
  logAbortErrorHandled(errAbort, globalContext._isProduction, pageContextNominalPageBegin)

  const pageContextAbort = errAbort._pageContextAbort
  let pageContextSerialized: string
  if (pageContextNominalPageBegin.isClientSideNavigation) {
    if (pageContextAbort.abortStatusCode) {
      const errorPageId = getErrorPageId(globalContext._pageFilesAll, globalContext._pageConfigs)
      const abortCall = pageContextAbort._abortCall
      assert(abortCall)
      assertUsage(
        errorPageId,
        `You called ${pc.cyan(
          abortCall
        )} but you didn't define an error page, make sure to define one https://vike.dev/error-page`
      )
      const pageContext = forkPageContext(pageContextBegin)
      objectAssign(pageContext, { pageId: errorPageId })
      objectAssign(pageContext, pageContextAbort)
      objectAssign(pageContext, pageContextErrorPageInit, true)
      objectAssign(pageContext, await loadPageConfigsLazyServerSide(pageContext))
      // We include pageContextInit: we don't only serialize pageContextAbort because the error page may need to access pageContextInit
      pageContextSerialized = getPageContextClientSerialized(pageContext)
    } else {
      pageContextSerialized = getPageContextClientSerializedAbort(pageContextAbort)
    }
    const httpResponse = await createHttpResponsePageContextJson(pageContextSerialized)
    const pageContextReturn = { httpResponse }
    return { pageContextReturn }
  }

  if (pageContextAbort._urlRewrite) {
    const pageContextReturn = await renderPageAlreadyPrepared(pageContextBegin, globalContext, httpRequestId, [
      ...pageContextsFromRewrite,
      pageContextAbort
    ])
    Object.assign(pageContextReturn, pageContextAbort)
    return { pageContextReturn }
  }
  if (pageContextAbort._urlRedirect) {
    const pageContextReturn = forkPageContext(pageContextBegin)
    objectAssign(pageContextReturn, pageContextAbort)
    const httpResponse = createHttpResponseRedirect(pageContextAbort._urlRedirect, pageContextBegin)
    objectAssign(pageContextReturn, { httpResponse })
    return { pageContextReturn }
  }
  assert(pageContextAbort.abortStatusCode)
  return { pageContextAbort }
}

async function checkBaseUrl(pageContextBegin: PageContextBegin, globalContext: GlobalContextServerInternal) {
  const pageContext = forkPageContext(pageContextBegin)
  const { baseServer } = globalContext
  const { urlOriginal } = pageContext
  const { isBaseMissing } = parseUrl(urlOriginal, baseServer)
  if (!isBaseMissing) return
  const httpResponse = createHttpResponseBaseIsMissing(urlOriginal, baseServer)
  objectAssign(pageContext, {
    httpResponse,
    isBaseMissing: true as const
  })
  checkType<PageContextAfterRender>(pageContext)
  return pageContext
}

function getPageContextSkipRequest(pageContextInit: PageContextInit) {
  const urlPathnameWithBase = parseUrl(pageContextInit.urlOriginal, '/').pathname
  assertIsNotViteRequest(urlPathnameWithBase, pageContextInit.urlOriginal)
  let errMsg404: string | undefined
  if (urlPathnameWithBase.endsWith('/favicon.ico')) {
    errMsg404 = 'No favicon.ico found'
  }
  if (urlPathnameWithBase.endsWith('.well-known/appspecific/com.chrome.devtools.json')) {
    // https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/automatic_workspace_folders.md
    // https://www.reddit.com/r/node/comments/1kcr0wh/odd_request_coming_into_my_localhost_server_from/
    errMsg404 = 'Not spported'
  }
  if (!errMsg404) return
  const pageContext = createPageContextServerSideWithoutGlobalContext(pageContextInit)
  const httpResponse = createHttpResponse404(errMsg404)
  objectAssign(pageContext, { httpResponse })
  checkType<PageContextAfterRender>(pageContext)
  return pageContext
}

function getPageContextInvalidVikeConfig(err: unknown, pageContextInit: PageContextInit, httpRequestId: number) {
  logRuntimeInfo?.(pc.bold(pc.red('Error while loading a Vike config file, see error above.')), httpRequestId, 'error')
  const pageContextWithError = getPageContextHttpResponseErrorWithoutGlobalContext(err, pageContextInit)
  return pageContextWithError
}

// Create pageContext forks to avoid leaks: upon an error (bug or abort) a brand new pageContext object is created, in order to avoid previous pageContext modifications that are now obsolete to leak to the new pageContext object.
function forkPageContext(pageContextBegin: PageContextBegin) {
  const pageContext = {}
  objectAssign(pageContext, pageContextBegin, true)
  return pageContext
}
