export { renderPageAlreadyRouted }
export { prerenderPage }
export { prerender404Page }
export { getPageContextInitEnhanced1 }
export { getRenderContext }
export type { RenderContext }
export type { PageContextAfterRender }
export type { PageContextInitEnhanced1 }

import { getErrorPageId } from '../../../shared/error-page'
import { getHtmlString } from '../html/renderHtml'
import { type PageFile, getPageFilesAll } from '../../../shared/getPageFiles'
import { assert, assertUsage, hasProp, objectAssign, unique } from '../utils'
import { serializePageContextClientSide } from '../html/serializePageContextClientSide'
import { addComputedUrlProps, type PageContextUrlsPrivate } from '../../../shared/UrlComputedProps'
import { getGlobalContext } from '../globalContext'
import { createHttpResponseObject, createHttpResponsePageContextJson, HttpResponse } from './createHttpResponseObject'
import { loadPageFilesServerSide, PageContext_loadPageFilesServerSide, type PageFiles } from './loadPageFilesServerSide'
import type { PageConfig, PageConfigGlobal } from '../../../shared/page-configs/PageConfig'
import { executeOnRenderHtmlHook } from './executeOnRenderHtmlHook'
import { executeOnBeforeRenderHooks } from './executeOnBeforeRenderHook'
import { logRuntimeError } from './loggerRuntime'
import { isNewError } from './isNewError'
import { preparePageContextForUserConsumptionServerSide } from './preparePageContextForUserConsumptionServerSide'
import { executeGuardHook } from '../../../shared/route/executeGuardHook'
import { loadPageRoutes, type PageRoutes } from '../../../shared/route/loadPageRoutes'
import type { OnBeforeRouteHook } from '../../../shared/route/executeOnBeforeRouteHook'
import type { PageContextInitEnhanced2 } from '../renderPage'

type PageContextAfterRender = { httpResponse: null | HttpResponse; errorWhileRendering: null | Error }

async function renderPageAlreadyRouted<
  PageContext extends {
    _pageId: string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
    is404: null | boolean
    routeParams: Record<string, string>
    errorWhileRendering: null | Error
  } & PageContextInitEnhanced2 &
    PageContextUrlsPrivate &
    PageContext_loadPageFilesServerSide
