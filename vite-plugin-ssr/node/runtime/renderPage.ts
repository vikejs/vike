export { renderPage }

import {
  getRenderContext,
  initPageContext,
  RenderContext,
  renderPageContext,
  RenderResult
} from './renderPage/renderPageContext'
import { route } from '../../shared/route'
import { assert, hasProp, objectAssign, isParsable, parseUrl } from '../utils'
import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { isRenderErrorPageException } from './renderPage/RenderErrorPage'
import { initGlobalContext } from './globalContext'
import { handlePageContextRequestUrl } from './renderPage/handlePageContextRequestUrl'
import { HttpResponse } from './renderPage/createHttpResponseObject'
import { assertError, logError, isNewError } from './renderPage/logError'
import { assertArguments } from './renderPage/assertArguments'
import type { PageContextDebug } from './renderPage/debugPageFiles'

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

  let renderContext: RenderContext
  try {
    await initGlobalContext()
    renderContext = await getRenderContext()
  } catch (err) {
    logError(err)
    const pageContextErr = getPageContextErr(err, pageContextInit)
    return pageContextErr
  }

  const pageContext = {}
  try {
    return await renderPageAttempt(pageContextInit, pageContext, renderContext)
  } catch (errOriginal) {
    assertError(errOriginal)
    logError(errOriginal)
    try {
      return await renderErrorPage(pageContextInit, errOriginal, pageContext, renderContext)
    } catch (err) {
      if (isNewError(err, errOriginal)) {
        logError(err)
      }
      const pageContextErr = getPageContextErr(errOriginal, pageContextInit)
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

async function renderPageAttempt(
  pageContextInit: { urlOriginal: string },
  pageContext: {},
  renderContext: RenderContext
): Promise<RenderResult> {
  {
    const { urlOriginal } = pageContextInit
    if (urlOriginal.endsWith('/__vite_ping') || urlOriginal.endsWith('/favicon.ico') || !isParsable(urlOriginal)) {
      const pageContext = { ...pageContextInit }
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
  return renderPageContext(pageContext)
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
  _isPageContextRequest: boolean
  _hasBaseServer: boolean
  _urlHandler: (urlOriginal: string) => string
} {
  const { urlOriginal } = pageContext
  assert(urlOriginal.startsWith('/') || urlOriginal.startsWith('http'))
  const { urlWithoutPageContextRequestSuffix, isPageContextRequest } = handlePageContextRequestUrl(urlOriginal)
  const { hasBaseServer } = parseUrl(urlWithoutPageContextRequestSuffix, pageContext._baseServer)
  const pageContextAddendum = {
    _isPageContextRequest: isPageContextRequest,
    _hasBaseServer: hasBaseServer,
    // The onBeforeRoute() hook may modify pageContext.urlOriginal (e.g. for i18n)
    _urlHandler: (urlOriginal: string) => handlePageContextRequestUrl(urlOriginal).urlWithoutPageContextRequestSuffix
  }
  return pageContextAddendum
}
