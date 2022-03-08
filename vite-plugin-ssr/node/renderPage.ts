import { getErrorPageId, route, loadPageRoutes, PageRoutes, isErrorPage } from '../shared/route'
import { HtmlRender, isDocumentHtml, renderHtml, getHtmlString } from './html/renderHtml'
import {
  AllPageFiles,
  getAllPageFiles,
  findPageFile,
  findDefaultFiles,
  findDefaultFilesSorted,
  PageFile,
  PageFilesMetaServer,
  loadPageFiles2,
} from '../shared/getPageFiles'
import { getSsrEnv } from './ssrEnv'
import { stringify } from '@brillout/json-s/stringify'
import {
  assert,
  assertUsage,
  isCallable,
  assertWarning,
  hasProp,
  handlePageContextRequestSuffix,
  isPlainObject,
  isObject,
  objectAssign,
  PromiseType,
  compareString,
  assertExports,
  parseUrl,
  isParsable,
  assertBaseUrl,
  isPromise,
  notNull,
  toPosixPath,
} from './utils'
import { getPageAssets, PageAssets } from './html/injectAssets'
import {
  loadPageIsomorphicFiles,
  PageIsomorphicFile,
  PageIsomorphicFileDefault,
} from '../shared/loadPageIsomorphicFiles'
import {
  assertUsageServerHooksCalled,
  getOnBeforeRenderHook,
  OnBeforeRenderHook,
  runOnBeforeRenderHooks,
} from '../shared/onBeforeRenderHook'
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
import { determinePageIds } from '../shared/determinePageIds'
import { assertPageContextProvidedByUser } from '../shared/assertPageContextProvidedByUser'
import { isRenderErrorPage, assertRenderErrorPageParentheses } from './renderPage/RenderErrorPage'
import { addPageExportsDeprecationWarning } from '../shared/addPageExportsDeprecationWarning'

export { renderPageWithoutThrowing }
export type { renderPage }
export { prerenderPage }
export { renderStatic404Page }
export { getGlobalContext }
export { loadPageFiles }
export type { GlobalContext }
export { loadOnBeforePrerenderHook }
export { throwPrerenderError }

type PageFiles = PromiseType<ReturnType<typeof loadPageFiles>>
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

    if (!pageContext._isPageContextRequest) {
      statusCode = 404
    } else {
      statusCode = 200
    }

    const errorWhileRendering = null

    if (!pageContext._isPageContextRequest) {
      warn404(pageContext)
    }

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

  const pageFiles = await loadPageFiles(pageContext)
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

  // TODO: remove unnecessary extra error handling?
  if ('hookError' in renderHookResult) {
    const err = renderHookResult.hookError
    logError(err)
    return await renderErrorPage(pageContextInit, err)
  }

  if (renderHookResult === null) {
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

  const pageFiles = await loadPageFiles(pageContext)
  objectAssign(pageContext, pageFiles)

  // We swallow hook errors; another error was already shown to the user in the `logError()` at the beginning of this function; the second error is likely the same than the first error anyways.
  await executeOnBeforeRenderHooks(pageContext)
  /*
  const hookResult = await executeOnBeforeRenderHooks(pageContext)
  if ('hookError' in hookResult) {
    warnCouldNotRenderErrorPage(hookResult)
    return pageContext
  }
  */
  const renderHookResult = await executeRenderHook(pageContext)
  if ('hookError' in renderHookResult) {
    warnCouldNotRenderErrorPage(renderHookResult)
    return pageContext
  }

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
  if ('hookError' in renderHookResult) {
    throwPrerenderError(renderHookResult.hookError)
    assert(false)
  }
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

  const pageFiles = await loadPageFiles(pageContext)
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

  sortPageContext(pageContext)

  if (isErrorPage(pageContext._pageId)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    addIs404ToPageProps(pageContext)
  }

  addPageExportsDeprecationWarning(pageContext)
}

type PageServerFileProps = {
  filePath: string
  onBeforeRenderHook: null | OnBeforeRenderHook
  fileExports: {
    render?: Function
    prerender?: Function
    onBeforeRender?: Function
    doNotPrerender?: true
    setPageProps: never
    passToClient?: string[]
    skipOnBeforeRenderDefaultHook?: boolean
  }
}
type PageServerFile = null | PageServerFileProps
//*
type PageServerFiles = { pageServerFiles: PageServerFileProps[] } & (
  | { pageServerFile: PageServerFileProps; pageServerFileDefault: PageServerFileProps }
  | { pageServerFile: null; pageServerFileDefault: PageServerFileProps }
  | { pageServerFile: PageServerFileProps; pageServerFileDefault: null }
)
/*/
type PageServerFiles = {
  pageServerFile: PageServerFile | null
  pageServerFileDefault: PageServerFile | null
}
//*/

