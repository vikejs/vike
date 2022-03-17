import { getErrorPageId, route, isErrorPage } from '../shared/route'
import { HtmlRender, isDocumentHtml, renderHtml, getHtmlString } from './html/renderHtml'
import {
  loadPageFiles,
  getPageFilesAllServerSide,
  PageFile,
  PageContextExports,
  getStringUnion,
} from '../shared/getPageFiles'
import { getHook } from '../shared/getHook'
import { getSsrEnv } from './ssrEnv'
import { stringify } from '@brillout/json-s/stringify'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  handlePageContextRequestSuffix,
  isPlainObject,
  isObject,
  objectAssign,
  PromiseType,
  parseUrl,
  isParsable,
  assertBaseUrl,
  isPromise,
} from './utils'
import { getPageAssets, PageAssets } from './html/injectAssets'
import { sortPageContext } from '../shared/sortPageContext'
import { assertHookResult, assertObjectKeys } from '../shared/assertHookResult'
import {
  getStreamReadableNode,
  getStreamReadableWeb,
  pipeToStreamWritableWeb,
  pipeToStreamWritableNode,
  StreamPipeNode,
  StreamPipeWeb,
  StreamReadableNode,
  StreamReadableWeb,
  StreamWritableNode,
  StreamWritableWeb,
} from './html/stream'
import { addIs404ToPageProps, serializePageContextClientSide } from './serializePageContextClientSide'
import { addComputedUrlProps, PageContextUrls } from '../shared/addComputedUrlProps'
import { assertPageContextProvidedByUser } from '../shared/assertPageContextProvidedByUser'
import { isRenderErrorPage, assertRenderErrorPageParentheses } from './renderPage/RenderErrorPage'
import { warn404 } from './renderPage/warn404'

export { renderPageWithoutThrowing }
export type { renderPage }
export { prerenderPage }
export { renderStatic404Page }
export { getGlobalContext }
export { loadPageFilesServer }
export type { GlobalContext }
export { throwPrerenderError }

type PageFiles = PromiseType<ReturnType<typeof loadPageFilesServer>>
type GlobalContext = PromiseType<ReturnType<typeof getGlobalContext>>

async function renderPage<PageContextAdded extends {}, PageContextInit extends { url: string }>(
  pageContextInit: PageContextInit,
): Promise<
  PageContextInit & { errorWhileRendering: unknown } & (
      | ({ httpResponse: HttpResponse } & PageContextAdded)
      | ({ httpResponse: null } & Partial<PageContextAdded>)
    )
> {
  assertArguments(...arguments)

  const pageContext = await initializePageContext(pageContextInit)

  if ('httpResponse' in pageContext) {
    assert(pageContext.httpResponse === null)
    return pageContext
  }

  // *** Route ***
  const routeResult = await route(pageContext)
  // TODO: remove unnecessary extra error handling?
  if ('hookError' in routeResult) {
    const err = routeResult.hookError
    logError(err)
    return await renderErrorPage(pageContextInit, routeResult.hookError)
  }
  objectAssign(pageContext, routeResult.pageContextAddendum)

  // *** Handle 404 ***
  let statusCode: 200 | 404
  if (hasProp(pageContext, '_pageId', 'string')) {
    statusCode = 200
  } else {
    assert(pageContext._pageId === null)
    warn404(pageContext)

    if (!pageContext._isPageContextRequest) {
      statusCode = 404
    } else {
      statusCode = 200
    }

    const errorWhileRendering = null

    // No `_error.page.js` is defined
    const errorPageId = getErrorPageId(pageContext._allPageIds)
    if (!errorPageId) {
      warnMissingErrorPage()
      if (pageContext._isPageContextRequest) {
        const httpResponse = createHttpResponseObject(
          stringify({
            pageContext404PageDoesNotExist: true,
          }),
          {
            statusCode,
            renderFilePath: null,
          },
          pageContext,
        )
        objectAssign(pageContext, { httpResponse, errorWhileRendering })
        return pageContext
      } else {
        const httpResponse = null
        objectAssign(pageContext, { httpResponse, errorWhileRendering })
        return pageContext
      }
    }

    // Render 404 page
    objectAssign(pageContext, {
      _pageId: errorPageId,
      is404: true,
      errorWhileRendering,
    })
  }

  const pageFiles = await loadPageFilesServer(pageContext)
  objectAssign(pageContext, pageFiles)

  await executeOnBeforeRenderHooks(pageContext)

  if (pageContext._isPageContextRequest) {
    const pageContextSerialized = serializePageContextClientSide(pageContext)
    const httpResponse = createHttpResponseObject(
      pageContextSerialized,
      { statusCode: 200, renderFilePath: null },
      pageContext,
    )
    objectAssign(pageContext, { httpResponse, errorWhileRendering: null })
    return pageContext
  }

  const renderHookResult = await executeRenderHook(pageContext)

  if (renderHookResult.htmlRender === null) {
    objectAssign(pageContext, { httpResponse: null, errorWhileRendering: null })
    return pageContext
  } else {
    const { htmlRender, renderFilePath } = renderHookResult
    const httpResponse = createHttpResponseObject(htmlRender, { statusCode, renderFilePath }, pageContext)
    objectAssign(pageContext, { httpResponse, errorWhileRendering: null })
    return pageContext
  }
}

