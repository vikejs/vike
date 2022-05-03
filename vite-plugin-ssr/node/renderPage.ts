import { getErrorPageId, route, isErrorPage } from '../shared/route'
import { HtmlRender, isDocumentHtml, renderHtml, getHtmlString } from './html/renderHtml'
import {
  loadPageFiles,
  PageFile,
  PageContextExports,
  getStringUnion,
  getPageFilesAllServerSide,
} from '../shared/getPageFiles'
import { getHook } from '../shared/getHook'
import { isHtmlOnlyPage, getExportNames, hasPageExport } from '../shared/pageFilesUtils'
import { stringify } from '@brillout/json-s/stringify'
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
  handlePageContextRequestSuffix,
  parseUrl,
} from './utils'
import type { PageAsset } from './html/injectAssets'
import { getPageAssets } from './renderPage/getPageAssets'
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
  isStream,
  getStreamName,
  inferStreamName,
  isStreamWritableWeb,
  isStreamWritableNode,
} from './html/stream'
import { addIs404ToPageProps, serializePageContextClientSide } from './serializePageContextClientSide'
import { addComputedUrlProps, PageContextUrls } from '../shared/addComputedUrlProps'
import { assertPageContextProvidedByUser } from '../shared/assertPageContextProvidedByUser'
import { isRenderErrorPage, assertRenderErrorPageParentheses } from './renderPage/RenderErrorPage'
import { warn404 } from './renderPage/warn404'
import { ClientDependency } from './retrievePageAssets'
import { getGlobalContext, GlobalContext } from './globalContext'
import { viteAlreadyLoggedError, viteErrorCleanup } from './viteLogging'
import type { ViteDevServer } from 'vite'
import { ViteManifest } from './viteManifest'

export { renderPage }
export { prerenderPage }
export { renderStatic404Page }
export { loadPageFilesServer }

type PageFiles = PromiseType<ReturnType<typeof loadPageFilesServer>>

type GlobalRenderingContext = GlobalContext & {
  _allPageIds: string[]
  _pageFilesAll: PageFile[]
}

async function renderPage_<PageContextAdded extends {}, PageContextInit extends { url: string }>(
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
      warnMissingErrorPage(pageContext)
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

  const globalContext = await getGlobalContext(pageContext._isPreRendering)
  objectAssign(pageContext, globalContext)

  {
    const { pageFilesAll, allPageIds } = await getPageFilesAllServerSide(globalContext._isProduction)
    objectAssign(pageContext, {
      _pageFilesAll: pageFilesAll,
      _allPageIds: allPageIds,
    })
  }

  {
    const { url } = pageContext
    assert(url.startsWith('/') || url.startsWith('http'))
    const { urlWithoutPageContextRequestSuffix, isPageContextRequest } = handlePageContextRequestSuffix(url)
    const { hasBaseUrl } = parseUrl(urlWithoutPageContextRequestSuffix, globalContext._baseUrl)
    if (!hasBaseUrl) {
      objectAssign(pageContext, { httpResponse: null, errorWhileRendering: null })
      return pageContext
    }
    objectAssign(pageContext, {
      _isPageContextRequest: isPageContextRequest,
      _urlProcessor: (url: string) => handlePageContextRequestSuffix(url).urlWithoutPageContextRequestSuffix,
    })
  }

  addComputedUrlProps(pageContext)

  return pageContext
}

