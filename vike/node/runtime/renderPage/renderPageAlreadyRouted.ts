export { renderPageAlreadyRouted }
export { prerenderPage }
export type { PageContextAfterRender }

import { getErrorPageId } from '../../../shared/error-page.js'
import { getHtmlString } from '../html/renderHtml.js'
import { assert, assertUsage, hasProp, objectAssign } from '../utils.js'
import { getPageContextClientSerialized } from '../html/serializeContext.js'
import { type PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
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
import type { PageContextCreatedServerSide } from './createPageContextServerSide.js'

type PageContextAfterRender = { httpResponse: HttpResponse; errorWhileRendering: null | Error }

async function renderPageAlreadyRouted<
  PageContext extends {
    pageId: string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
    is404: null | boolean
    routeParams: Record<string, string>
    errorWhileRendering: null | Error
    _httpRequestId: number
  } & PageContextCreatedServerSide &
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
    const pageContextSerialized: string = getPageContextClientSerialized(pageContext)
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
  pageContext: PageContextCreatedServerSide &
    PageFiles & {
      routeParams: Record<string, string>
      pageId: string
      _urlRewrite: null
      _httpRequestId: number | null
      _usesClientRouter: boolean
      _pageContextAlreadyProvidedByOnPrerenderHook?: true
      is404: boolean
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
    const pageContextSerialized = getPageContextClientSerialized(pageContext)
    return { documentHtml, pageContextSerialized, pageContext }
  }
}
