export { renderPageContext }
export { prerenderPageContext }
export { prerender404Page }
export { loadPageFilesServer }
export { initPageContext }
export { getRenderContext }
export type { RenderContext }
export type { RenderResult }

import { getErrorPageId } from '../../shared/route'
import { type HtmlRender, isDocumentHtml, renderDocumentHtml, getHtmlString } from '../html/renderHtml'
import { type PageFile, type PageContextExports, getPageFilesAll } from '../../shared/getPageFiles'
import { getHook } from '../../shared/getHook'
import {
  assert,
  assertUsage,
  hasProp,
  isObject,
  objectAssign,
  isPromise,
  callHookWithTimeout,
  isCallable
} from '../utils'
import type { PageAsset } from './getPageAssets'
import { assertHookResult } from '../../shared/assertHookResult'
import { isStream } from '../html/stream'
import { serializePageContextClientSide } from '../helpers'
import { addComputedUrlProps, type PageContextUrls } from '../../shared/addComputedUrlProps'
import { assertPageContextProvidedByUser } from '../../shared/assertPageContextProvidedByUser'
import { log404 } from './log404'
import { getGlobalContext } from '../globalContext'
import type { PreloadFilter } from '../html/injectAssets/getHtmlTags'
import { createHttpResponseObject, HttpResponse } from './createHttpResponseObject'
import { assertError, logError, logErrorIfDifferentFromOriginal } from './logError'
import { loadPageFilesServer, PageContext_loadPageFilesServer, type PageFiles } from './loadPageFilesServer'
import { preparePageContextForRelease, type PageContextPublic } from './preparePageContextForRelease'
import { handleErrorWithoutErrorPage } from './handleErrorWithoutErrorPage'

type GlobalRenderingContext = {
  _allPageIds: string[]
  _pageFilesAll: PageFile[]
}

type RenderResult = { urlOriginal: string; httpResponse: null | HttpResponse; errorWhileRendering: null | Error }
type GetPageAssets = () => Promise<PageAsset[]>

