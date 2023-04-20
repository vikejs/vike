export { renderPage }

import { getRenderContext, initPageContext, RenderContext, renderPageContext } from './renderPage/renderPageContext'
import { route } from '../../shared/route'
import { getErrorPageId } from '../../shared/error-page'
import { assert, hasProp, objectAssign, isParsable, parseUrl, assertServerEnv, assertWarning } from './utils'
import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { isRenderErrorPageException } from '../../shared/route/RenderErrorPage'
import { initGlobalContext } from './globalContext'
import { handlePageContextRequestUrl } from './renderPage/handlePageContextRequestUrl'
import { HttpResponse } from './renderPage/createHttpResponseObject'
import { logErrorWithVite, isNewError, logErrorWithoutVite } from './renderPage/logError'
import { assertArguments } from './renderPage/assertArguments'
import type { PageContextDebug } from './renderPage/debugPageFiles'
import { warnMissingErrorPage } from './renderPage/handleErrorWithoutErrorPage'
import { log404 } from './renderPage/log404'
import { executeOnRenderResult } from './renderPage/onRenderResult'

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

  let renderContext: RenderContext
  try {
    await initGlobalContext()
    renderContext = await getRenderContext()
  } catch (err) {
    // Errors are expected since assertUsage() is used in both initGlobalContext() and getRenderContext().
    // initGlobalContext() and getRenderContext() don't call any user hooks => err isn't thrown from user code => we use logErrorWithoutVite() instead of logErrorWithVite().
    logErrorWithoutVite(err)
    const pageContextErr = getPageContextErr(err, pageContextInit)
    return pageContextErr
  }

  let pageContextOriginal: undefined | Awaited<ReturnType<typeof renderPageAttempt>>
  let pageContextOriginalPartial: undefined | Record<string, unknown>
  let errOriginal: unknown
  {
    const pageContext = {}
    let errored: boolean
    try {
      pageContextOriginal = await renderPageAttempt(pageContextInit, pageContext, renderContext)
      errored = false
    } catch (errOriginal_) {
      errored = true
      errOriginal = errOriginal_
      pageContextOriginalPartial = pageContext
    }
    if (errored) {
      assert(errOriginal)
    } else {
      assert(pageContextOriginal === pageContext)
    }
  }

  const isV1 = renderContext.pageConfigs.length > 0
  const errorPageIsMissing: boolean = !getErrorPageId(renderContext.pageFilesAll, renderContext.pageConfigs)

  if (errOriginal === undefined) {
    assert(pageContextOriginal)
    const statusCode = pageContextOriginal.httpResponse?.statusCode ?? null
    if (!!pageContextOriginal && 'is404' in pageContextOriginal && pageContextOriginal.is404 === true) {
      assert(
        statusCode === 404 ||
          // No HTTP response if user didn't define an error page
          statusCode === null
      )
      // We call onRenderResult() before any log/warning
      executeOnRenderResult(pageContextInit, true, statusCode)
      if (errorPageIsMissing) {
        assert(pageContextOriginal.httpResponse === null)
        warnMissingErrorPage(isV1)
      }
      log404(pageContextOriginal)
    } else {
      if (pageContextOriginal.httpResponse) {
        assert(statusCode === 200)
        executeOnRenderResult(pageContextInit, false, statusCode)
      } else {
        // Don't call onRenderResult() hook if rendering was skipped (e.g. /favicon.ico HTTP requests, or HTTP requests that don't match the Base URL)
      }
    }
    return pageContextOriginal
  } else {
    assert(errOriginal)
    assert(pageContextOriginal === undefined)
    assert(pageContextOriginalPartial)
    // We call onRenderResult() before any log/warning
    executeOnRenderResult(
      pageContextInit,
      true,
      // We can't determine the status code before actually trying to render the error page (it can be either `null` or `500`)
      null
    )
    if (errorPageIsMissing) {
      warnMissingErrorPage(isV1)
    }
    logErrorWithVite(errOriginal)
    let pageContextErrorPage: undefined | Awaited<ReturnType<typeof renderErrorPage>>
    let errErrorPage: unknown
    try {
      pageContextErrorPage = await renderErrorPage(
        pageContextInit,
        errOriginal,
        pageContextOriginalPartial,
        renderContext
      )
    } catch (errErrorPage_) {
      errErrorPage = errErrorPage_
    }
    if (errErrorPage === undefined) {
      assert(pageContextErrorPage)
      return pageContextErrorPage
    } else {
      assert(errErrorPage)
      assert(pageContextErrorPage === undefined)
      if (isNewError(errErrorPage, errOriginal)) {
        logErrorWithVite(errErrorPage)
      }
      const pageContextErr = getPageContextErr(errOriginal, pageContextInit)
      assert(pageContextErr.httpResponse === null)
      return pageContextErr
    }
  }
}

function getPageContextErr(err: unknown, pageContextInit: Record<string, unknown>) {
  const pageContextErr = {}
  objectAssign(pageContextErr, pageContextInit)
  objectAssign(pageContextErr, {
    httpResponse: null,
    errorWhileRendering: err
  })
  return pageContextErr
}

async function renderPageAttempt<PageContextInit extends { urlOriginal: string }>(
  pageContextInit: PageContextInit,
  pageContext: {},
  renderContext: RenderContext
) {
  {
    const { urlOriginal } = pageContextInit
    const isViteClientRequest = urlOriginal.endsWith('/@vite/client') || urlOriginal.startsWith('/@fs/')
    assertWarning(
      !isViteClientRequest,
      `The vite-plugin-ssr middleware renderPage() was called with the URL ${urlOriginal} which is unexpected because the HTTP request should have already been handled by Vite's development middleware. Make sure to 1. install Vite's development middleware and 2. add Vite's middleware *before* vite-plugin-ssr's middleware. See https://vite-plugin-ssr.com/renderPage`,
      { onlyOnce: true, showStackTrace: false }
    )
    if (
      urlOriginal.endsWith('/__vite_ping') ||
      urlOriginal.endsWith('/favicon.ico') ||
      !isParsable(urlOriginal) ||
      isViteClientRequest
    ) {
      objectAssign(pageContext, pageContextInit)
      objectAssign(pageContext, { httpResponse: null, errorWhileRendering: null })
      return pageContext
    }
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
  errOriginal: unknown,
  pageContextOriginal: Record<string, unknown>,
  renderContext: RenderContext
) {
  const pageContext = {}
  {
    const pageContextInitAddendum = initPageContext(pageContextInit, renderContext)
    objectAssign(pageContext, pageContextInitAddendum)
  }
  {
    const pageContextAddendum = handleUrl(pageContext)
    objectAssign(pageContext, pageContextAddendum)
  }

  assert(errOriginal)
  objectAssign(pageContext, {
    is404: false,
    _pageId: null,
    errorWhileRendering: errOriginal as Error,
    routeParams: {} as Record<string, string>
  })

  addComputedUrlProps(pageContext)

  if (isRenderErrorPageException(pageContext.errorWhileRendering)) {
    objectAssign(pageContext, { is404: true })
    objectAssign(pageContext, pageContext.errorWhileRendering.pageContext)
  }

  objectAssign(pageContext, {
    _routeMatches: (pageContextOriginal as PageContextDebug)._routeMatches || 'ROUTE_ERROR'
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