async function loadPageFiles(pageContext: {
  _pageId: string
  _baseUrl: string
  _baseAssets: string | null
  _allPageFiles: AllPageFiles
  _isPreRendering: boolean
  _pageFilesMeta: PageFilesMetaServer
}) {
  const { Page, pageExports, pageIsomorphicFile, pageIsomorphicFileDefault } = await loadPageIsomorphicFiles(
    pageContext,
  )

  /*
  const pageContextAddendum = await loadPageFiles2(pageContext._pageId, false)
  const pageClientFilePaths = getPageClientFilePaths(pageContext)
  */

  const { pageServerFile, pageServerFileDefault, pageServerFiles } = await loadPageServerFiles(pageContext)

  const exports: Record<string, unknown> = {}
  Object.assign(exports, pageExports)
  ;[pageIsomorphicFileDefault, pageIsomorphicFile, ...pageServerFiles].filter(notNull).forEach((pageFile) => {
    Object.assign(exports, pageFile.fileExports)
  })

  const pageFiles = {
    Page,
    pageExports,
    exports,
    _pageIsomorphicFile: pageIsomorphicFile,
    _pageIsomorphicFileDefault: pageIsomorphicFileDefault,
    _pageServerFile: pageServerFile,
    _pageServerFiles: pageServerFiles,
    _pageServerFileDefault: pageServerFileDefault,
  }

  objectAssign(pageFiles, {
    _passToClient: pageServerFile?.fileExports.passToClient || pageServerFileDefault?.fileExports.passToClient || [],
  })

  const isPreRendering = pageContext._isPreRendering
  assert([true, false].includes(isPreRendering))
  const dependencies: string[] = [
    pageIsomorphicFile?.filePath,
    pageIsomorphicFileDefault?.filePath,
    ...pageClientFilePaths,
  ].filter((p): p is string => !!p)
  objectAssign(pageFiles, {
    _getPageAssets: async () => {
      const pageAssets = await getPageAssets(pageContext, dependencies, pageClientFilePaths, isPreRendering)
      return pageAssets
    },
  })
  return pageFiles
}
function getPageClientFilePaths(pageContext: { _pageFilesMeta: PageFilesMetaServer }): string[] {
  // Current directory: vite-plugin-ssr/dist/cjs/node/
  const usesClientRouter = Object.values(pageContext._pageFilesMeta['.page.client']).some(({ exportNames }) =>
    exportNames.includes('usesClientRouter'),
  )
  let entryPath: string
  if (usesClientRouter) {
    entryPath = toPosixPath(require.resolve('../../../dist/esm/client/router/entry.js'))
  } else {
    entryPath = toPosixPath(require.resolve('../../../dist/esm/client/entry.js'))
  }
  if (!entryPath.startsWith('/')) {
    assert(process.platform === 'win32')
    entryPath = '/' + entryPath
  }
  return ['/@fs' + entryPath]
  /*
  let p = require.resolve('../../../dist/esm/client/router/entry.js')
  console.log('p', p)
  //p = p.slice(process.cwd().length)
  p = '/@fs' + p
  console.log('pp', p)
  return [p]
  /*
  const { _pageId: pageId, _allPageFiles: allPageFiles } = pageContext
  const pageClientFiles = allPageFiles['.page.client']
  assertUsage(
    pageClientFiles.length > 0,
    'No `*.page.client.js` file found. Make sure to create one. You can create a `_default.page.client.js` which will apply as default to all your pages.',
  )
  const pageClientFilePaths = findPageFiles(pageClientFiles, pageId).map(p => p.filePath)
  return pageClientFilePaths
  */
}
async function loadPageServerFiles(pageContext: {
  _pageId: string
  _allPageFiles: AllPageFiles
}): Promise<PageServerFiles> {
  const pageId = pageContext._pageId
  let serverFiles = pageContext._allPageFiles['.page.server']
  assertUsage(
    serverFiles.length > 0,
    'No `*.page.server.js` file found. Make sure to create one. You can create a `_default.page.server.js` which will apply as default to all your pages.',
  )

  const [pageServerFile, ...pageServerFileDefaults] = await Promise.all([
    loadPageServerFile(findPageFile(serverFiles, pageId)),
    ...findDefaultFilesSorted(serverFiles, pageId).map(loadPageServerFile),
  ])
  const pageServerFileDefault = pageServerFileDefaults[0] || null
  const pageServerFiles = [pageServerFile, ...pageServerFileDefaults].filter(notNull)
  assert(pageServerFile || pageServerFileDefault)
  if (pageServerFile !== null) {
    return { pageServerFile, pageServerFileDefault, pageServerFiles }
  }
  if (pageServerFileDefault !== null) {
    return { pageServerFile, pageServerFileDefault, pageServerFiles }
  }
  assert(false)

  async function loadPageServerFile(serverFile: null | PageFile): Promise<null | PageServerFile> {
    if (serverFile === null) {
      return null
    }
    const fileExports = await serverFile.loadFile()
    const { filePath } = serverFile
    assertExportsOfServerPage(fileExports, filePath)
    assert_pageServerFile(fileExports, filePath)
    const onBeforeRenderHook = getOnBeforeRenderHook(fileExports, filePath)
    return { filePath, fileExports, onBeforeRenderHook }
  }

  function assert_pageServerFile(
    fileExports: Record<string, unknown>,
    filePath: string,
  ): asserts fileExports is PageServerFileProps['fileExports'] {
    assert(filePath)
    assert(fileExports)

    const render = fileExports['render']
    assertUsage(!render || isCallable(render), `The \`render()\` hook defined in ${filePath} should be a function.`)

    assertUsage(
      !('onBeforeRender' in fileExports) || isCallable(fileExports['onBeforeRender']),
      `The \`onBeforeRender()\` hook defined in ${filePath} should be a function.`,
    )

    assertUsage(
      !('passToClient' in fileExports) || hasProp(fileExports, 'passToClient', 'string[]'),
      `The \`passToClient_\` export defined in ${filePath} should be an array of strings.`,
    )

    const prerender = fileExports['prerender']
    assertUsage(
      !prerender || isCallable(prerender),
      `The \`prerender()\` hook defined in ${filePath} should be a function.`,
    )
  }
}