async function renderPageContext(
  pageContext: {
    _pageId: null | string
    _pageContextAlreadyProvidedByPrerenderHook?: true
    _isPageContextRequest: boolean
    _allPageIds: string[]
    is404: null | boolean
    routeParams: Record<string, string>
    errorWhileRendering: null | Error
  } & PageContextUrls &
    PageContext_loadPageFilesServer
): Promise<RenderResult> {
  if (pageContext.is404) log404(pageContext)

  const isError = pageContext.is404 || pageContext.errorWhileRendering

  if (isError) {
    assert(pageContext._pageId === null)
    const errorPageId = getErrorPageId(pageContext._allPageIds)
    if (errorPageId) {
      objectAssign(pageContext, { _pageId: errorPageId })
    } else {
      // The user hasn't define a `_error.page.js`
      objectAssign(pageContext, { _pageId: null })
      return handleErrorWithoutErrorPage(pageContext)
    }
  }

  // We now resolved `pageContext._pageId`. It can either be the:
  //  - ID of the page matching the routing, or the
  //  - ID of the error page `_error.page.js`.
  assert(hasProp(pageContext, '_pageId', 'string'))

  const pageFiles = await loadPageFilesServer(pageContext)
  objectAssign(pageContext, pageFiles)

  if (!isError) {
    await executeOnBeforeRenderHooks(pageContext)
  } else {
    try {
      await executeOnBeforeRenderHooks(pageContext)
    } catch (err) {
      logErrorIfDifferentFromOriginal(err, pageContext.errorWhileRendering)
    }
  }

  if (pageContext._isPageContextRequest) {
    if (isError) {
      objectAssign(pageContext, { _isError: true })
    }
    const body: string = serializePageContextClientSide(pageContext)
    const httpResponse = await createHttpResponseObject(body, null, pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }

  const renderHookResult = await executeRenderHook(pageContext)

  if (renderHookResult.htmlRender === null) {
    objectAssign(pageContext, { httpResponse: null })
    return pageContext
  } else {
    const { htmlRender, renderFilePath } = renderHookResult
    const httpResponse = await createHttpResponseObject(htmlRender, renderFilePath, pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }
}

async function prerenderPageContext(
  pageContext: {
    urlOriginal: string
    routeParams: Record<string, string>
    _pageId: string
    _usesClientRouter: boolean
    _pageContextAlreadyProvidedByPrerenderHook?: true
    is404: null | boolean
    _baseUrl: string
  } & PageFiles &
    GlobalRenderingContext
) {
  objectAssign(pageContext, {
    _isPageContextRequest: false,
    _urlHandler: null
  })

  addComputedUrlProps(pageContext)

  await executeOnBeforeRenderHooks(pageContext)

  const renderHookResult = await executeRenderHook(pageContext)
  assertUsage(
    renderHookResult.htmlRender !== null,
    `Cannot pre-render \`${pageContext.urlOriginal}\` because the \`render()\` hook exported by ${renderHookResult.renderFilePath} didn't return an HTML string.`
  )
  assert(pageContext._isPageContextRequest === false)
  const documentHtml = await getHtmlString(renderHookResult.htmlRender)
  assert(typeof documentHtml === 'string')
  if (!pageContext._usesClientRouter) {
    return { documentHtml, pageContextSerialized: null, pageContext }
  } else {
    const pageContextSerialized = serializePageContextClientSide(pageContext)
    return { documentHtml, pageContextSerialized, pageContext }
  }
}

async function prerender404Page(renderContext: RenderContext) {
  const errorPageId = getErrorPageId(renderContext.allPageIds)
  if (!errorPageId) {
    return null
  }

  const pageContext = {}
  const pageContextInit = {
    urlOriginal: '/fake-404-url' // A URL is needed for `applyViteHtmlTransform`
  }
  {
    const pageContextInitAddendum = initPageContext(pageContextInit, renderContext)
    objectAssign(pageContext, pageContextInitAddendum)
  }
  objectAssign(pageContext, {
    _pageId: errorPageId,
    is404: true,
    routeParams: {},
    // `prerender404Page()` is about generating `dist/client/404.html` for static hosts; there is no Client Routing.
    _usesClientRouter: false,
    _routeMatches: []
  })

  const pageFiles = await loadPageFilesServer(pageContext)
  objectAssign(pageContext, pageFiles)

  return prerenderPageContext(pageContext)
}

function initPageContext(pageContextInit: { urlOriginal: string }, renderContext: RenderContext) {
  assert(pageContextInit.urlOriginal)

  const globalContext = getGlobalContext()
  const pageContextAddendum = {
    ...pageContextInit,
    _objectCreatedByVitePluginSsr: true,
    _pageFilesAll: renderContext.pageFilesAll,
    _allPageIds: renderContext.allPageIds,
    // The following is defined on `pageContext` because we can eventually make these non-global (e.g. sot that two pages can have different includeAssetsImportedByServer settings)
    _baseUrl: globalContext.baseUrl,
    _baseAssets: globalContext.baseAssets,
    _includeAssetsImportedByServer: globalContext.includeAssetsImportedByServer
  }

  return pageContextAddendum
}

type RenderContext = {
  pageFilesAll: PageFile[]
  allPageIds: string[]
}
async function getRenderContext(): Promise<RenderContext> {
  const globalContext = getGlobalContext()
  const { pageFilesAll, allPageIds } = await getPageFilesAll(false, globalContext.isProduction)
  const renderContext = {
    pageFilesAll: pageFilesAll,
    allPageIds: allPageIds
  }
  return renderContext
}

async function executeOnBeforeRenderHooks(
  pageContext: {
    _pageId: string
    _pageContextAlreadyProvidedByPrerenderHook?: true
  } & PageContextExports &
    PageContextPublic
): Promise<void> {
  if (pageContext._pageContextAlreadyProvidedByPrerenderHook) {
    return
  }
  const hook = getHook(pageContext, 'onBeforeRender')
  if (!hook) {
    return
  }
  const onBeforeRender = hook.hook
  preparePageContextForRelease(pageContext)
  const hookResult = await callHookWithTimeout(() => onBeforeRender(pageContext), 'onBeforeRender', hook.filePath)

  assertHookResult(hookResult, 'onBeforeRender', ['pageContext'], hook.filePath)
  const pageContextFromHook = hookResult?.pageContext
  Object.assign(pageContext, pageContextFromHook)
}

async function executeRenderHook(
  pageContext: PageContextPublic & {
    _pageId: string
    __getPageAssets: GetPageAssets
    _passToClient: string[]
    _pageFilesAll: PageFile[]
    _isHtmlOnly: boolean
    _baseUrl: string
    _pageFilePathsLoaded: string[]
  }
): Promise<{
  renderFilePath: string
  htmlRender: null | HtmlRender
}> {
  const hook = getHook(pageContext, 'render')
  assertUsage(
    hook,
    [
      'No server-side `render()` hook found.',
      'See https://vite-plugin-ssr.com/render-modes for more information.',
      [
        'Loaded server-side page files (none of them `export { render }`):', // TODO: stop showing stack trace for this error
        ...pageContext._pageFilePathsLoaded.map((f, i) => ` (${i + 1}): ${f}`)
      ].join('\n')
    ].join(' ')
  )
  const render = hook.hook
  const renderFilePath = hook.filePath

  preparePageContextForRelease(pageContext)
  const result = await callHookWithTimeout(() => render(pageContext), 'render', hook.filePath)
  if (isObject(result) && !isDocumentHtml(result)) {
    assertHookResult(result, 'render', ['documentHtml', 'pageContext', 'injectFilter'] as const, renderFilePath)
  }
  objectAssign(pageContext, { _renderHook: { hookFilePath: renderFilePath, hookName: 'render' as const } })

  let pageContextPromise: Promise<unknown> | null = null
  if (hasProp(result, 'pageContext')) {
    const pageContextProvidedByRenderHook = result.pageContext
    if (isPromise(pageContextProvidedByRenderHook)) {
      pageContextPromise = pageContextProvidedByRenderHook
    } else {
      assertPageContextProvidedByUser(pageContextProvidedByRenderHook, { hook: pageContext._renderHook })
      Object.assign(pageContext, pageContextProvidedByRenderHook)
    }
  }
  objectAssign(pageContext, { _pageContextPromise: pageContextPromise })

  const errPrefix = 'The `render()` hook exported by ' + renderFilePath
  const errSuffix = [
    'a string generated with the `escapeInject` template tag or a string returned by `dangerouslySkipEscape()`,',
    'see https://vite-plugin-ssr.com/escapeInject'
  ].join(' ')

  let documentHtml: unknown
  if (!isObject(result) || isDocumentHtml(result)) {
    assertUsage(
      typeof result !== 'string',
      [
        errPrefix,
        'returned a plain JavaScript string which is forbidden;',
        'instead, it should return',
        errSuffix
      ].join(' ')
    )
    assertUsage(
      result === null || isDocumentHtml(result),
      [
        errPrefix,
        'should return `null`, a string `documentHtml`, or an object `{ documentHtml, pageContext }`',
        'where `pageContext` is `undefined` or an object holding additional `pageContext` values',
        'and `documentHtml` is',
        errSuffix
      ].join(' ')
    )
    documentHtml = result
  } else {
    if ('documentHtml' in result) {
      documentHtml = result.documentHtml
      assertUsage(
        typeof documentHtml !== 'string',
        [
          errPrefix,
          'returned `{ documentHtml }`, but `documentHtml` is a plain JavaScript string which is forbidden;',
          '`documentHtml` should be',
          errSuffix
        ].join(' ')
      )
      assertUsage(
        documentHtml === undefined || documentHtml === null || isDocumentHtml(documentHtml),
        [errPrefix, 'returned `{ documentHtml }`, but `documentHtml` should be', errSuffix].join(' ')
      )
    }
  }

  assert(documentHtml === undefined || documentHtml === null || isDocumentHtml(documentHtml))

  if (documentHtml === null || documentHtml === undefined) {
    return { htmlRender: null, renderFilePath }
  }

  const onErrorWhileStreaming = (err: unknown) => {
    assertError(err)
    logError(err)
    /*
    objectAssign(pageContext, {
      errorWhileRendering: err,
      _serverSideErrorWhileStreaming: true
    })
    */
  }

  let injectFilter: PreloadFilter = null
  if (hasProp(result, 'injectFilter')) {
    assertUsage(isCallable(result.injectFilter), 'injectFilter should be a function')
    injectFilter = result.injectFilter
  }

  const htmlRender = await renderDocumentHtml(
    documentHtml,
    pageContext,
    renderFilePath,
    onErrorWhileStreaming,
    injectFilter
  )
  assert(typeof htmlRender === 'string' || isStream(htmlRender))
  return { htmlRender, renderFilePath }
}