// `renderPage()` calls `renderPage_()` while ensuring an `err` is always `console.error(err)` instead of `throw err`, so that `vite-plugin-ssr` never triggers a server shut down. (Throwing an error in an Express.js middleware shuts down the whole Express.js server.)
async function renderPage(pageContextInit: Parameters<typeof renderPage_>[0]): ReturnType<typeof renderPage_> {
  const args = arguments as any as Parameters<typeof renderPage>
  try {
    return await renderPage_.apply(null, args)
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
    warnMissingErrorPage(pageContext)
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
  getWebStream: () => StreamReadableWeb
  pipeToNodeWritable: StreamPipeNode
  pipeToWebWritable: StreamPipeWeb
  pipe: (writable: StreamWritableWeb | StreamWritableNode) => void
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
        assertUsage(false, errMsg('body', 'Use `const body = await pageContext.httpResponse.getBody()` instead.'))
      }
      const body = htmlRender
      return body
    },
    async getBody(): Promise<string> {
      const body = await getHtmlString(htmlRender)
      return body
    },
    async getNodeStream() {
      const nodeStream = await getStreamReadableNode(htmlRender)
      assertUsage(nodeStream !== null, errMsg('getNodeStream()', fixMsg('readable', 'node')))
      return nodeStream
    },
    getWebStream() {
      const webStream = getStreamReadableWeb(htmlRender)
      assertUsage(webStream !== null, errMsg('getWebStream()', fixMsg('readable', 'web')))
      return webStream
    },
    pipeToWebWritable(writable: StreamWritableWeb) {
      const success = pipeToStreamWritableWeb(htmlRender, writable)
      assertUsage(success, errMsg('pipeToWebWritable()'))
    },
    pipeToNodeWritable(writable: StreamWritableNode) {
      const success = pipeToStreamWritableNode(htmlRender, writable)
      assertUsage(success, errMsg('pipeToNodeWritable()'))
    },
    pipe(writable: StreamWritableNode | StreamWritableWeb) {
      if (isStreamWritableWeb(writable)) {
        const success = pipeToStreamWritableWeb(htmlRender, writable)
        assertUsage(success, errMsg('pipe()'))
        return
      }
      if (isStreamWritableNode(writable)) {
        const success = pipeToStreamWritableNode(htmlRender, writable)
        assertUsage(success, errMsg('pipe()'))
        return
      }
      assertUsage(
        false,
        `The object \`writable\` passed to \`pageContext.httpResponse.pipe(writable)\` doesn't seem to be ${getStreamName(
          'writable',
          'web',
        )} nor ${getStreamName('writable', 'node')}.`,
      )
    },
  }

  function errMsg(method: string, fixMsg?: string) {
    let htmlRenderName: string
    if (typeof htmlRender === 'string') {
      htmlRenderName = 'an HTML string'
    } else if (isStream(htmlRender)) {
      htmlRenderName = inferStreamName(htmlRender)
    } else {
      assert(false)
    }
    assert(['a ', 'an ', 'the '].some((s) => htmlRenderName.startsWith(s)))
    return [
      `\`pageContext.httpResponse.${method}\` can't be used because your \`render()\` hook (${renderFilePath}) provides ${htmlRenderName}`,
      fixMsg,
      'See https://vite-plugin-ssr.com/stream',
    ]
      .filter(Boolean)
      .join('. ')
  }
  function fixMsg(type: 'pipe' | 'readable', standard: 'web' | 'node') {
    const streamName = getStreamName(type, standard)
    assert(['a ', 'an ', 'the '].some((s) => streamName.startsWith(s)))
    return `Make sure your \`render()\` hook provides ${streamName} instead`
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
    GlobalRenderingContext,
) {
  assert(pageContext._isPreRendering === true)

  objectAssign(pageContext, {
    _isPageContextRequest: false,
    _urlProcessor: null,
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

async function renderStatic404Page(globalContext: GlobalRenderingContext & { _isPreRendering: true }) {
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
  _isProduction: boolean
  _viteDevServer: null | ViteDevServer
  _manifestClient: null | ViteManifest
}) {
  const [pageContextAddendum] = await Promise.all([
    loadPageFiles(pageContext._pageFilesAll, pageContext._pageId, false),
    loadPageFilesClientExportNames(pageContext._pageFilesAll, pageContext._pageId),
  ])

  const { clientEntry, clientDependencies, isHtmlOnly } = getClientEntries(
    pageContext._pageFilesAll,
    pageContext._pageId,
  )

  objectAssign(pageContextAddendum, {
    _passToClient: getStringUnion(pageContextAddendum.exportsAll, 'passToClient'),
    _isHtmlOnly: isHtmlOnly,
  })

  objectAssign(pageContextAddendum, {
    Page: pageContextAddendum.exports.Page ?? pageContextAddendum.exports.default ?? null,
  })

  const isPreRendering = pageContext._isPreRendering
  assert([true, false].includes(isPreRendering))
  clientDependencies.push(
    ...pageContext._pageFilesAll
      .filter(
        (p) =>
          // Add CSS assets
          //  - `.page.server.js` files are transformed by `?extractStyles`
          p.fileType === '.page.server' && p.isRelevant(pageContext._pageId),
      )
      .map((p) => ({ id: p.filePath, onlyAssets: true })),
  )
  objectAssign(pageContextAddendum, {
    _getPageAssets: async () => {
      if ('_pageAssets' in pageContext) {
        return (pageContext as any as { _pageAssets: PageAsset[] })._pageAssets
      } else {
        const pageAssets = await getPageAssets(pageContext, clientDependencies, clientEntry, isPreRendering)
        objectAssign(pageContext, { _pageAssets: pageAssets })
        return pageContext._pageAssets
      }
    },
  })

  return pageContextAddendum
}
async function loadPageFilesClientExportNames(pageFilesAll: PageFile[], pageId: string): Promise<void> {
  await Promise.all(
    pageFilesAll.filter((p) => p.fileType === '.page.client' && p.isRelevant(pageId)).map((p) => p.loadExportNames?.()),
  )
}
function getClientEntries(
  pageFilesAll: PageFile[],
  pageId: string,
): { clientEntry: null | string; clientDependencies: ClientDependency[]; isHtmlOnly: boolean } {
  let clientEntry: null | string = null
  const pageFilesClient: PageFile[] = []
  const clientDependencies: ClientDependency[] = []

  const { isHtmlOnly, pageFilesClientCandidates } = isHtmlOnlyPage(pageId, pageFilesAll, false)

  // Handle SPA & SSR pages.
  if (!isHtmlOnly) {
    // Pick aAdd the `.page.client.js` file that has `export { render }`
    //  - The filesystem-nearest one
    //  - This means automatic override: only one `render()` hook is loaded and all other `.page.client.js` are dismissed

    // Pick one page file that exports `render()`
    {
      const candidates = pageFilesClientCandidates.filter((p) => getExportNames(p, false).includes('render'))
      const pageFile = candidates[0] // The filesystem-nearest one
      assert(pageFile) // because `isHtmlOnly===false`
      pageFilesClient.push(pageFile)
    }

    // Pick one page file that exports `Page`
    {
      const candidates = pageFilesClientCandidates.filter((p) => hasPageExport(p, false))
      const pageFile = candidates[0] // The filesystem-nearest one
      assert(pageFile) // because `isHtmlOnly===false`
      pageFilesClient.push(pageFile)
    }

    // Pick all page files that don't export `render()` nor `Page`
    {
      const pageFiles = pageFilesClientCandidates.filter(
        (p) => !getExportNames(p, false).includes('render') && !hasPageExport(p, false),
      )
      pageFilesClient.push(...pageFiles)
    }

    clientDependencies.push(...pageFilesClient.map((p) => ({ id: p.filePath, onlyAssets: false })))

    // Add the vps client entry
    {
      const usesClientRouting = pageFilesClient.some((p) => getExportNames(p, false).includes('clientRouting'))
      clientEntry = usesClientRouting
        ? // $userRoot/dist/client/entry-client-routing.js
          '@@vite-plugin-ssr/dist/esm/client/router/entry.js'
        : // $userRoot/dist/client/entry-server-routing.js
          '@@vite-plugin-ssr/dist/esm/client/entry.js'
      clientDependencies.push({ id: clientEntry, onlyAssets: false })
    }
  }

  // Handle HTML-only pages.
  if (isHtmlOnly) {
    // There is no vps client entry; we directly load `.page.client.js` / `.page.js` instead.
    //  - There is no `render()` hook.
    //  - Since there is no `render()` hook we skip page files that export `Page`.
    const entryCandidates = pageFilesClientCandidates.filter((p) => {
      assert(!getExportNames(p, false).includes('render'))
      return !hasPageExport(p, false)
    })
    const entry = entryCandidates[0] // Pick the filesystem-nearest one
    if (entry) {
      clientEntry = entry.filePath
      clientDependencies.push({ id: clientEntry, onlyAssets: false })
    }
    // Add CSS & assets of `.page.js` file that export `Page`
    const pageFile = pageFilesClientCandidates.filter((p) => hasPageExport(p, false))[0]
    if (pageFile) {
      clientDependencies.push({ id: pageFile.filePath, onlyAssets: true })
    }
  }

  // console.log(pageId, pageFilesClientCandidates, clientEntry, clientDependencies)

  return { clientEntry, clientDependencies, isHtmlOnly }
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
    _getPageAssets: () => Promise<PageAsset[]>
    _passToClient: string[]
    _pageFilesAll: PageFile[]
    _isHtmlOnly: boolean
    _isProduction: boolean
    _viteDevServer: ViteDevServer | null
    _baseUrl: string
    _loadedPageFiles: string[]
  },
): Promise<{
  renderFilePath: string
  htmlRender: null | HtmlRender
}> {
  const hook = getHook(pageContext, 'render')
  assertUsage(
    hook,
    `No \`render()\` hook found. See https://vite-plugin-ssr.com/render for more information. Loaded pages (none of them \`export { render }\`):\n${pageContext._loadedPageFiles
      .map((f) => `  ${f}`)
      .join('\n')}`,
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
    'a string generated with the `escapeInject` template tag or a string returned by `dangerouslySkipEscape()`,',
    'see https://vite-plugin-ssr.com/escapeInject',
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
  assert(typeof htmlRender === 'string' || isStream(htmlRender))
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

function warnMissingErrorPage(pageContext: { _isProduction: boolean }) {
  if (!pageContext._isProduction) {
    assertWarning(
      false,
      'No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)',
      { onlyOnce: true },
    )
  }
}

function logError(err: unknown) {
  assertError(err)

  if (viteAlreadyLoggedError(err)) {
    return
  }

  if (!isObject(err)) {
    console.warn('[vite-plugin-ssr] The thrown value is:')
    console.warn(err)
    assertWarning(
      false,
      "Your source code threw a value that is not an object. Make sure to wrap the value with `new Error()`. For example, if your code throws `throw 'some-string'` then do `throw new Error('some-string')` instead. The thrown value is printed above. Feel free to contact vite-plugin-ssr maintainers to get help.",
      { onlyOnce: false },
    )
  }

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
