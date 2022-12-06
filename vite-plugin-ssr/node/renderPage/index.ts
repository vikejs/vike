export { renderPage }
export { prerenderPageContext }
export { renderStatic404Page }
export { loadPageFilesServer }
export { initPageContext }
export { getRenderContext }
export type { RenderContext }

import { getErrorPageId, route, isErrorPageId } from '../../shared/route'
import { type HtmlRender, isDocumentHtml, renderDocumentHtml, getHtmlString } from '../html/renderHtml'
import {
  type PageFile,
  PageContextExports,
  getExportUnion,
  getPageFilesAll,
  ExportsAll
} from '../../shared/getPageFiles'
import { analyzePageClientSide, analyzePageClientSideInit } from '../../shared/getPageFiles/analyzePageClientSide'
import { getHook } from '../../shared/getHook'
import { stringify } from '@brillout/json-serializer/stringify'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  isPlainObject,
  isObject,
  objectAssign,
  PromiseType,
  isParsable,
  isPromise,
  parseUrl,
  callHookWithTimeout,
  isCallable
} from '../utils'
import { getPageAssets, PageContextGetPageAssets, type PageAsset } from './getPageAssets'
import { sortPageContext } from '../../shared/sortPageContext'
import { assertHookResult } from '../../shared/assertHookResult'
import { isStream } from '../html/stream'
import { addIs404ToPageProps, serializePageContextClientSide, type MediaType } from '../helpers'
import { addComputedUrlProps, assertURLs, PageContextUrls } from '../../shared/addComputedUrlProps'
import { assertPageContextProvidedByUser } from '../../shared/assertPageContextProvidedByUser'
import { isRenderErrorPageException } from './RenderErrorPage'
import { log404 } from './log404'
import { getGlobalContext, initGlobalContext } from '../globalContext'
import { loadPageFilesServerSide } from '../../shared/getPageFiles/analyzePageServerSide/loadPageFilesServerSide'
import { handlePageContextRequestUrl } from './handlePageContextRequestUrl'
import type { PreloadFilter } from '../html/injectAssets/getHtmlTags'
import { createHttpResponseObject, HttpResponse } from './createHttpResponseObject'
import { assertError, logError, logErrorIfDifferentFromOriginal } from './logError'
import { assertArguments } from './assertArguments'
import { debugPageFiles, type PageContextDebug } from './debugPageFiles'

type GlobalRenderingContext = {
  _allPageIds: string[]
  _pageFilesAll: PageFile[]
}