type OnBeforePrerenderHook = (globalContext: { _pageRoutes: PageRoutes }) => unknown
async function loadOnBeforePrerenderHook(globalContext: {
  _allPageFiles: AllPageFiles
}): Promise<null | { onBeforePrerenderHook: OnBeforePrerenderHook; hookFilePath: string }> {
  const defautFiles = findDefaultFiles(globalContext._allPageFiles['.page.server'])
  let onBeforePrerenderHook: OnBeforePrerenderHook | null = null
  let hookFilePath: string | undefined = undefined
  await Promise.all(
    defautFiles.map(async ({ filePath, loadFile }) => {
      const fileExports = await loadFile()
      assertExportsOfServerPage(fileExports, filePath)
      if ('onBeforePrerender' in fileExports) {
        assertUsage(
          hasProp(fileExports, 'onBeforePrerender', 'function'),
          `The \`export { onBeforePrerender }\` in ${filePath} should be a function.`,
        )
        assertUsage(
          onBeforePrerenderHook === null,
          'There can be only one `onBeforePrerender()` hook. If you need to be able to define several, open a new GitHub issue.',
        )
        onBeforePrerenderHook = fileExports.onBeforePrerender
        hookFilePath = filePath
      }
    }),
  )
  if (!onBeforePrerenderHook) {
    return null
  }
  assert(hookFilePath)
  return { onBeforePrerenderHook, hookFilePath }
}

function assertExportsOfServerPage(fileExports: Record<string, unknown>, filePath: string) {
  assertExports(
    fileExports,
    filePath,
    ['render', 'onBeforeRender', 'passToClient', 'prerender', 'doNotPrerender', 'onBeforePrerender'],
    {
      ['_onBeforePrerender']: 'onBeforePrerender',
    },
    {
      ['addPageContext']: 'onBeforeRender',
    },
  )
}

