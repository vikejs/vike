export { renderPageContext }
export { prerenderPageContext }
export { prerender404Page }
export { loadPageFilesServer }
export { initPageContext }
export { getRenderContext }
export type { RenderContext }
export type { PageContextAfterRender }

import { getErrorPageId } from '../../../shared/route'
import { type HtmlRender, isDocumentHtml, renderDocumentHtml, getHtmlString } from '../html/renderHtml'
import { type PageFile, type PageContextExports, getPageFilesAll } from '../../../shared/getPageFiles'
import { getHook, type Hook } from '../../../shared/getHook'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  isObject,
  objectAssign,
  isPromise,
  callHookWithTimeout,
  isCallable,
  unique
} from '../../utils'
import type { PageAsset } from './getPageAssets'
import { assertHookResult } from '../../../shared/assertHookResult'
import { isStream } from '../html/stream'
import { serializePageContextClientSide } from '../helpers'
import { addComputedUrlProps, type PageContextUrls } from '../../../shared/addComputedUrlProps'
import { assertPageContextProvidedByUser } from '../../../shared/assertPageContextProvidedByUser'
import { getGlobalContext } from '../globalContext'
import type { PreloadFilter } from '../html/injectAssets/getHtmlTags'
import { createHttpResponseObject, HttpResponse } from './createHttpResponseObject'
import { isNewError, logErrorWithVite } from './logError'
import { loadPageFilesServer, PageContext_loadPageFilesServer, type PageFiles } from './loadPageFilesServer'
import { preparePageContextForRelease, type PageContextPublic } from './preparePageContextForRelease'
import { handleErrorWithoutErrorPage } from './handleErrorWithoutErrorPage'
import type { PageContextPromise } from '../html/injectAssets'
import type { PageConfig, PageConfigGlobal } from '../../../shared/page-configs/PageConfig'

type GlobalRenderingContext = {
  _allPageIds: string[]
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfig[]
}

type PageContextAfterRender = { httpResponse: null | HttpResponse; errorWhileRendering: null | Error }
type GetPageAssets = () => Promise<PageAsset[]>

async function renderPageContext<
  PageContext extends {
    _pageId: null | string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
    _isPageContextRequest: boolean
    _allPageIds: string[]
    is404: null | boolean
    routeParams: Record<string, string>
    errorWhileRendering: null | Error
  } & PageContextUrls &
    PageContext_loadPageFilesServer
