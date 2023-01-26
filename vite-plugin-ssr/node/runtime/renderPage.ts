export { renderPage }

import {
  getRenderContext,
  initPageContext,
  RenderContext,
  renderPageContext,
  RenderResult
} from './renderPage/renderPageContext'
import { route, getErrorPageId } from '../../shared/route'
import { assert, hasProp, objectAssign, isParsable, parseUrl } from '../utils'
import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { isRenderErrorPageException } from './renderPage/RenderErrorPage'
import { initGlobalContext } from './globalContext'
import { handlePageContextRequestUrl } from './renderPage/handlePageContextRequestUrl'
import { HttpResponse } from './renderPage/createHttpResponseObject'
import { logError, isNewError } from './renderPage/logError'
import { assertArguments } from './renderPage/assertArguments'
import type { PageContextDebug } from './renderPage/debugPageFiles'
import { warnMissingErrorPage } from './renderPage/handleErrorWithoutErrorPage'
import { log404 } from './renderPage/log404'

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

  const errorPageIsMissing = !getErrorPageId(renderContext.allPageIds)
  const is404: boolean = !!pageContextOriginal && 'is404' in pageContextOriginal && pageContextOriginal.is404 === true
  const isSkipped: boolean = !!pageContextOriginal && '_skippedRendering' in pageContextOriginal
  // We need to determine the status code early for the onRenderResult() hook
  const statusCode = (() => {
    if (isSkipped) return null
    // We cannot determine the status code early for errors (see comment below)
    if (errOriginal) return null
    if (is404) return errorPageIsMissing ? null : 404
    return 200
  })()
  if (!isSkipped) {
    const onRenderResult = (pageContextInit as Record<string, unknown>)._onRenderResult as undefined | Function
    const isError: boolean = !!errOriginal || is404
    onRenderResult?.(isError, statusCode)
  }

  if (errOriginal === undefined) {
    assert(pageContextOriginal)
    if (is404) {
      if (errorPageIsMissing) {
        assert(pageContextOriginal.httpResponse === null)
        warnMissingErrorPage()
      }
      assert('is404' in pageContextOriginal)
      log404(pageContextOriginal)
    }
    assert((pageContextOriginal.httpResponse?.statusCode ?? null) === statusCode)
    return pageContextOriginal
  } else {
    assert(errOriginal)
    assert(pageContextOriginal === undefined)
    assert(pageContextOriginalPartial)
    assert(statusCode === null) // We can't determine the status code before actually trying to render the error page (it can be either `null` or `500`)
    if (errorPageIsMissing) {
      warnMissingErrorPage()
    }
    logError(errOriginal)
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
        logError(errErrorPage)
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
    if (urlOriginal.endsWith('/__vite_ping') || urlOriginal.endsWith('/favicon.ico') || !isParsable(urlOriginal)) {
      objectAssign(pageContext, pageContextInit)
      objectAssign(pageContext, { httpResponse: null, errorWhileRendering: null, _skippedRendering: true })
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
  assert((pageContext as any as RenderResult) === pageContextAfterRender)
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
