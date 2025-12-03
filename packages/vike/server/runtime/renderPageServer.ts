export { renderPageServer }
export type { PageContextInit }
export type { PageContextBegin }

import { renderPageServerAfterRoute } from './renderPageServer/renderPageServerAfterRoute.js'
import {
  createPageContextServerSide,
  createPageContextServerSideWithoutGlobalContext,
} from './renderPageServer/createPageContextServerSide.js'
import { route } from '../../shared-server-client/route/index.js'
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
  getUrlPretty,
  updateType,
  catchInfiniteLoop,
  isSameErrorMessage,
} from '../utils.js'
import {
  ErrorAbort,
  getPageContextAddendumAbort,
  isAbortError,
  logAbort,
  type PageContextAborted,
  addNewPageContextAborted,
} from '../../shared-server-client/route/abort.js'
import {
  getGlobalContextServerInternal,
  initGlobalContext_renderPage,
  type GlobalContextServerInternal,
} from './globalContext.js'
import { handlePageContextRequestUrl } from './renderPageServer/handlePageContextRequestUrl.js'
import {
  type HttpResponse,
  createHttpResponse404,
  createHttpResponseRedirect,
  createHttpResponsePageContextJson,
  createHttpResponseErrorFallback,
  createHttpResponseErrorFallback_noGlobalContext,
  createHttpResponseBaseIsMissing,
} from './renderPageServer/createHttpResponse.js'
import { logRuntimeError, logRuntimeInfo, type PageContext_logRuntime } from './loggerRuntime.js'
import { assertArguments } from './renderPageServer/assertArguments.js'
import { log404 } from './renderPageServer/log404/index.js'
import pc from '@brillout/picocolors'
import type { PageContextServer } from '../../types/index.js'
import {
  getPageContextClientSerializedAbort,
  getPageContextClientSerialized,
} from './renderPageServer/html/serializeContext.js'
import { getErrorPageId } from '../../shared-server-client/error-page.js'
import { handleErrorWithoutErrorPage } from './renderPageServer/handleErrorWithoutErrorPage.js'
import {
  loadPageConfigsLazyServerSide,
  type PageContext_loadPageConfigsLazyServerSide,
} from './renderPageServer/loadPageConfigsLazyServerSide.js'
import { resolveRedirects } from './renderPageServer/resolveRedirects.js'
import type { PageContextInternalServer } from '../../types/PageContext.js'
import { getVikeConfigError } from '../../shared-server-node/getVikeConfigError.js'
import { forkPageContext } from '../../shared-server-client/forkPageContext.js'
import { getAsyncLocalStorage, type AsyncStore } from './asyncHook.js'

const globalObject = getGlobalObject('runtime/renderPageServer.ts', {
  httpRequestsCount: 0,
})

type PageContextAfterRender = {
  httpResponse: HttpResponse
  _httpRequestId: null | number
} & Partial<PageContextInternalServer>
type PageContextInit = Pick<PageContextInternalServer, 'urlOriginal' | 'headersOriginal'> & {
  /** @deprecated Set `pageContextInit.urlOriginal` instead  */ // TO-DO/next-major-release: remove
  url?: string
  /** @deprecated Set pageContextInit.headersOriginal instead */ // TO-DO/next-major-release: remove
  headers?: Record<string, string>
}
type PageContextBegin = ReturnType<typeof getPageContextBegin>

// `renderPageServer()` calls `renderPageServerNominal()` while ensuring that errors are `console.error(err)` instead of `throw err`, so that Vike never triggers a server shut down. (Throwing an error in an Express.js middleware shuts down the whole Express.js server.)
async function renderPageServer<PageContextUserAdded extends {}, PageContextInitUser extends PageContextInit>(
  pageContextInit: PageContextInitUser,
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
  logHttpRequest(urlOriginalPretty, pageContextInit, httpRequestId)

  const asyncStore: AsyncStore = { httpRequestId }
  const asyncLocalStorage = await getAsyncLocalStorage()
  const pageContextFinish = asyncLocalStorage
    ? await asyncLocalStorage.run(asyncStore, () =>
        renderPageServerEntryOnce(pageContextInit, httpRequestId, asyncStore),
      )
    : await renderPageServerEntryOnce(pageContextInit, httpRequestId, null)

  logHttpResponse(urlOriginalPretty, pageContextFinish)

  checkType<PageContextAfterRender>(pageContextFinish)
  assert(pageContextFinish.httpResponse)
  return pageContextFinish as any
}