>(pageContext: PageContext): Promise<PageContext & PageContextAfterRender> {
  const isError = pageContext.is404 || pageContext.errorWhileRendering

  if (isError) {
    assert(pageContext._pageId === null)
    const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._pageConfigs)
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
      if (isNewError(err, pageContext.errorWhileRendering)) {
        logErrorWithVite(err)
      }
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

  const renderHookResult = await executeOnRenderHtmlHook(pageContext)

  if (renderHookResult.htmlRender === null) {
    objectAssign(pageContext, { httpResponse: null })
    return pageContext
  } else {
    const { htmlRender, renderSrc } = renderHookResult
    const httpResponse = await createHttpResponseObject(htmlRender, renderSrc, pageContext)
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
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
    is404: null | boolean
    _baseServer: string
  } & PageFiles &
    GlobalRenderingContext
) {
  objectAssign(pageContext, {
    _isPageContextRequest: false,
    _urlHandler: null
  })

  addComputedUrlProps(pageContext)

  await executeOnBeforeRenderHooks(pageContext)

  const renderHookResult = await executeOnRenderHtmlHook(pageContext)
  assertUsage(
    renderHookResult.htmlRender !== null,
    `Cannot pre-render \`${pageContext.urlOriginal}\` because the \`render()\` hook defined by ${renderHookResult.renderSrc} didn't return an HTML string.`
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

async function prerender404Page(renderContext: RenderContext, pageContextInit_: Record<string, unknown> | null) {
  const errorPageId = getErrorPageId(renderContext.pageFilesAll, renderContext.pageConfigs)
  if (!errorPageId) {
    return null
  }

  const pageContext = {}
  const pageContextInit = {
    urlOriginal: '/fake-404-url', // A URL is needed for `applyViteHtmlTransform`
    ...pageContextInit_
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
    // The following is defined on `pageContext` because we can eventually make these non-global (e.g. sot that two pages can have different includeAssetsImportedByServer settings)
    _baseServer: globalContext.baseServer,
    _baseAssets: globalContext.baseAssets,
    _includeAssetsImportedByServer: globalContext.includeAssetsImportedByServer,
    // TODO: use GloablContext instead
    _pageFilesAll: renderContext.pageFilesAll,
    _pageConfigs: renderContext.pageConfigs,
    _pageConfigGlobal: renderContext.pageConfigGlobal,
    _allPageIds: renderContext.allPageIds
  }

  return pageContextAddendum
}

type RenderContext = {
  pageFilesAll: PageFile[]
  pageConfigs: PageConfig[]
  pageConfigGlobal: PageConfigGlobal
  allPageIds: string[]
}
// TODO: remove getRenderContext() in favor of getGlobalObject() + reloadGlobalContext()
// TODO: impl GlobalNodeContext + GlobalClientContext + GloablContext, and use GlobalContext instead of RenderContext
async function getRenderContext(): Promise<RenderContext> {
  const globalContext = getGlobalContext()
  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = await getPageFilesAll(
    false,
    globalContext.isProduction
  )
  assertNonMixedDesign(pageFilesAll, pageConfigs)
  const renderContext = {
    pageFilesAll: pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds: allPageIds
  }
  return renderContext
}

function assertNonMixedDesign(pageFilesAll: PageFile[], pageConfigs: PageConfig[]) {
  if (pageFilesAll.length === 0 || pageConfigs.length === 0) return
  const indent = '- '
  const v1Files: string[] = unique(
    pageConfigs.map((p) => Object.values(p.configSources).map((c) => indent + c.configDefinedByFile)).flat()
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

async function executeOnBeforeRenderHooks(
  pageContext: {
    _pageId: string
    _pageContextAlreadyProvidedByOnPrerenderHook?: true
  } & PageContextExports &
    PageContextPublic
): Promise<void> {
  if (pageContext._pageContextAlreadyProvidedByOnPrerenderHook) {
    return
  }
  const hook = getHook(pageContext, 'onBeforeRender')
  if (!hook) {
    return
  }
  const onBeforeRender = hook.hook
  preparePageContextForRelease(pageContext)
  const hookResult = await callHookWithTimeout(() => onBeforeRender(pageContext), 'onBeforeRender', hook.hookSrc)

  assertHookResult(hookResult, 'onBeforeRender', ['pageContext'], hook.hookSrc)
  const pageContextFromHook = hookResult?.pageContext
  Object.assign(pageContext, pageContextFromHook)
}

async function executeOnRenderHtmlHook(
  pageContext: PageContextPublic & {
    _pageId: string
    __getPageAssets: GetPageAssets
    _passToClient: string[]
    _isHtmlOnly: boolean
    _baseServer: string
    _pageFilePathsLoaded: string[]
  }
): Promise<{
  renderSrc: string
  htmlRender: null | HtmlRender
}> {
  let hook: null | Hook = null
  {
    const renderHook = getHook(pageContext, 'render')
    // assertWarning(!renderHook, 'Hook render() has been renamed to onRenderHtml() and onRenderClient()', { onlyOnce: true, showStackTrace: false }) // TODO/v1: replace this warning with waning that user should migrate to v1
    hook = renderHook
  }
  {
    const renderHook = getHook(pageContext, 'onRenderHtml')
    if (renderHook) {
      hook = renderHook
    }
  }
  assertUsage(
    hook,
    [
      //'No onRenderHtml() hook found.',
      'No render() hook found.', // TODO
      'See https://vite-plugin-ssr.com/render-modes for more information.', // TODO
      [
        // 'Loaded config files (none of them define the onRenderHtml() hook):',
        'Loaded server-side page files (none of them `export { render }`):',
        ...pageContext._pageFilePathsLoaded.map((f, i) => ` (${i + 1}): ${f}`)
      ].join('\n')
    ].join(' ')
  )
  const render = hook.hook
  const renderSrc = hook.hookSrc

  preparePageContextForRelease(pageContext)
  const result = await callHookWithTimeout(() => render(pageContext), 'render', renderSrc)
  if (isObject(result) && !isDocumentHtml(result)) {
    assertHookResult(result, 'render', ['documentHtml', 'pageContext', 'injectFilter'] as const, renderSrc, true)
  }
  objectAssign(pageContext, { _renderHook: { hookSrc: renderSrc, hookName: 'render' as const } })

  const errPrefix = 'The render() hook defined by ' + renderSrc

  let pageContextPromise: PageContextPromise = null
  if (hasProp(result, 'pageContext')) {
    const pageContextProvidedByRenderHook = result.pageContext
    if (isPromise(pageContextProvidedByRenderHook) || isCallable(pageContextProvidedByRenderHook)) {
      assertWarning(
        !isPromise(pageContextProvidedByRenderHook),
        `${errPrefix} returns a pageContext promise which is deprecated in favor of returning a pageContext async function, see https://vite-plugin-ssr.com/stream#initial-data-after-stream-end`,
        { onlyOnce: true, showStackTrace: false }
      )
      pageContextPromise = pageContextProvidedByRenderHook
    } else {
      assertPageContextProvidedByUser(pageContextProvidedByRenderHook, { hook: pageContext._renderHook })
      Object.assign(pageContext, pageContextProvidedByRenderHook)
    }
  }
  objectAssign(pageContext, { _pageContextPromise: pageContextPromise })

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
    return { htmlRender: null, renderSrc }
  }

  const onErrorWhileStreaming = (err: unknown) => {
    logErrorWithVite(err)
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

  const htmlRender = await renderDocumentHtml(documentHtml, pageContext, renderSrc, onErrorWhileStreaming, injectFilter)
  assert(typeof htmlRender === 'string' || isStream(htmlRender))
  return { htmlRender, renderSrc }
}