>(pageContext: PageContext): Promise<PageContext & PageContextAfterRender> {
  // pageContext._pageId can either be the:
  //  - ID of the page matching the routing, or the
  //  - ID of the error page `_error.page.js`.
  assert(hasProp(pageContext, '_pageId', 'string'))

  const isError = pageContext.is404 || pageContext.errorWhileRendering

  objectAssign(pageContext, await loadPageFilesServerSide(pageContext))

  await executeGuardHook(pageContext, (pageContext) => preparePageContextForUserConsumptionServerSide(pageContext))

  if (!isError) {
    await executeOnBeforeRenderHooks(pageContext)
  } else {
    try {
      await executeOnBeforeRenderHooks(pageContext)
    } catch (err) {
      if (isNewError(err, pageContext.errorWhileRendering)) {
        logRuntimeError(err, pageContext._httpRequestId)
      }
    }
  }

  if (pageContext.isClientSideNavigation) {
    if (isError) {
      objectAssign(pageContext, { _isError: true })
    }
    const pageContextSerialized: string = serializePageContextClientSide(pageContext)
    const httpResponse = await createHttpResponsePageContextJson(pageContextSerialized)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }

  const renderHookResult = await executeOnRenderHtmlHook(pageContext)

  if (renderHookResult.htmlRender === null) {
    objectAssign(pageContext, { httpResponse: null })
    return pageContext
  } else {
    const { htmlRender, renderHook } = renderHookResult
    const httpResponse = await createHttpResponseObject(htmlRender, renderHook, pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }
}

async function prerenderPage(
  pageContext: PageContextInitEnhanced1 &
    PageFiles & {
      routeParams: Record<string, string>
      _pageId: string
      _urlRewrite: null
      _httpRequestId: number | null
      _usesClientRouter: boolean
      _pageContextAlreadyProvidedByOnPrerenderHook?: true
      is404: null | boolean
    }
) {
  objectAssign(pageContext, {
    isClientSideNavigation: false,
    _urlHandler: null
  })

  addComputedUrlProps(pageContext)

  /* Should we execute the guard() hook upon pre-rendering? Is there a use case for this?
   *  - It isn't trivial to implement, as it requires to duplicate / factor out the isAbortError() handling
  await executeGuardHook(pageContext, (pageContext) => preparePageContextForUserConsumptionServerSide(pageContext))
  */

  await executeOnBeforeRenderHooks(pageContext)

  const { htmlRender, renderHook } = await executeOnRenderHtmlHook(pageContext)
  assertUsage(
    htmlRender !== null,
    `Cannot pre-render '${pageContext.urlOriginal}' because the ${renderHook.hookName}() hook defined by ${renderHook.hookFilePath} didn't return an HTML string.`
  )
  assert(pageContext.isClientSideNavigation === false)
  const documentHtml = await getHtmlString(htmlRender)
  assert(typeof documentHtml === 'string')
  if (!pageContext._usesClientRouter) {
    return { documentHtml, pageContextSerialized: null, pageContext }
  } else {
    const pageContextSerialized = serializePageContextClientSide(pageContext)
    return { documentHtml, pageContextSerialized, pageContext }
  }
}

async function prerender404Page(renderContext: RenderContext, pageContextInit_: Record<string, unknown> | null) {
  const errorPageId = getErrorPageId(renderContext.pageFilesAll, renderContext.pageConfigs)
  if (!errorPageId) {
    return null
  }

  const pageContext = {
    _pageId: errorPageId,
    _httpRequestId: null,
    _urlRewrite: null,
    is404: true,
    routeParams: {},
    // `prerender404Page()` is about generating `dist/client/404.html` for static hosts; there is no Client Routing.
    _usesClientRouter: false,
    _routeMatches: []
  }

  const pageContextInit = {
    urlOriginal: '/fake-404-url', // A URL is needed for `applyViteHtmlTransform`
    ...pageContextInit_
  }
  {
    const pageContextInitEnhanced1 = getPageContextInitEnhanced1(pageContextInit, renderContext)
    objectAssign(pageContext, pageContextInitEnhanced1)
  }

  objectAssign(pageContext, await loadPageFilesServerSide(pageContext))

  return prerenderPage(pageContext)
}

type PageContextInitEnhanced1 = ReturnType<typeof getPageContextInitEnhanced1>
function getPageContextInitEnhanced1(pageContextInit: { urlOriginal: string }, renderContext: RenderContext) {
  assert(pageContextInit.urlOriginal)

  const globalContext = getGlobalContext()
  const pageContextInitEnhanced1 = {
    ...pageContextInit,
    _objectCreatedByVitePluginSsr: true,
    // The following is defined on `pageContext` because we can eventually make these non-global (e.g. sot that two pages can have different includeAssetsImportedByServer settings)
    _baseServer: globalContext.baseServer,
    _baseAssets: globalContext.baseAssets,
    _includeAssetsImportedByServer: globalContext.includeAssetsImportedByServer,
    // TODO: use GloablContext instead
    _pageFilesAll: renderContext.pageFilesAll,
    _pageConfigs: renderContext.pageConfigs,
    _pageConfigGlobal: renderContext.pageConfigGlobal,
    _allPageIds: renderContext.allPageIds,
    _pageRoutes: renderContext.pageRoutes,
    _onBeforeRouteHook: renderContext.onBeforeRouteHook,
    _pageContextInit: pageContextInit
  }

  return pageContextInitEnhanced1
}

type RenderContext = {
  pageFilesAll: PageFile[]
  pageConfigs: PageConfig[]
  pageConfigGlobal: PageConfigGlobal
  allPageIds: string[]
  pageRoutes: PageRoutes
  onBeforeRouteHook: OnBeforeRouteHook | null
}
// TODO: remove getRenderContext() in favor of getGlobalObject() + reloadGlobalContext()
// TODO: impl GlobalNodeContext + GlobalClientContext + GloablContext, and use GlobalContext instead of RenderContext
async function getRenderContext(): Promise<RenderContext> {
  const globalContext = getGlobalContext()
  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = await getPageFilesAll(
    false,
    globalContext.isProduction
  )
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds
  )
  assertNonMixedDesign(pageFilesAll, pageConfigs)
  const renderContext = {
    pageFilesAll: pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds: allPageIds,
    pageRoutes,
    onBeforeRouteHook
  }
  return renderContext
}

function assertNonMixedDesign(pageFilesAll: PageFile[], pageConfigs: PageConfig[]) {
  if (pageFilesAll.length === 0 || pageConfigs.length === 0) return
  const indent = '- '
  const v1Files: string[] = unique(
    pageConfigs.map((p) => Object.values(p.configElements).map((c) => indent + c.configDefinedByFile)).flat()
  )
  assertUsage(
    false,
    [
      'Mixing the new V1 design with the old V0.4 design is forbidden.',
      'V1 files:',
      ...v1Files,
      'V0.4 files:',
      ...pageFilesAll.map((p) => indent + p.filePath)
    ].join('\n')
  )
}