async function renderPageServerEntryOnce(
  pageContextInit: PageContextInit,
  httpRequestId: number,
  asyncStore: AsyncStore,
): Promise<PageContextAfterRender> {
  // Invalid config
  {
    const vikeConfigError = getVikeConfigError()
    if (vikeConfigError) {
      return getPageContextInvalidVikeConfig(vikeConfigError.err, pageContextInit, httpRequestId)
    }
  }

  // Prepare context
  try {
    await initGlobalContext_renderPage()
  } catch (err) {
    // Errors are expected:
    // - assertUsage() such as:
    //   ```bash
    //   Re-build your app (you're using 1.2.3 but your app was built with 1.2.2)
    //   ```
    // - initGlobalContext_renderPage() depends on +onCreateGlobalContext hooks
    assert(!isAbortError(err))
    const pageContext_logRuntime = getPageContext_logRuntimeEarly(pageContextInit, httpRequestId)
    logRuntimeError(err, pageContext_logRuntime)
    const pageContextHttpErrorFallback = getPageContextHttpErrorFallback_noGlobalContext(
      err,
      pageContextInit,
      httpRequestId,
    )
    return pageContextHttpErrorFallback
  }
  {
    const vikeConfigError = getVikeConfigError()
    if (vikeConfigError) {
      return getPageContextInvalidVikeConfig(vikeConfigError.err, pageContextInit, httpRequestId)
    } else {
      // `globalContext` now contains the entire Vike config and getVikeConfig() isn't called anymore for this request.
    }
  }
  const { globalContext } = await getGlobalContextServerInternal()

  const pageContextBegin = getPageContextBegin(pageContextInit, globalContext, httpRequestId, asyncStore)

  // Check Base URL
  {
    const pageContextHttpResponse = await checkBaseUrl(pageContextBegin, globalContext)
    if (pageContextHttpResponse) return pageContextHttpResponse
  }

  // Normalize URL
  {
    const pageContextHttpResponse = await normalizeUrl(pageContextBegin, globalContext)
    if (pageContextHttpResponse) return pageContextHttpResponse
  }

  // Permanent redirects (HTTP status code `301`)
  {
    const pageContextHttpResponse = await getPermanentRedirect(pageContextBegin, globalContext)
    if (pageContextHttpResponse) return pageContextHttpResponse
  }

  // First renderPageServerEntryRecursive() call
  return await renderPageServerEntryRecursive(pageContextBegin, globalContext, httpRequestId)
}