async function initializePageContext<PageContextInit extends { url: string }>(pageContextInit: PageContextInit) {
  const pageContext = {
    _isPreRendering: false as const,
    ...pageContextInit,
  }

  if (pageContext.url.endsWith('/favicon.ico') || !isParsable(pageContext.url)) {
    objectAssign(pageContext, { httpResponse: null, errorWhileRendering: null })
    return pageContext
  }

  const baseUrl = getBaseUrl()
  const { isPageContextRequest, hasBaseUrl } = _parseUrl(pageContext.url, baseUrl)
  if (!hasBaseUrl) {
    objectAssign(pageContext, { httpResponse: null, errorWhileRendering: null })
    return pageContext
  }
  objectAssign(pageContext, {
    _isPageContextRequest: isPageContextRequest,
  })

  const globalContext = await getGlobalContext()
  objectAssign(pageContext, globalContext)

  addComputedUrlProps(pageContext)

  return pageContext
}

// `renderPageWithoutThrowing()` calls `renderPage()` while ensuring an `err` is always `console.error(err)` instead of `throw err`, so that `vite-plugin-ssr` never triggers a server shut down. (Throwing an error in an Express.js middleware shuts down the whole Express.js server.)
async function renderPageWithoutThrowing(
  pageContextInit: Parameters<typeof renderPage>[0],
): ReturnType<typeof renderPage> {
  const args = arguments as any as Parameters<typeof renderPageWithoutThrowing>
  try {
    return await renderPage.apply(null, args)
  } catch (err) {
    assertError(err)
    const skipLog = isRenderErrorPage(err)
    if (!skipLog) {
      logError(err)
    } else {
      setAlreadyLogged(err)
    }
    try {
      const pageContextAddendum = {}
      if (isRenderErrorPage(err)) {
        objectAssign(pageContextAddendum, { is404: true })
        objectAssign(pageContextAddendum, err.pageContext)
      }
      return await renderErrorPage(pageContextInit, err, pageContextAddendum)
    } catch (err2) {
      assertError(err2)
      // We swallow `err2`; logging `err` should be enough; `err2` is likely the same error than `err` anyways.
      if (skipLog) {
        logError(err2)
      }
      const pageContext = {}
      objectAssign(pageContext, pageContextInit)
      objectAssign(pageContext, {
        httpResponse: null,
        errorWhileRendering: err,
      })
      return pageContext
    }
  }
}