async function executeOnBeforeRenderHooks(
  pageContext: {
    _pageId: string
    _pageServerFile: PageServerFile
    _pageServerFileDefault: PageServerFile
    _pageIsomorphicFile: PageIsomorphicFile
    _pageIsomorphicFileDefault: PageIsomorphicFileDefault
    _pageContextAlreadyProvidedByPrerenderHook?: true
    _isPageContextRequest: boolean
  } & PageContextPublic,
): Promise<void> {
  if (pageContext._pageContextAlreadyProvidedByPrerenderHook) {
    return
  }

  let serverHooksCalled: boolean = false
  let skipServerHooks: boolean = false

  if (isomorphicHooksExist() && !pageContext._isPageContextRequest) {
    const pageContextAddendum = await runOnBeforeRenderHooks(
      pageContext._pageIsomorphicFile,
      pageContext._pageIsomorphicFileDefault,
      {
        ...pageContext,
        skipOnBeforeRenderServerHooks,
        runOnBeforeRenderServerHooks,
      },
    )
    Object.assign(pageContext, pageContextAddendum)
    assertUsageServerHooksCalled({
      hooksServer: [
        pageContext._pageServerFile?.onBeforeRenderHook && pageContext._pageServerFile.filePath,
        pageContext._pageServerFileDefault?.onBeforeRenderHook && pageContext._pageServerFileDefault.filePath,
      ],
      hooksIsomorphic: [
        pageContext._pageIsomorphicFile?.onBeforeRenderHook && pageContext._pageIsomorphicFile.filePath,
        pageContext._pageIsomorphicFileDefault?.onBeforeRenderHook && pageContext._pageIsomorphicFileDefault.filePath,
      ],
      serverHooksCalled,
      _pageId: pageContext._pageId,
    })
  } else {
    const { pageContext: pageContextAddendum } = await runOnBeforeRenderServerHooks()
    Object.assign(pageContext, pageContextAddendum)
  }

  return undefined

  function isomorphicHooksExist() {
    return (
      !!pageContext._pageIsomorphicFile?.onBeforeRenderHook ||
      !!pageContext._pageIsomorphicFileDefault?.onBeforeRenderHook
    )
  }

  async function skipOnBeforeRenderServerHooks() {
    assertUsage(
      serverHooksCalled === false,
      'You cannot call `pageContext.skipOnBeforeRenderServerHooks()` after having called `pageContext.runOnBeforeRenderServerHooks()`.',
    )
    skipServerHooks = true
  }

  async function runOnBeforeRenderServerHooks() {
    assertUsage(
      skipServerHooks === false,
      'You cannot call `pageContext.runOnBeforeRenderServerHooks()` after having called `pageContext.skipOnBeforeRenderServerHooks()`.',
    )
    assertUsage(
      serverHooksCalled === false,
      'You already called `pageContext.runOnBeforeRenderServerHooks()`; you cannot call it a second time.',
    )
    serverHooksCalled = true
    const pageContextAddendum = await runOnBeforeRenderHooks(
      pageContext._pageServerFile,
      pageContext._pageServerFileDefault,
      pageContext,
    )
    return { pageContext: pageContextAddendum }
  }
}

type LoadedPageFiles = {
  _getPageAssets: () => Promise<PageAssets>
  _pageServerFile: PageServerFile
  _pageServerFiles: PageServerFileProps[]
  _pageServerFileDefault: PageServerFile
  _pageIsomorphicFile: PageIsomorphicFile
  _pageIsomorphicFileDefault: PageIsomorphicFileDefault
  _passToClient: string[]
}

async function executeRenderHook(
  pageContext: PageContextPublic & {
    _pageId: string
    _isPreRendering: boolean
  } & LoadedPageFiles,
): Promise<
  | {
      renderFilePath: string
      htmlRender: null | HtmlRender
    }
  | {
      hookError: unknown
      hookName: string
      hookFilePath: string
    }