async function renderPageServerEntryRecursive(
  pageContextBegin: PageContextBegin,
  globalContext: GlobalContextServerInternal,
  httpRequestId: number,
): Promise<PageContextAfterRender> {
  catchInfiniteLoop('renderPageServerEntryRecursive()')

  const pageContextNominalPageBegin = fork(pageContextBegin)

  const pageContextAddendumAbort = getPageContextAddendumAbort(pageContextBegin.pageContextsAborted)
  objectAssign(pageContextNominalPageBegin, pageContextAddendumAbort)
  objectAssign(pageContextNominalPageBegin, { errorWhileRendering: null })

  const onError = async (err: unknown) => {
    assert(err)
    assert(pageContextNominalPageSuccess === undefined)
    logRuntimeError(err, pageContextNominalPageBegin)
    return await renderPageServerEntryRecursive_onError(
      err,
      pageContextBegin,
      pageContextNominalPageBegin,
      globalContext,
      httpRequestId,
    )
  }

  // Route
  let pageContextFromRoute: Awaited<ReturnType<typeof route>>
  try {
    pageContextFromRoute = await route(pageContextNominalPageBegin)
  } catch (err) {
    return await onError(err)
  }
  objectAssign(pageContextNominalPageBegin, pageContextFromRoute)
  if (pageContextNominalPageBegin.pageId !== null) {
    assert(pageContextNominalPageBegin.pageId)
    objectAssign(pageContextNominalPageBegin, { is404: null })
  } else {
    objectAssign(pageContextNominalPageBegin, { is404: true })
    log404(pageContextNominalPageBegin)
    const errorPageId = getErrorPageId(
      pageContextNominalPageBegin._globalContext._pageFilesAll,
      pageContextNominalPageBegin._globalContext._pageConfigs,
    )
    if (!errorPageId) {
      assert(hasProp(pageContextNominalPageBegin, 'pageId', 'null')) // Help TS
      return await handleErrorWithoutErrorPage(pageContextNominalPageBegin)
    }
    objectAssign(pageContextNominalPageBegin, { pageId: errorPageId })
  }
  assert(hasProp(pageContextNominalPageBegin, 'pageId', 'string'))
  assert(pageContextNominalPageBegin.errorWhileRendering === null)

  // - Render page (nominal, i.e. not the error page)
  // - Render 404 page
  // (`var` instead of `let` because of assert() above that can be called before reaching this line https://stackoverflow.com/a/11444416/270274)
  var pageContextNominalPageSuccess: Awaited<ReturnType<typeof renderPageServerAfterRoute>>
  try {
    pageContextNominalPageSuccess = await renderPageServerAfterRoute(pageContextNominalPageBegin)
  } catch (err) {
    return await onError(err)
  }
  assert(pageContextNominalPageBegin === (pageContextNominalPageSuccess as any))
  return pageContextNominalPageSuccess
}

// When the normal page threw an error
// - Can be a URL rewrite upon `throw render('/some-url')`
// - Can be rendering the error page
// - Can be rendering Vike's generic error page (if no error page is defined, or if the error page throws an error)
async function renderPageServerEntryRecursive_onError(
  err: unknown,
  pageContextBegin: PageContextBegin,
  pageContextNominalPageBegin: PageContextBegin,
  globalContext: GlobalContextServerInternal,
  httpRequestId: number,
) {
  assert(pageContextNominalPageBegin)
  assert(hasProp(pageContextNominalPageBegin, 'urlOriginal', 'string'))
  assert(err)

  const pageContextErrorPageInit = fork(pageContextBegin)
  objectAssign(pageContextErrorPageInit, {
    is404: false,
    errorWhileRendering: err as Error,
    routeParams: {} as Record<string, string>,
  })

  // Handle `throw redirect()` and `throw render()` while rendering nominal page
  if (isAbortError(err)) {
    const handled = await handleAbort(
      err,
      pageContextBegin,
      pageContextNominalPageBegin,
      httpRequestId,
      pageContextErrorPageInit,
      globalContext,
    )
    if (handled.pageContextReturn) {
      // - throw redirect()
      // - throw render(url)
      // - throw render(abortStatusCode) if pageContext.json request
      return handled.pageContextReturn
    } else {
      // - throw render(abortStatusCode) if not pageContext.json request
      objectAssign(pageContextErrorPageInit, handled.pageContextAbort)
    }
  }

  {
    const errorPageId = getErrorPageId(globalContext._pageFilesAll, globalContext._pageConfigs)
    if (!errorPageId) {
      objectAssign(pageContextErrorPageInit, { pageId: null })
      return await handleErrorWithoutErrorPage(pageContextErrorPageInit)
    }
    objectAssign(pageContextErrorPageInit, { pageId: errorPageId })
  }

  let pageContextErrorPage: undefined | Awaited<ReturnType<typeof renderPageServerAfterRoute>>
  try {
    pageContextErrorPage = await renderPageServerAfterRoute(pageContextErrorPageInit)
  } catch (errErrorPage) {
    // Handle `throw redirect()` and `throw render()` while rendering error page
    if (isAbortError(errErrorPage)) {
      const handled = await handleAbort(
        errErrorPage,
        pageContextBegin,
        pageContextNominalPageBegin,
        httpRequestId,
        pageContextErrorPageInit,
        globalContext,
      )
      if (handled.pageContextReturn) {
        // - throw redirect()
        // - throw render(url)
        return handled.pageContextReturn
      } else {
        // - throw render(abortStatusCode)
        const pageContextAbort = errErrorPage._pageContextAbort
        assertWarning(
          false,
          `Failed to render error page because ${pc.cyan(pageContextAbort._abortCall)} was called: make sure ${pc.cyan(
            pageContextAbort._abortCaller,
          )} doesn't occur while the error page is being rendered.`,
          { onlyOnce: false },
        )
        const pageContextHttpErrorFallback = getPageContextHttpErrorFallback(err, pageContextBegin)
        return pageContextHttpErrorFallback
      }
    }
    if (isSameErrorMessage(errErrorPage, err)) {
      logRuntimeError(errErrorPage, pageContextErrorPageInit)
    }
    const pageContextHttpErrorFallback = getPageContextHttpErrorFallback(err, pageContextBegin)
    return pageContextHttpErrorFallback
  }
  return pageContextErrorPage
}