async function renderErrorPage<PageContextInit extends { url: string }>(
  pageContextInit: PageContextInit,
  err: unknown,
  pageContextAddendum?: Record<string, unknown>,
) {
  assert(hasAlreadyLogged(err))

  const pageContext = await initializePageContext(pageContextInit)
  // `pageContext.httpResponse===null` should have already been handled in `renderPage()`
  assert(!('httpResponse' in pageContext))

  objectAssign(pageContext, {
    is404: false,
    errorWhileRendering: err,
    httpResponse: null,
    routeParams: {} as Record<string, string>,
  })

  objectAssign(pageContext, pageContextAddendum)

  const statusCode = pageContext.is404 ? 404 : 500

  if (pageContext._isPageContextRequest) {
    const body = stringify({
      serverSideError: true,
    })
    const httpResponse = createHttpResponseObject(body, { statusCode, renderFilePath: null }, pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }

  const errorPageId = getErrorPageId(pageContext._allPageIds)
  if (errorPageId === null) {
    warnMissingErrorPage()
    return pageContext
  }
  objectAssign(pageContext, {
    _pageId: errorPageId,
  })

  const pageFiles = await loadPageFilesServer(pageContext)
  objectAssign(pageContext, pageFiles)

  await executeOnBeforeRenderHooks(pageContext)
  const renderHookResult = await executeRenderHook(pageContext)

  const { htmlRender, renderFilePath } = renderHookResult
  const httpResponse = createHttpResponseObject(htmlRender, { statusCode, renderFilePath }, pageContext)
  objectAssign(pageContext, { httpResponse })
  return pageContext
}

function assertError(err: unknown) {
  assertRenderErrorPageParentheses(err)
}

type StatusCode = 200 | 404 | 500
type ContentType = 'application/json' | 'text/html'
type HttpResponse = {
  statusCode: StatusCode
  contentType: ContentType
  body: string
  getBody: () => Promise<string>
  getNodeStream: () => Promise<StreamReadableNode>
  getWebStream: () => Promise<StreamReadableWeb>
  pipeToNodeWritable: StreamPipeNode
  pipeToWebWritable: StreamPipeWeb
}
function createHttpResponseObject(
  htmlRender: null | HtmlRender,
  { statusCode, renderFilePath }: { statusCode: StatusCode; renderFilePath: null | string },
  pageContext: { _isPageContextRequest: boolean },
): HttpResponse | null {
  if (htmlRender === null) {
    return null
  }

  assert(!pageContext._isPageContextRequest || typeof htmlRender === 'string')

  return {
    statusCode,
    contentType: pageContext._isPageContextRequest ? 'application/json' : 'text/html',
    get body() {
      if (typeof htmlRender !== 'string') {
        assert(renderFilePath)
        assertUsage(
          false,
          '`pageContext.httpResponse.body` is not available because your `render()` hook (' +
            renderFilePath +
            ') provides an HTML stream. Use `const body = await pageContext.httpResponse.getBody()` instead, see https://vite-plugin-ssr.com/stream',
        )
      }
      const body = htmlRender
      return body
    },
    async getBody(): Promise<string> {
      const body = await getHtmlString(htmlRender)
      return body
    },
    async getNodeStream() {
      assert(htmlRender !== null)
      const nodeStream = await getStreamReadableNode(htmlRender)
      assertUsage(
        nodeStream !== null,
        '`pageContext.httpResponse.getNodeStream()` is not available: make sure your `render()` hook provides a Node.js Stream, see https://vite-plugin-ssr.com/stream',
      )
      return nodeStream
    },
    async getWebStream() {
      assert(htmlRender !== null)
      const webStream = await getStreamReadableWeb(htmlRender)
      assertUsage(
        webStream !== null,
        '`pageContext.httpResponse.getWebStream()` is not available: make sure your `render()` hook provides a Web Stream, see https://vite-plugin-ssr.com/stream',
      )
      return webStream
    },
    pipeToWebWritable(writable: StreamWritableWeb) {
      const success = pipeToStreamWritableWeb(htmlRender, writable)
      assertUsage(
        success,
        '`pageContext.httpResponse.pipeToWebWritable` is not available: make sure your `render()` hook provides a Web Stream Pipe, see https://vite-plugin-ssr.com/stream',
      )
    },
    pipeToNodeWritable(writable: StreamWritableNode) {
      const success = pipeToStreamWritableNode(htmlRender, writable)
      assertUsage(
        success,
        '`pageContext.httpResponse.pipeToNodeWritable` is not available: make sure your `render()` hook provides a Node.js Stream Pipe, see https://vite-plugin-ssr.com/stream',
      )
    },
  }
}

async function prerenderPage(
  pageContext: {
    url: string
    routeParams: Record<string, string>
    _isPreRendering: true
    _pageId: string
    _usesClientRouter: boolean
    _pageContextAlreadyProvidedByPrerenderHook?: true
  } & PageFiles &
    GlobalContext,
) {
  assert(pageContext._isPreRendering === true)

  objectAssign(pageContext, {
    _isPageContextRequest: false,
  })

  addComputedUrlProps(pageContext)

  await executeOnBeforeRenderHooks(pageContext)

  const renderHookResult = await executeRenderHook(pageContext)
  assertUsage(
    renderHookResult.htmlRender !== null,
    `Cannot pre-render \`${pageContext.url}\` because the \`render()\` hook exported by ${renderHookResult.renderFilePath} didn't return an HTML string.`,
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

async function renderStatic404Page(globalContext: GlobalContext & { _isPreRendering: true }) {
  const errorPageId = getErrorPageId(globalContext._allPageIds)
  if (!errorPageId) {
    return null
  }

  const pageContext = {
    ...globalContext,
    _pageId: errorPageId,
    is404: true,
    routeParams: {},
    url: '/fake-404-url', // A `url` is needed for `applyViteHtmlTransform`
    // `renderStatic404Page()` is about generating `dist/client/404.html` for static hosts; there is no Client Routing.
    _usesClientRouter: false,
  }

  const pageFiles = await loadPageFilesServer(pageContext)
  objectAssign(pageContext, pageFiles)

  return prerenderPage(pageContext)
}

type PageContextPublic = {
  url: string
  urlPathname: string
  urlParsed: PageContextUrls['urlParsed']
  routeParams: Record<string, string>
  Page: unknown
  pageExports: Record<string, unknown>
  exports: Record<string, unknown>
  exportsAll: Record<string, { filePath: string; exportValue: unknown }[]>
  _pageId: string
  is404?: boolean
  pageProps?: Record<string, unknown>
}
function preparePageContextForRelease<T extends PageContextPublic>(pageContext: T) {
  assert(typeof pageContext.url === 'string')
  assert(typeof pageContext.urlPathname === 'string')
  assert(isPlainObject(pageContext.urlParsed))
  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert(isObject(pageContext.exports))
  assert(isObject(pageContext.exportsAll))

  sortPageContext(pageContext)

  if (isErrorPage(pageContext._pageId)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    addIs404ToPageProps(pageContext)
  }
}

async function loadPageFilesServer(pageContext: {
  _pageId: string
  _baseUrl: string
  _baseAssets: string | null
  _pageFilesAll: PageFile[]
  _isPreRendering: boolean
}) {
  const [pageContextAddendum] = await Promise.all([
    loadPageFiles(pageContext._pageFilesAll, pageContext._pageId, false),
    loadPageFilesClientMeta(pageContext._pageFilesAll, pageContext._pageId),
  ])

  const clientEntry = getClientEntry(pageContext._pageFilesAll, pageContext._pageId)

  objectAssign(pageContextAddendum, {
    _passToClient: getStringUnion(pageContextAddendum.exportsAll, 'passToClient'),
  })

  objectAssign(pageContextAddendum, {
    Page: pageContextAddendum.exports.Page ?? pageContextAddendum.exports.default ?? null,
  })

  const isPreRendering = pageContext._isPreRendering
  assert([true, false].includes(isPreRendering))
  const pageDependencies = pageContext._pageFilesAll
    .filter(
      (p) =>
        // (p.fileType === '.page' || p.fileType === '.page.client') &&
        p.fileType !== '.page.route' && (p.isDefaultPageFile || p.pageId === pageContext._pageId),
    )
    .map((p) => p.filePath)
  objectAssign(pageContextAddendum, {
    _getPageAssets: async () => {
      const pageAssets = await getPageAssets(pageContext, pageDependencies, clientEntry, isPreRendering)
      return pageAssets
    },
  })

  return pageContextAddendum
}
async function loadPageFilesClientMeta(pageFilesAll: PageFile[], pageId: string): Promise<void> {
  // Current directory: vite-plugin-ssr/dist/cjs/node/
  const pageFilesClient = getPageFilesClient(pageFilesAll, pageId)
  await Promise.all(pageFilesClient.map((p) => p.loadMeta?.()))
}
function getClientEntry(pageFilesAll: PageFile[], pageId: string): string {
  const pageFilesClient = getPageFilesClient(pageFilesAll, pageId)
  const usesClientRouting = pageFilesClient.some((p) => (p.meta!.exportNames as string[]).includes('clientRouting'))
  const clientEntry = usesClientRouting
    ? '@@vite-plugin-ssr/dist/esm/client/router/entry.js'
    : '@@vite-plugin-ssr/dist/esm/client/entry.js'
  return clientEntry
}
function getPageFilesClient(pageFilesAll: PageFile[], pageId: string) {
  const pageFilesClient = pageFilesAll.filter(
    (p) => p.fileType === '.page.client' && (p.isDefaultPageFile || p.pageId === pageId),
  )
  return pageFilesClient
}

async function executeOnBeforeRenderHooks(
  pageContext: {
    _pageId: string
    _pageContextAlreadyProvidedByPrerenderHook?: true
  } & PageContextExports &
    PageContextPublic,
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
  const hookResult = await onBeforeRender(pageContext)

  assertHookResult(hookResult, 'onBeforeRender', ['pageContext'], hook.filePath)
  const pageContextFromHook = hookResult?.pageContext
  Object.assign(pageContext, pageContextFromHook)
}

async function executeRenderHook(
  pageContext: PageContextPublic & {
    _pageId: string
    _isPreRendering: boolean
    _getPageAssets: () => Promise<PageAssets>
    _passToClient: string[]
    _pageFilesAll: PageFile[]
  },
): Promise<{
  renderFilePath: string
  htmlRender: null | HtmlRender
}> {
  const hook = getHook(pageContext, 'render')
  assertUsage(
    hook,
    'No `render()` hook found. Make sure to define a `*.page.server.js` file with `export function render() { /*...*/ }`. You can also `export { render }` in `_default.page.server.js` which will be the default `render()` hook of all your pages.',
  )
  const render = hook.hook
  const renderFilePath = hook.filePath

  preparePageContextForRelease(pageContext)
  const result = await render(pageContext)
  if (isObject(result) && !isDocumentHtml(result)) {
    assertHookResult(result, 'render', ['documentHtml', 'pageContext'] as const, renderFilePath)
  }
  objectAssign(pageContext, { _renderHook: { hookFilePath: renderFilePath, hookName: 'render' as const } })

  let pageContextPromise: Promise<unknown> | null = null
  if (hasProp(result, 'pageContext')) {
    const pageContextProvidedByUser = result.pageContext
    if (isPromise(pageContextProvidedByUser)) {
      pageContextPromise = pageContextProvidedByUser
    } else {
      assertPageContextProvidedByUser(pageContextProvidedByUser, { hook: pageContext._renderHook })
      Object.assign(pageContext, pageContextProvidedByUser)
    }
  }
  objectAssign(pageContext, { _pageContextProvidedByUserPromise: pageContextPromise })

  const errPrefix = 'The `render()` hook exported by ' + renderFilePath
  const errSuffix = [
    "a string generated with the `escapeInject` template tag or a string returned by `dangerouslySkipEscape('<p>Some HTML</p>')`",
    ', see https://vite-plugin-ssr.com/escapeInject',
  ].join(' ')

  let documentHtml: unknown
  if (!isObject(result) || isDocumentHtml(result)) {
    assertUsage(
      typeof result !== 'string',
      [
        errPrefix,
        'returned a plain JavaScript string which is forbidden;',
        'instead, it should return',
        errSuffix,
      ].join(' '),
    )
    assertUsage(
      result === null || isDocumentHtml(result),
      [
        errPrefix,
        'should return `null`, a string `documentHtml`, or an object `{ documentHtml, pageContext }`',
        'where `pageContext` is `undefined` or an object holding additional `pageContext` values',
        'and `documentHtml` is',
        errSuffix,
      ].join(' '),
    )
    documentHtml = result
  } else {
    assertObjectKeys(result, ['documentHtml', 'pageContext'] as const, errPrefix)
    if ('documentHtml' in result) {
      documentHtml = result.documentHtml
      assertUsage(
        typeof documentHtml !== 'string',
        [
          errPrefix,
          'returned `{ documentHtml }`, but `documentHtml` is a plain JavaScript string which is forbidden;',
          '`documentHtml` should be',
          errSuffix,
        ].join(' '),
      )
      assertUsage(
        documentHtml === undefined || documentHtml === null || isDocumentHtml(documentHtml),
        [errPrefix, 'returned `{ documentHtml }`, but `documentHtml` should be', errSuffix].join(' '),
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
    objectAssign(pageContext, {
      errorWhileRendering: err,
      _serverSideErrorWhileStreaming: true,
    })
  }
  const htmlRender = await renderHtml(documentHtml, pageContext, renderFilePath, onErrorWhileStreaming)
  return { htmlRender, renderFilePath }
}

function assertArguments(...args: unknown[]) {
  const pageContext = args[0]
  assertUsage(pageContext, '`renderPage(pageContext)`: argument `pageContext` is missing.')
  assertUsage(
    isPlainObject(pageContext),
    `\`renderPage(pageContext)\`: argument \`pageContext\` should be a plain JavaScript object, but you passed a \`pageContext\` with \`pageContext.constructor === ${
      (pageContext as any).constructor
    }\`.`,
  )
  assertUsage(
    hasProp(pageContext, 'url'),
    '`renderPage(pageContext)`: The `pageContext` you passed is missing the property `pageContext.url`.',
  )
  assertUsage(
    typeof pageContext.url === 'string',
    '`renderPage(pageContext)`: `pageContext.url` should be a string but `typeof pageContext.url === "' +
      typeof pageContext.url +
      '"`.',
  )
  assertUsage(
    pageContext.url.startsWith('/') || pageContext.url.startsWith('http'),
    '`renderPage(pageContext)`: `pageContext.url` should start with `/` (e.g. `/product/42`) or `http` (e.g. `http://example.org/product/42`) but `pageContext.url === "' +
      pageContext.url +
      '"`.',
  )
  try {
    const { url } = pageContext
    const urlWithOrigin = url.startsWith('http') ? url : 'http://fake-origin.example.org' + url
    // `new URL()` conveniently throws if URL is not an URL
    new URL(urlWithOrigin)
  } catch (err) {
    assertUsage(
      false,
      '`renderPage(pageContext)`: `pageContext.url` should be a URL but `pageContext.url==="' + pageContext.url + '"`.',
    )
  }
  const len = args.length
  assertUsage(
    len === 1,
    `\`renderPage(pageContext)\`: You passed ${len} arguments but \`renderPage()\` accepts only one argument.'`,
  )
}

function warnMissingErrorPage() {
  const { isProduction } = getSsrEnv()
  if (!isProduction) {
    assertWarning(
      false,
      'No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)',
    )
  }
}

function _parseUrl(url: string, baseUrl: string): ReturnType<typeof parseUrl> & { isPageContextRequest: boolean } {
  assert(url.startsWith('/') || url.startsWith('http'))
  assert(baseUrl.startsWith('/'))
  const { urlWithoutPageContextRequestSuffix, isPageContextRequest } = handlePageContextRequestSuffix(url)
  return { ...parseUrl(urlWithoutPageContextRequestSuffix, baseUrl), isPageContextRequest }
}

async function getGlobalContext() {
  const ssrEnv = getSsrEnv()
  const baseUrl = getBaseUrl()
  assertBaseUrl(baseUrl)
  const globalContext = {
    _parseUrl,
    _baseUrl: baseUrl,
    _objectCreatedByVitePluginSsr: true,
  }

  objectAssign(globalContext, {
    _isProduction: ssrEnv.isProduction,
    _viteDevServer: ssrEnv.viteDevServer,
    _root: ssrEnv.root,
    _baseAssets: ssrEnv.baseAssets,
    _outDir: ssrEnv.baseAssets,
  })

  const { pageFilesAll, allPageIds } = await getPageFilesAllServerSide(ssrEnv.isProduction)
  objectAssign(globalContext, {
    _pageFilesAll: pageFilesAll,
    _allPageIds: allPageIds,
  })

  return globalContext
}

function throwPrerenderError(err: unknown) {
  // `err` originates from a user hook throwing; Vite is out of the equation here.
  assert(viteAlreadyLoggedError(err) === false)

  viteErrorCleanup(err)

  if (hasProp(err, 'stack')) {
    throw err
  } else {
    throw new Error(err as any)
  }
}
function logError(err: unknown) {
  assertError(err)

  if (viteAlreadyLoggedError(err)) {
    return
  }

  assertUsage(
    isObject(err),
    'Your source code threw a primitive value as error (this should never happen). Contact the `vite-plugin-ssr` maintainer to get help.',
  )

  // Avoid logging error twice (not sure if this actually ever happens?)
  if (hasAlreadyLogged(err)) {
    return
  }

  viteErrorCleanup(err)

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = (hasProp(err, 'stack') && String(err.stack)) || String(err)
  console.error(errStr)
  setAlreadyLogged(err)
}

function viteAlreadyLoggedError(err: unknown) {
  const { viteDevServer, isProduction } = getSsrEnv()
  if (isProduction) {
    return false
  }
  if (viteDevServer && viteDevServer.config.logger.hasErrorLogged(err as Error)) {
    return true
  }
  return false
}

function hasAlreadyLogged(err: unknown) {
  assert(isObject(err))
  const key = '_wasAlreadyConsoleLogged'
  return err[key] === true
}
function setAlreadyLogged(err: unknown) {
  assert(isObject(err))
  const key = '_wasAlreadyConsoleLogged'
  err[key] = true
}

function viteErrorCleanup(err: unknown) {
  const { viteDevServer } = getSsrEnv()
  if (viteDevServer) {
    if (hasProp(err, 'stack')) {
      // Apply source maps
      viteDevServer.ssrFixStacktrace(err as Error)
    }
  }
}

function getBaseUrl(): string {
  const { baseUrl } = getSsrEnv()
  return baseUrl
}