type RenderResult = { urlOriginal: string; httpResponse: null | HttpResponse; errorWhileRendering: null | Error }
type GetPageAssets = () => Promise<PageAsset[]>

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
  if (!pageContext._hasBaseUrl) {
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

async function handleErrorWithoutErrorPage(pageContext: {
  _isPageContextRequest: boolean
  errorWhileRendering: null | Error
  is404: null | boolean
  _pageId: null
  urlOriginal: string
}): Promise<RenderResult> {
  assert(pageContext._pageId === null) // User didn't define a `_error.page.js` file
  assert(pageContext.errorWhileRendering || pageContext.is404)

  warnMissingErrorPage()

  if (!pageContext._isPageContextRequest) {
    objectAssign(pageContext, { httpResponse: null })
    return pageContext
  } else {
    const __getPageAssets: GetPageAssets = async () => []
    objectAssign(pageContext, { __getPageAssets })
    const httpResponse = await createHttpResponseObject(stringify({ serverSideError: true }), null, pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }
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

function handleUrl(pageContext: { urlOriginal: string; _baseUrl: string }): {
  _isPageContextRequest: boolean
  _hasBaseUrl: boolean
  _urlHandler: (urlOriginal: string) => string
} {
  const { urlOriginal } = pageContext
  assert(urlOriginal.startsWith('/') || urlOriginal.startsWith('http'))
  const { urlWithoutPageContextRequestSuffix, isPageContextRequest } = handlePageContextRequestUrl(urlOriginal)
  const { hasBaseUrl } = parseUrl(urlWithoutPageContextRequestSuffix, pageContext._baseUrl)
  const pageContextAddendum = {
    _isPageContextRequest: isPageContextRequest,
    _hasBaseUrl: hasBaseUrl,
    // The onBeforeRoute() hook may modify pageContext.urlOriginal (e.g. for i18n)
    _urlHandler: (urlOriginal: string) => handlePageContextRequestUrl(urlOriginal).urlWithoutPageContextRequestSuffix
  }
  return pageContextAddendum
}

// `renderPage()` calls `renderPage_()` while ensuring an `err` is always `console.error(err)` instead of `throw err`, so that `vite-plugin-ssr` never triggers a server shut down. (Throwing an error in an Express.js middleware shuts down the whole Express.js server.)
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

  await initGlobalContext()
  const renderContext = await getRenderContext()

  const pageContext = {}
  try {
    return await renderPageAttempt(pageContextInit, pageContext, renderContext)
  } catch (errOriginal) {
    assertError(errOriginal)
    if (!isRenderErrorPageException(errOriginal)) {
      logError(errOriginal)
    }
    try {
      return await renderErrorPage(pageContextInit, errOriginal, pageContext, renderContext)
    } catch (err) {
      logErrorIfDifferentFromOriginal(err, errOriginal)
      const pageContextErr = {}
      objectAssign(pageContextErr, pageContextInit)
      objectAssign(pageContextErr, {
        httpResponse: null,
        errorWhileRendering: errOriginal
      })
      return pageContextErr
    }
  }
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

async function renderStatic404Page(renderContext: RenderContext) {
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
    // `renderStatic404Page()` is about generating `dist/client/404.html` for static hosts; there is no Client Routing.
    _usesClientRouter: false,
    _routeMatches: []
  })

  const pageFiles = await loadPageFilesServer(pageContext)
  objectAssign(pageContext, pageFiles)

  return prerenderPageContext(pageContext)
}

type PageContextPublic = {
  urlOriginal: string
  /** @deprecated */
  url: string
  urlPathname: string
  urlParsed: PageContextUrls['urlParsed']
  routeParams: Record<string, string>
  Page: unknown
  pageExports: Record<string, unknown>
  exports: Record<string, unknown>
  exportsAll: ExportsAll
  _pageId: string
  is404: null | boolean
  pageProps?: Record<string, unknown>
}
function preparePageContextForRelease<T extends PageContextPublic>(pageContext: T) {
  assertURLs(pageContext)

  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert(isObject(pageContext.exports))
  assert(isObject(pageContext.exportsAll))

  sortPageContext(pageContext)

  if (isErrorPageId(pageContext._pageId)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    addIs404ToPageProps(pageContext)
  }
}

type PageContext_loadPageFilesServer = PageContextGetPageAssets &
  PageContextDebug & {
    urlOriginal: string
    _pageFilesAll: PageFile[]
  }
type PageFiles = PromiseType<ReturnType<typeof loadPageFilesServer>>
async function loadPageFilesServer(pageContext: { _pageId: string } & PageContext_loadPageFilesServer) {
  const [{ exports, exportsAll, pageExports, pageFilesLoaded }] = await Promise.all([
    loadPageFilesServerSide(pageContext._pageFilesAll, pageContext._pageId),
    analyzePageClientSideInit(pageContext._pageFilesAll, pageContext._pageId, { sharedPageFilesAlreadyLoaded: true })
  ])
  const { isHtmlOnly, isClientRouting, clientEntries, clientDependencies, pageFilesClientSide, pageFilesServerSide } =
    analyzePageClientSide(pageContext._pageFilesAll, pageContext._pageId)
  const pageContextAddendum = {}
  objectAssign(pageContextAddendum, {
    exports,
    exportsAll,
    pageExports,
    Page: exports.Page,
    _isHtmlOnly: isHtmlOnly,
    _passToClient: getExportUnion(exportsAll, 'passToClient'),
    _pageFilePathsLoaded: pageFilesLoaded.map((p) => p.filePath)
  })

  objectAssign(pageContextAddendum, {
    __getPageAssets: async () => {
      if ('_pageAssets' in pageContext) {
        return (pageContext as any as { _pageAssets: PageAsset[] })._pageAssets
      } else {
        const pageAssets = await getPageAssets(pageContext, clientDependencies, clientEntries)
        objectAssign(pageContext, { _pageAssets: pageAssets })
        return pageContext._pageAssets
      }
    }
  })

  // TODO: remove this on next semver major
  Object.assign(pageContextAddendum, {
    _getPageAssets: async () => {
      assertWarning(false, 'pageContext._getPageAssets() deprecated, see https://vite-plugin-ssr.com/preload', {
        onlyOnce: true,
        showStackTrace: true
      })
      const pageAssetsOldFormat: {
        src: string
        assetType: 'script' | 'style' | 'preload'
        mediaType: null | NonNullable<MediaType>['mediaType']
        preloadType: null | 'image' | 'script' | 'font' | 'style'
      }[] = []

      ;(await pageContextAddendum.__getPageAssets()).forEach((p) => {
        if (p.assetType === 'script' && p.isEntry) {
          pageAssetsOldFormat.push({
            src: p.src,
            preloadType: null,
            assetType: 'script',
            mediaType: p.mediaType
          })
        }
        pageAssetsOldFormat.push({
          src: p.src,
          preloadType: p.assetType,
          assetType: p.assetType === 'style' ? 'style' : 'preload',
          mediaType: p.mediaType
        })
      })
      return pageAssetsOldFormat
    }
  })

  {
    debugPageFiles({
      pageContext,
      isHtmlOnly,
      isClientRouting,
      pageFilesLoaded,
      pageFilesClientSide,
      pageFilesServerSide,
      clientEntries,
      clientDependencies
    })
  }

  return pageContextAddendum
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

function warnMissingErrorPage(): void {
  const globalContext = getGlobalContext()
  if (!globalContext.isProduction) {
    assertWarning(
      false,
      'No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)',
      { showStackTrace: false, onlyOnce: true }
    )
  }
}
