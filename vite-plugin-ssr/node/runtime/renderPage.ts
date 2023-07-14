export { renderPage }
export { renderPage_addWrapper }

import {
  getRenderContext,
  initPageContext,
  RenderContext,
  renderPageAlreadyRouted
} from './renderPage/renderPageAlreadyRouted'
import { route } from '../../shared/route'
import { getErrorPageId } from '../../shared/error-page'
import {
  assert,
  hasProp,
  objectAssign,
  isParsable,
  parseUrl,
  assertEnv,
  assertWarning,
  getGlobalObject,
  checkType
} from './utils'
import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import {
  AbortError,
  getPageContextFromAllRewrites,
  isAbortError,
  logAbortErrorHandled,
  PageContextFromRewrite
} from '../../shared/route/RenderAbort'
import { getGlobalContext, initGlobalContext } from './globalContext'
import { handlePageContextRequestUrl } from './renderPage/handlePageContextRequestUrl'
import type { HttpResponse } from './renderPage/createHttpResponseObject'
import { logRuntimeError, logRuntimeInfo } from './renderPage/loggerRuntime'
import { isNewError } from './renderPage/isNewError'
import { assertArguments } from './renderPage/assertArguments'
import type { PageContextDebug } from './renderPage/debugPageFiles'
import { warnMissingErrorPage } from './renderPage/handleErrorWithoutErrorPage'
import { log404 } from './renderPage/log404'
import { isConfigInvalid } from './renderPage/isConfigInvalid'
import pc from '@brillout/picocolors'
import '../../utils/require-shim' // Ensure require shim for production
import type { PageContextBuiltIn } from '../../types'

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

// `renderPage()` calls `renderPageAttempt()` while ensuring that errors are `console.error(err)` instead of `throw err`, so that `vite-plugin-ssr` never triggers a server shut down. (Throwing an error in an Express.js middleware shuts down the whole Express.js server.)
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

  return await renderPageAlreadyPrepared(pageContextInit, httpRequestId, renderContext, [])
}