function logHttpRequest(urlOriginal: string, pageContextInit: PageContextInit, httpRequestId: number) {
  const pageContext_logRuntime = getPageContext_logRuntimeEarly(pageContextInit, httpRequestId)
  logRuntimeInfo?.(getRequestInfoMessage(urlOriginal), pageContext_logRuntime, 'info')
}
function getRequestInfoMessage(urlOriginal: string) {
  return `HTTP request: ${prettyUrl(urlOriginal)}`
}
function logHttpResponse(urlOriginalPretty: string, pageContextReturn: PageContextAfterRender) {
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
      // Erroneous value (it should sometimes be `false`) but it's fine as it doesn't seem to have much of an impact.
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
  logRuntimeInfo?.(msg, pageContextReturn, isNominal ? 'info' : 'error')
}
function prettyUrl(url: string) {
  try {
    url = decodeURI(url)
  } catch {
    // https://github.com/vikejs/vike/pull/2367#issuecomment-2800967564
  }
  return pc.bold(url)
}

function getPageContextHttpErrorFallback(err: unknown, pageContextBegin: PageContextBegin) {
  const pageContextHttpErrorFallback = fork(pageContextBegin)
  const httpResponse = createHttpResponseErrorFallback(pageContextBegin)
  objectAssign(pageContextHttpErrorFallback, {
    httpResponse,
    errorWhileRendering: err,
  })
  return pageContextHttpErrorFallback
}
function getPageContextHttpErrorFallback_noGlobalContext(
  err: unknown,
  pageContextInit: PageContextInit,
  httpRequestId: number,
): PageContextAfterRender {
  const pageContextHttpErrorFallback = createPageContextServerSideWithoutGlobalContext(pageContextInit, httpRequestId)
  const httpResponse = createHttpResponseErrorFallback_noGlobalContext()
  objectAssign(pageContextHttpErrorFallback, {
    httpResponse,
    errorWhileRendering: err,
  })
  return pageContextHttpErrorFallback
}

function getPageContextBegin(
  pageContextInit: PageContextInit,
  globalContext: GlobalContextServerInternal,
  httpRequestId: number,
  asyncStore: AsyncStore,
) {
  const { isClientSideNavigation, _urlHandler, _isPageContextJsonRequest } = handlePageContextUrl(
    pageContextInit.urlOriginal,
  )
  const pageContextBegin = createPageContextServerSide(pageContextInit, globalContext, {
    isPrerendering: false,
    ssr: {
      urlHandler: _urlHandler,
      isClientSideNavigation,
    },
    httpRequestId,
  })
  objectAssign(pageContextBegin, {
    _httpRequestId: httpRequestId,
    _asyncStore: asyncStore,
    _isPageContextJsonRequest,
    // This array is shared between all pageContext objects, i.e. the following is true for any `i` and `j` index:
    // ```js
    // const pageContextsAborted_i = pageContextsAborted[i].pageContextsAborted
    // const pageContextsAborted_j = pageContextsAborted[j].pageContextsAborted
    // assert(pageContextsAborted_i === pageContextsAborted_j)
    // ```
    pageContextsAborted: [] as PageContextAborted[],
  })
  return pageContextBegin
}

