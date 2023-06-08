export { renderPage }

import { getRenderContext, initPageContext, RenderContext, renderPageContext } from './renderPage/renderPageContext'
import { route } from '../../shared/route'
import { getErrorPageId } from '../../shared/error-page'
import {
  assert,
  hasProp,
  objectAssign,
  isParsable,
  parseUrl,
  assertServerEnv,
  assertWarning,
  getGlobalObject
} from './utils'
import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { isRenderErrorPageException } from '../../shared/route/RenderErrorPage'
import { initGlobalContext } from './globalContext'
import { handlePageContextRequestUrl } from './renderPage/handlePageContextRequestUrl'
import { HttpResponse } from './renderPage/createHttpResponseObject'
import { logError, isNewError } from './renderPage/logger'
import { assertArguments } from './renderPage/assertArguments'
import type { PageContextDebug } from './renderPage/debugPageFiles'
import { warnMissingErrorPage } from './renderPage/handleErrorWithoutErrorPage'
import { log404 } from './renderPage/log404'
import { logInfo } from './renderPage/logger'
import { isConfigInvalid } from './renderPage/isConfigInvalid'
import pc from '@brillout/picocolors'
const globalObject = getGlobalObject('runtime/renderPage.ts', {
  httpRequestsCount: 0,
  pendingRequestsCount: 0
})

// `renderPage()` calls `renderPageAttempt()` while ensuring that errors are `console.error(err)` instead of `throw err`, so that `vite-plugin-ssr` never triggers a server shut down. (Throwing an error in an Express.js middleware shuts down the whole Express.js server.)
async function renderPage<
  PageContextAdded extends {},
  PageContextInit extends {
    /** @deprecated */
    url?: string
    /** The URL of the HTTP request */
    urlOriginal?: string
  }
>(
  pageContextInit: PageContextInit
): Promise<
  PageContextInit & { errorWhileRendering: null | unknown } & (
      | ({ httpResponse: HttpResponse } & PageContextAdded)
      | ({ httpResponse: null } & Partial<PageContextAdded>)
    )
> {
  assertArguments(...arguments)
  assert(hasProp(pageContextInit, 'urlOriginal', 'string'))
  assertServerEnv()

  if (skipRequest(pageContextInit.urlOriginal)) {
    const pageContextHttpReponseNull = getPageContextHttpResponseNull(pageContextInit)
    return pageContextHttpReponseNull
  }

  const httpRequestId = getRequestId()
  const urlToShowToUser = pc.bold(pageContextInit.urlOriginal)
  logHttpRequest(urlToShowToUser, httpRequestId)
  globalObject.pendingRequestsCount++

  const pageContextReturn = await renderPage_(pageContextInit, httpRequestId)

  logHttpResponse(urlToShowToUser, httpRequestId, pageContextReturn)
  globalObject.pendingRequestsCount--

  return pageContextReturn
}

type PageContextReturn = Awaited<ReturnType<typeof renderPage>>

async function renderPage_(
  pageContextInit: { urlOriginal: string } & Record<string, unknown>,
  httpRequestId: number
): Promise<PageContextReturn> {
  // Invalid config
  const handleInvalidConfig = () => {
    logInfo?.(pc.red("Couldn't load configuration: see error above."), getLogCategory(httpRequestId), 'error')
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
    // initGlobalContext() and getRenderContext() don't call any user hooks => err isn't thrown from user code => `canBeViteUserLand: false`
    assert(!isRenderErrorPageException(err))
    logError(err, { httpRequestId, canBeViteUserLand: false })
    const pageContextHttpReponseNull = getPageContextHttpResponseNullWithError(err, pageContextInit)
    return pageContextHttpReponseNull
  }
  if (isConfigInvalid) {
    return handleInvalidConfig()
  } else {
    // From now on, renderContext.pageConfigs contains all the configuration data; getConfigData() isn't called anymore for this request
  }

  // Render page
  let pageContextFirstAttempt: undefined | Awaited<ReturnType<typeof renderPageAttempt>>
  let pageContextFirstAttemptPartial: undefined | Record<string, unknown>
  let errFirstAttempt: unknown
  {
    const pageContext = {}
    let errored: boolean
    try {
      pageContextFirstAttempt = await renderPageAttempt(pageContextInit, pageContext, renderContext, httpRequestId)
      errored = false
    } catch (err) {
      errFirstAttempt = err
      logError(errFirstAttempt, { httpRequestId, canBeViteUserLand: true })
      errored = true
      pageContextFirstAttemptPartial = pageContext
    }
    if (errored) {
      assert(errFirstAttempt)
    } else {
      assert(pageContextFirstAttempt === pageContext)
    }
  }

  // Log 404 info / missing error page warning
  const isFailure = !pageContextFirstAttempt || pageContextFirstAttempt.httpResponse?.statusCode !== 200
  {
    const noErrorPageDefined: boolean = !getErrorPageId(renderContext.pageFilesAll, renderContext.pageConfigs)
    if (noErrorPageDefined && isFailure) {
      const isV1 = renderContext.pageConfigs.length > 0
      assert(!pageContextFirstAttempt?.httpResponse)
      warnMissingErrorPage(isV1)
    }
    if (!!pageContextFirstAttempt && 'is404' in pageContextFirstAttempt && pageContextFirstAttempt.is404 === true) {
      log404(pageContextFirstAttempt)
      const statusCode = pageContextFirstAttempt.httpResponse?.statusCode ?? null
      assert(statusCode === 404 || (noErrorPageDefined && statusCode === null))
    }
  }

  if (errFirstAttempt === undefined) {
    assert(pageContextFirstAttempt)
    return pageContextFirstAttempt
  }

  // Render error page
  if (errFirstAttempt !== undefined) {
    assert(errFirstAttempt)
    assert(pageContextFirstAttempt === undefined)
    assert(pageContextFirstAttemptPartial)
    let pageContextErrorPage: undefined | Awaited<ReturnType<typeof renderErrorPage>>
    let errErrorPage: unknown
    try {
      pageContextErrorPage = await renderErrorPage(
        pageContextInit,
        errFirstAttempt,
        pageContextFirstAttemptPartial,
        renderContext,
        httpRequestId
      )
    } catch (err) {
      errErrorPage = err
      if (isNewError(errErrorPage, errFirstAttempt)) {
        logError(errErrorPage, { httpRequestId, canBeViteUserLand: true })
      }
    }
    if (errErrorPage === undefined) {
      assert(pageContextErrorPage)
      return pageContextErrorPage
    } else {
      assert(errErrorPage)
      assert(pageContextErrorPage === undefined)
      const pageContextHttpReponseNull = getPageContextHttpResponseNullWithError(errFirstAttempt, pageContextInit)
      return pageContextHttpReponseNull
    }
  }

  assert(false)
}