async function renderPageAlreadyPrepared(
  pageContextInit: { urlOriginal: string } & Record<string, unknown>,
  httpRequestId: number,
  renderContext: RenderContext,
  pageContextsFromRewrite: PageContextFromRewrite[]
): Promise<PageContextAfterRender> {
  // TODO: Rename FirstAttempt => NominalPage
  let pageContextFirstAttemptSuccess: undefined | Awaited<ReturnType<typeof renderPageAttempt>>
  let pageContextFirstAttemptInit = {}
  {
    const pageContextFromAllRewrites = getPageContextFromAllRewrites(pageContextsFromRewrite)
    objectAssign(pageContextFirstAttemptInit, pageContextFromAllRewrites)
  }
  let errFirstAttempt: unknown
  {
    try {
      pageContextFirstAttemptSuccess = await renderPageAttempt(
        pageContextInit,
        pageContextFirstAttemptInit,
        renderContext,
        httpRequestId
      )
    } catch (err) {
      errFirstAttempt = err
      assert(errFirstAttempt)
      logRuntimeError(errFirstAttempt, httpRequestId)
    }
    if (!errFirstAttempt) {
      assert(pageContextFirstAttemptSuccess === pageContextFirstAttemptInit)
    }
  }

  {
    const isFailure =
      (!pageContextFirstAttemptSuccess && !isAbortError(errFirstAttempt)) ||
      (pageContextFirstAttemptSuccess && pageContextFirstAttemptSuccess.httpResponse?.statusCode !== 200)
    const noErrorPageDefined: boolean = !getErrorPageId(renderContext.pageFilesAll, renderContext.pageConfigs)

    // Warn no error page defined
    if (noErrorPageDefined && isFailure) {
      const isV1 = renderContext.pageConfigs.length > 0
      assert(!pageContextFirstAttemptSuccess?.httpResponse)
      warnMissingErrorPage(isV1)
    }

    // Log upon 404
    if (
      !!pageContextFirstAttemptSuccess &&
      'is404' in pageContextFirstAttemptSuccess &&
      pageContextFirstAttemptSuccess.is404 === true
    ) {
      await log404(pageContextFirstAttemptSuccess)
      const statusCode = pageContextFirstAttemptSuccess.httpResponse?.statusCode ?? null
      assert(statusCode === 404 || (noErrorPageDefined && statusCode === null))
    }
  }

  if (errFirstAttempt === undefined) {
    assert(pageContextFirstAttemptSuccess)
    return pageContextFirstAttemptSuccess
  } else {
    assert(errFirstAttempt)
    assert(pageContextFirstAttemptSuccess === undefined)
    assert(pageContextFirstAttemptInit)
    assert(hasProp(pageContextFirstAttemptInit, 'urlOriginal', 'string'))

    let pageContextFromRenderAbort: null | Record<string, unknown> = null
    if (isAbortError(errFirstAttempt)) {
      const handled = await handleAbortError(
        errFirstAttempt,
        pageContextsFromRewrite,
        pageContextInit,
        pageContextFirstAttemptInit,
        httpRequestId,
        renderContext
      )
      // `throw redirect()` and `throw renderUrl()`
      if (handled.pageContextReturn) {
        return handled.pageContextReturn
      }
      // throw renderErrorPage()
      pageContextFromRenderAbort = handled.pageContextAddition
    }

    let pageContextErrorPage: undefined | Awaited<ReturnType<typeof renderPageErrorPage>>
    try {
      pageContextErrorPage = await renderPageErrorPage(
        pageContextInit,
        errFirstAttempt,
        pageContextFirstAttemptInit,
        renderContext,
        httpRequestId,
        pageContextFromRenderAbort
      )
    } catch (errErrorPage) {
      if (isAbortError(errErrorPage)) {
        const handled = await handleAbortError(
          errErrorPage,
          pageContextsFromRewrite,
          pageContextInit,
          pageContextFirstAttemptInit,
          httpRequestId,
          renderContext
        )
        // throw renderErrorPage()
        if (!handled.pageContextReturn) {
          const abortCall = pc.cyan(errErrorPage._pageContextAddition._abortCall)
          const abortCaller = pc.cyan(`throw ${errErrorPage._pageContextAddition._abortCaller}()`)
          assertWarning(
            false,
            `Failed to render error page because ${abortCall} was called: make sure ${abortCaller} doesn't occur while the error page is being rendered.`,
            { onlyOnce: false }
          )
          const pageContextHttpReponseNull = getPageContextHttpResponseNullWithError(errFirstAttempt, pageContextInit)
          return pageContextHttpReponseNull
        }
        // `throw redirect()` and `throw renderUrl()`
        return handled.pageContextReturn
      }
      if (isNewError(errErrorPage, errFirstAttempt)) {
        logRuntimeError(errErrorPage, httpRequestId)
      }
      const pageContextHttpReponseNull = getPageContextHttpResponseNullWithError(errFirstAttempt, pageContextInit)
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
  const color = (s: number | string) => pc.bold(statusCode !== 200 ? pc.red(s) : pc.green(s))
  logRuntimeInfo?.(
    `HTTP response ${urlToShowToUser} ${color(statusCode ?? 'ERR')}`,
    httpRequestId,
    statusCode === 200 || statusCode === 404 ? 'info' : 'error'
  )
}

function getPageContextHttpResponseNullWithError(err: unknown, pageContextInit: { urlOriginal: string }) {
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
function getPageContextHttpResponseRedirect(pageContextInit: { urlOriginal: string }) {
  // TODO
  return getPageContextHttpResponseNull(pageContextInit)
}

async function renderPageAttempt(
  pageContextInit: { urlOriginal: string },
  pageContext: { urlRewrite: null | string },
  renderContext: RenderContext,
  httpRequestId: number
) {
  {
    objectAssign(pageContext, { _httpRequestId: httpRequestId })
  }
  {
    const pageContextInitAddendum = initPageContext(pageContextInit, renderContext)
    objectAssign(pageContext, pageContextInitAddendum)
  }
  {
    const pageContextAddendum = handleUrl(pageContext.urlOriginal, pageContext._baseServer, pageContext.urlRewrite)
    objectAssign(pageContext, pageContextAddendum)
  }
  if (!pageContext._hasBaseServer) {
    objectAssign(pageContext, { httpResponse: null, errorWhileRendering: null })
    return pageContext
  }

  addComputedUrlProps(pageContext)

  // *** Route ***
  const routeResult = await route(pageContext)
  objectAssign(pageContext, routeResult.pageContextAddendum)
  const is404 = hasProp(pageContext, '_pageId', 'string') ? null : true
  objectAssign(pageContext, { is404 })

  objectAssign(pageContext, { errorWhileRendering: null })
  const pageContextAfterRender = await renderPageAlreadyRouted(pageContext)
  assert(pageContext === pageContextAfterRender)
  return pageContextAfterRender
}

async function renderPageErrorPage(
  pageContextInit: { urlOriginal: string },
  errFirstAttempt: unknown,
  pageContextFirstAttemptPartial: Record<string, unknown>,
  renderContext: RenderContext,
  httpRequestId: number,
  pageContextFromRenderAbort: null | Record<string, unknown>
): Promise<PageContextAfterRender> {
  const pageContext = {
    _httpRequestId: httpRequestId
  }
  {
    const pageContextInitAddendum = initPageContext(pageContextInit, renderContext)
    objectAssign(pageContext, pageContextInitAddendum)
  }
  {
    const pageContextAddendum = handleUrl(pageContext.urlOriginal, pageContext._baseServer, null)
    objectAssign(pageContext, pageContextAddendum)
  }

  assert(errFirstAttempt)
  objectAssign(pageContext, {
    is404: false,
    _pageId: null,
    errorWhileRendering: errFirstAttempt as Error,
    routeParams: {} as Record<string, string>
  })

  addComputedUrlProps(pageContext)

  if (pageContextFromRenderAbort) {
    Object.assign(pageContext, pageContextFromRenderAbort)
  }

  objectAssign(pageContext, {
    _routeMatches: (pageContextFirstAttemptPartial as PageContextDebug)._routeMatches || 'ROUTE_ERROR'
  })

  assert(pageContext.errorWhileRendering)
  return renderPageAlreadyRouted(pageContext)
}

function handleUrl(
  urlOriginal: string,
  baseServer: string,
  urlRewrite: string | null
): {
  isClientSideNavigation: boolean
  _hasBaseServer: boolean
  _urlHandler: (urlOriginal: string) => string
} {
  assert(isUrlValid(urlOriginal))
  assert(urlRewrite === null || isUrlValid(urlRewrite))
  const { urlWithoutPageContextRequestSuffix, isPageContextRequest } = handlePageContextRequestUrl(urlOriginal)
  const hasBaseServer = parseUrl(urlWithoutPageContextRequestSuffix, baseServer).hasBaseServer || !!urlRewrite
  const pageContextAddendum = {
    isClientSideNavigation: isPageContextRequest,
    _hasBaseServer: hasBaseServer,
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

async function handleAbortError(
  errAbort: AbortError,
  pageContextsFromRewrite: PageContextFromRewrite[],
  pageContextInit: { urlOriginal: string },
  pageContextFirstAttemptInit: { urlOriginal: string; urlRewrite: null | string } & Record<string, unknown>,
  httpRequestId: number,
  renderContext: RenderContext
): Promise<
  | { pageContextReturn: PageContextAfterRender; pageContextAddition?: never }
  | { pageContextReturn?: never; pageContextAddition: Record<string, unknown> }
> {
  logAbortErrorHandled(errAbort, getGlobalContext().isProduction, pageContextFirstAttemptInit)

  const pageContextAddition = errAbort._pageContextAddition

  if (pageContextAddition._abortCaller === 'renderUrl') {
    const pageContextReturn = await renderPageAlreadyPrepared(pageContextInit, httpRequestId, renderContext, [
      ...pageContextsFromRewrite,
      pageContextAddition
    ])
    Object.assign(pageContextReturn, pageContextAddition)
    return { pageContextReturn }
  }
  if (pageContextAddition._abortCaller === 'redirect') {
    const pageContextReturn = getPageContextHttpResponseRedirect(pageContextInit)
    Object.assign(pageContextReturn, pageContextAddition)
    return { pageContextReturn }
  }
  if (pageContextAddition._abortCaller === 'renderErrorPage') {
    return { pageContextAddition }
  }

  assert(false)
}