function handlePageContextUrl(urlOriginal: string) {
  const { isPageContextJsonRequest } = handlePageContextRequestUrl(urlOriginal)
  return {
    isClientSideNavigation: !!isPageContextJsonRequest,
    _isPageContextJsonRequest: isPageContextJsonRequest,
    _urlHandler: (url: string) => handlePageContextRequestUrl(url).urlWithoutPageContextRequestSuffix,
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
      `pageContextInit.urlOriginal===${JSON.stringify(urlOriginal)}`,
    )} which isn't a valid URL.`,
  )
}
function assertIsNotViteRequest(urlPathname: string, urlOriginal: string) {
  const isViteRequest =
    urlPathname.startsWith('/@vite/client') || urlPathname.startsWith('/@fs/') || urlPathname.startsWith('/__vite_ping')
  if (!isViteRequest) return
  assertUsage(
    false,
    `${pc.code('renderPage(pageContextInit)')} called with ${pc.code(
      `pageContextInit.urlOriginal===${JSON.stringify(urlOriginal)}`,
    )} which is unexpected because the URL ${pc.bold(urlOriginal)} should have already been handled by the development middleware: make sure the ${pc.cyan('createDevMiddleware()')} middleware is executed *before* the ${pc.cyan('renderPage()')} middleware, see ${pc.underline('https://vike.dev/renderPage')}`,
  )
}

async function normalizeUrl(pageContextBegin: PageContextBegin, globalContext: GlobalContextServerInternal) {
  const pageContext = fork(pageContextBegin)
  const { trailingSlash, disableUrlNormalization } = globalContext.config
  if (disableUrlNormalization) return null
  const { urlOriginal } = pageContext
  const { isPageContextJsonRequest } = handlePageContextRequestUrl(urlOriginal)
  if (isPageContextJsonRequest) return null
  const urlNormalized = normalizeUrlPathname(urlOriginal, trailingSlash ?? false, globalContext.baseServer)
  if (!urlNormalized) return null
  logRuntimeInfo?.(
    `URL normalized from ${pc.cyan(urlOriginal)} to ${pc.cyan(urlNormalized)} (https://vike.dev/url-normalization)`,
    pageContext,
    'info',
  )
  const httpResponse = createHttpResponseRedirect({ url: urlNormalized, statusCode: 301 }, pageContext)
  objectAssign(pageContext, { httpResponse })
  return pageContext
}

async function getPermanentRedirect(
  pageContextBegin: PageContextBegin,
  globalContext: GlobalContextServerInternal,
) {
  const pageContext = fork(pageContextBegin)
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
    pageContext,
    'info',
  )
  const httpResponse = createHttpResponseRedirect({ url: urlTarget, statusCode: 301 }, pageContext)
  objectAssign(pageContext, { httpResponse })
  return pageContext
}
function normalize(url: string) {
  return url || '/'
}