> {
  assert(pageContext._pageServerFiles)
  let render
  let renderFilePath
  for (const pageServerFile of pageContext._pageServerFiles) {
    const pageRenderFunction = pageServerFile?.fileExports.render
    if (pageRenderFunction) {
      render = pageRenderFunction
      renderFilePath = pageServerFile.filePath
      break
    }
  }
  assertUsage(
    render,
    'No `render()` hook found. Make sure to define a `*.page.server.js` file with `export function render() { /*...*/ }`. You can also `export { render }` in `_default.page.server.js` which will be the default `render()` hook of all your pages.',
  )
  assert(renderFilePath)

  preparePageContextForRelease(pageContext)

  const hookName = 'render'

  let result: unknown
  try {
    // We use a try-catch because the `render()` hook is user-defined and may throw an error.
    result = await render(pageContext)
  } catch (hookError) {
    return { hookError, hookName, hookFilePath: renderFilePath }
  }
  if (isObject(result) && !isDocumentHtml(result)) {
    assertHookResult(result, hookName, ['documentHtml', 'pageContext'] as const, renderFilePath)
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
  if (hasProp(htmlRender, 'hookError')) {
    return { hookError: htmlRender.hookError, hookName, hookFilePath: renderFilePath }
  }
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
function warnCouldNotRenderErrorPage({ hookFilePath, hookName }: { hookFilePath: string; hookName: string }) {
  assert(!hookName.endsWith('()'))
  assertWarning(
    false,
    `The error page \`_error.page.js\` could be not rendered because your \`${hookName}()\` hook exported by ${hookFilePath} threw an error.`,
  )
}
function warn404(pageContext: { urlPathname: string; _pageRoutes: PageRoutes }) {
  const { isProduction } = getSsrEnv()
  const pageRoutes = pageContext._pageRoutes
  assertUsage(
    pageRoutes.length > 0,
    'No page found. Create a file that ends with the suffix `.page.js` (or `.page.vue`, `.page.jsx`, ...).',
  )
  const { urlPathname } = pageContext
  if (!isProduction && !isFileRequest(urlPathname)) {
    assertWarning(
      false,
      [
        `URL \`${urlPathname}\` is not matching any of your ${pageRoutes.length} page routes (this warning is not shown in production):`,
        ...getPagesAndRoutesInfo(pageRoutes),
      ].join('\n'),
    )
  }
}
function getPagesAndRoutesInfo(pageRoutes: PageRoutes) {
  return pageRoutes
    .map((pageRoute) => {
      const { pageId, filesystemRoute, pageRouteFile } = pageRoute
      let route
      let routeType
      if (pageRouteFile) {
        const { routeValue } = pageRouteFile
        route =
          typeof routeValue === 'string'
            ? routeValue
            : truncateString(String(routeValue).split(/\s/).filter(Boolean).join(' '), 64)
        routeType = typeof routeValue === 'string' ? 'Route String' : 'Route Function'
      } else {
        route = filesystemRoute
        routeType = 'Filesystem Route'
      }
      return `\`${route}\` (${routeType} of \`${pageId}.page.*\`)`
    })
    .sort(compareString)
    .map((line, i) => {
      const nth = (i + 1).toString().padStart(pageRoutes.length.toString().length, '0')
      return ` (${nth}) ${line}`
    })
}

function truncateString(str: string, len: number) {
  if (len > str.length) {
    return str
  } else {
    str = str.substring(0, len)
    return str + '...'
  }
}

function isFileRequest(urlPathname: string) {
  assert(urlPathname.startsWith('/'))
  const paths = urlPathname.split('/')
  const lastPath = paths[paths.length - 1]
  assert(typeof lastPath === 'string')
  const parts = lastPath.split('.')
  if (parts.length < 2) {
    return false
  }
  const fileExtension = parts[parts.length - 1]
  assert(typeof fileExtension === 'string')
  return /^[a-z0-9]+$/.test(fileExtension)
}

function _parseUrl(url: string, baseUrl: string): ReturnType<typeof parseUrl> & { isPageContextRequest: boolean } {
  assert(url.startsWith('/') || url.startsWith('http'))
  assert(baseUrl.startsWith('/'))
  const { urlWithoutPageContextRequestSuffix, isPageContextRequest } = handlePageContextRequestSuffix(url)
  return { ...parseUrl(urlWithoutPageContextRequestSuffix, baseUrl), isPageContextRequest }
}

async function getGlobalContext() {
  const ssrEnv = getSsrEnv()
  const globalContext = {
    _parseUrl,
    _baseUrl: getBaseUrl(),
    _baseAssets: ssrEnv.baseAssets,
    _objectCreatedByVitePluginSsr: true,
  }
  assertBaseUrl(globalContext._baseUrl)

  const allPageFiles = await getAllPageFiles(ssrEnv.isProduction)
  objectAssign(globalContext, {
    _allPageFiles: allPageFiles,
  })

  const allPageIds = determinePageIds(allPageFiles)
  objectAssign(globalContext, { _allPageIds: allPageIds })

  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(globalContext)
  objectAssign(globalContext, { _pageRoutes: pageRoutes, _onBeforeRouteHook: onBeforeRouteHook })

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