function logHttpRequest(urlToShowToUser: string, httpRequestId: number) {
  logInfo?.(`HTTP request: ${urlToShowToUser}`, getLogCategory(httpRequestId), 'info', {
    clearErrors: globalObject.pendingRequestsCount === 0 && !isConfigInvalid
  })
}
function logHttpResponse(urlToShowToUser: string, httpRequestId: number, pageContextReturn: PageContextReturn) {
  const statusCode = pageContextReturn.httpResponse?.statusCode ?? null
  const color = (s: number | string) => pc.bold(statusCode !== 200 ? pc.red(s) : pc.green(s))
  logInfo?.(
    `HTTP response ${urlToShowToUser} ${color(statusCode ?? 'ERR')}`,
    getLogCategory(httpRequestId),
    statusCode === 200 || statusCode === 404 ? 'info' : 'error'
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
function getPageContextHttpResponseNull(pageContextInit: Record<string, unknown>) {
  const pageContextHttpReponseNull = {}
  objectAssign(pageContextHttpReponseNull, pageContextInit)
  objectAssign(pageContextHttpReponseNull, {
    httpResponse: null,
    errorWhileRendering: null
  })
  return pageContextHttpReponseNull
}

async function renderPageAttempt<PageContextInit extends { urlOriginal: string }>(
  pageContextInit: PageContextInit,
  pageContext: {},
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
    const pageContextAddendum = handleUrl(pageContext)
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
  const pageContextAfterRender = await renderPageContext(pageContext)
  assert(pageContext === pageContextAfterRender)
  return pageContextAfterRender
}

async function renderErrorPage<PageContextInit extends { urlOriginal: string }>(
  pageContextInit: PageContextInit,
  errFirstAttempt: unknown,
  pageContextFirstAttempt: Record<string, unknown>,
  renderContext: RenderContext,
  httpRequestId: number
) {
  const pageContext = {
    _httpRequestId: httpRequestId
  }
  {
    const pageContextInitAddendum = initPageContext(pageContextInit, renderContext)
    objectAssign(pageContext, pageContextInitAddendum)
  }
  {
    const pageContextAddendum = handleUrl(pageContext)
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

  if (isRenderErrorPageException(pageContext.errorWhileRendering)) {
    objectAssign(pageContext, { is404: true })
    objectAssign(pageContext, pageContext.errorWhileRendering.pageContext)
  }

  objectAssign(pageContext, {
    _routeMatches: (pageContextFirstAttempt as PageContextDebug)._routeMatches || 'ROUTE_ERROR'
  })

  assert(pageContext.errorWhileRendering)
  return renderPageContext(pageContext)
}

function handleUrl(pageContext: { urlOriginal: string; _baseServer: string }): {
  isClientSideNavigation: boolean
  _hasBaseServer: boolean
  _urlHandler: (urlOriginal: string) => string
} {
  const { urlOriginal } = pageContext
  assert(urlOriginal.startsWith('/') || urlOriginal.startsWith('http'))
  const { urlWithoutPageContextRequestSuffix, isPageContextRequest } = handlePageContextRequestUrl(urlOriginal)
  const { hasBaseServer } = parseUrl(urlWithoutPageContextRequestSuffix, pageContext._baseServer)
  const pageContextAddendum = {
    isClientSideNavigation: isPageContextRequest,
    _hasBaseServer: hasBaseServer,
    // The onBeforeRoute() hook may modify pageContext.urlOriginal (e.g. for i18n)
    _urlHandler: (urlOriginal: string) => handlePageContextRequestUrl(urlOriginal).urlWithoutPageContextRequestSuffix
  }
  return pageContextAddendum
}

function getLogCategory(httpRequestId: number) {
  return `request(${httpRequestId})` as const
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
    { onlyOnce: true, showStackTrace: false }
  )
  return (
    urlOriginal.endsWith('/__vite_ping') ||
    urlOriginal.endsWith('/favicon.ico') ||
    !isParsable(urlOriginal) ||
    isViteClientRequest
  )
}