async function handleAbort(
  errAbort: ErrorAbort,
  pageContextBegin: PageContextBegin,
  // handleAbortError() creates a new pageContext object and we don't merge pageContextNominalPageBegin to it: we only use some pageContextNominalPageBegin information.
  pageContextNominalPageBegin: PageContextBegin,
  httpRequestId: number,
  pageContextErrorPageInit: Omit<PageContext_loadPageConfigsLazyServerSide, 'pageId'>,
  globalContext: GlobalContextServerInternal,
) {
  logAbort(errAbort, globalContext._isProduction, pageContextNominalPageBegin)
  const pageContextAbort = errAbort._pageContextAbort
  assert(pageContextAbort)

  addNewPageContextAborted(pageContextBegin.pageContextsAborted, pageContextNominalPageBegin, pageContextAbort)

  const pageContext = fork(pageContextBegin)
  const pageContextAddendumAbort = getPageContextAddendumAbort(pageContextBegin.pageContextsAborted)
  objectAssign(pageContext, pageContextAddendumAbort)
  assert(pageContextAddendumAbort === pageContextAbort)

  // Client-side navigation — [`pageContext.json` request](https://vike.dev/pageContext.json)
  if (pageContextBegin.isClientSideNavigation) {
    let pageContextSerialized: string
    if (pageContextAbort.abortStatusCode) {
      const errorPageId = getErrorPageId(globalContext._pageFilesAll, globalContext._pageConfigs)
      const abortCall = pageContextAbort._abortCall
      assert(abortCall)
      assertUsage(
        errorPageId,
        `You called ${pc.cyan(
          abortCall,
        )} but you didn't define an error page, make sure to define one https://vike.dev/error-page`,
      )
      objectAssign(pageContext, { pageId: errorPageId })
      objectAssign(pageContext, pageContextErrorPageInit, true)
      updateType(pageContext, await loadPageConfigsLazyServerSide(pageContext))
      // We include pageContextInit: we don't only serialize pageContextAbort because the error page may need to access pageContextInit
      pageContextSerialized = getPageContextClientSerialized(pageContext, false)
    } else {
      pageContextSerialized = getPageContextClientSerializedAbort(pageContextAbort, false)
    }
    const httpResponse = await createHttpResponsePageContextJson(pageContextSerialized)
    objectAssign(pageContext, { httpResponse })
    return { pageContextReturn: pageContext }
  }

  // URL Rewrite — `throw render(url)`
  if (pageContextAbort._urlRewrite) {
    // Recursive renderPageServerEntryRecursive() call
    const pageContextReturn = await renderPageServerEntryRecursive(pageContextBegin, globalContext, httpRequestId)
    return { pageContextReturn }
  }

  // URL Redirection — `throw redirect()`
  if (pageContextAbort._urlRedirect) {
    const httpResponse = createHttpResponseRedirect(pageContextAbort._urlRedirect, pageContextBegin)
    objectAssign(pageContext, { httpResponse })
    return { pageContextReturn: pageContext }
  }

  // Render error page — `throw render(abortStatusCode)` if not pageContext.json request
  assert(pageContextAbort.abortStatusCode)
  return { pageContextAbort }
}

async function checkBaseUrl(pageContextBegin: PageContextBegin, globalContext: GlobalContextServerInternal) {
  const pageContext = fork(pageContextBegin)
  const { baseServer } = globalContext
  const { urlOriginal } = pageContext
  const { isBaseMissing } = parseUrl(urlOriginal, baseServer)
  if (!isBaseMissing) return
  const httpResponse = createHttpResponseBaseIsMissing(urlOriginal, baseServer)
  objectAssign(pageContext, {
    httpResponse,
    isBaseMissing: true as const,
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
    errMsg404 = 'Not supported'
  }
  if (!errMsg404) return
  const pageContext = createPageContextServerSideWithoutGlobalContext(pageContextInit, null)
  const httpResponse = createHttpResponse404(errMsg404)
  objectAssign(pageContext, { httpResponse })
  checkType<PageContextAfterRender>(pageContext)
  return pageContext
}

function getPageContextInvalidVikeConfig(err: unknown, pageContextInit: PageContextInit, httpRequestId: number) {
  const pageContext_logRuntime = getPageContext_logRuntimeEarly(pageContextInit, httpRequestId)
  logRuntimeInfo?.(pc.bold(pc.red('Error loading Vike config — see error above')), pageContext_logRuntime, 'error')
  const pageContextHttpErrorFallback = getPageContextHttpErrorFallback_noGlobalContext(
    err,
    pageContextInit,
    httpRequestId,
  )
  return pageContextHttpErrorFallback
}

/** Use this as last resort — prefer passing richer `pageContext` objects to the runtime logger */
function getPageContext_logRuntimeEarly(
  pageContextInit: PageContextInit,
  httpRequestId: number,
): PageContext_logRuntime {
  const pageContext_logRuntime = {
    ...pageContextInit,
    _httpRequestId: httpRequestId,
  }
  return pageContext_logRuntime
}

function fork<PageContext extends PageContextBegin>(pageContext: PageContext) {
  const pageContextNew = forkPageContext(pageContext)
  if (pageContext._asyncStore) pageContext._asyncStore.pageContext = pageContextNew
  assert(pageContextNew._asyncStore === pageContext._asyncStore)
  return pageContextNew
}
