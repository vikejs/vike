import { getErrorPageId, getAllPageIds, route, isErrorPage, loadPageRoutes, PageRoutes } from '../shared/route'
import { EscapeResult, isEscapeInject, renderEscapeInject, getHtmlString } from './html/escapeInject'
import { AllPageFiles, getAllPageFiles_serverSide, findPageFile, findDefaultFiles } from '../shared/getPageFiles'
import { getSsrEnv } from './ssrEnv'
import { posix as pathPosix } from 'path'
import { stringify } from '@brillout/json-s'
import {
  assert,
  assertUsage,
  lowerFirst,
  isCallable,
  cast,
  assertWarning,
  hasProp,
  handlePageContextRequestSuffix,
  getUrlPathname,
  isPlainObject,
  isObject,
  getUrlParsed,
  UrlParsed,
  objectAssign,
  PromiseType,
  compareString,
  assertExports,
  stringifyStringArray,
  handleUrlOrigin
} from '../shared/utils'
import { analyzeBaseUrl } from './baseUrlHandling'
import { getPageAssets, PageAssets } from './html/injectAssets'
import { loadPageView } from '../shared/loadPageView'
import { sortPageContext } from '../shared/sortPageContext'
import {
  getNodeStream,
  getWebStream,
  pipeToStreamWritableWeb,
  pipeToStreamWritableNode,
  StreamPipeNode,
  StreamPipeWeb,
  StreamReadableNode,
  StreamReadableWeb,
  StreamWritableNode,
  StreamWritableWeb
} from './html/stream'

export { renderPage }
export { prerenderPage }
export { renderStatic404Page }
export { getGlobalContext }
export { loadPageFiles }
export type { GlobalContext }
export { addComputedUrlProps }
export { loadOnBeforePrerenderHook }

type PageFilesData = PromiseType<ReturnType<typeof loadPageFiles>>
type GlobalContext = PromiseType<ReturnType<typeof getGlobalContext>>

async function renderPage<T extends { url: string } & Record<string, unknown>>(
  pageContext: T
): Promise<T & Record<string, unknown> & { httpResponse: HttpResponse }> {
  /* Not very useful because of HTTP response `{ pageContext404PageDoesNotExist: true }` with status code `200`
  : Promise<T & Record<string, unknown> & (({ httpResponse: null}) | ({httpResponse: { statusCode: 500, body: string}}) | (PageContextBuiltIn & { statusCode: 404 | 500; body: string }))>
  */
  assertArguments(...arguments)

  if (pageContext.url.endsWith('/favicon.ico')) {
    objectAssign(pageContext, { httpResponse: null })
    return pageContext
  }

  const { isPageContextRequest, hasBaseUrl } = analyzeUrl(pageContext.url)
  if (!hasBaseUrl) {
    objectAssign(pageContext, { httpResponse: null })
    return pageContext
  }
  objectAssign(pageContext, {
    _isPageContextRequest: isPageContextRequest
  })

  addComputedUrlProps(pageContext)

  const globalContext = await getGlobalContext()
  objectAssign(globalContext, { _isPreRendering: false as const })
  objectAssign(pageContext, globalContext)

  // *** Route ***
  // We use a try-catch because `route()` executes `.page.route.js` source code which is
  // written by the user and may contain errors.
  let pageContextRouteAddendum
  try {
    // We use a try-catch because we execute user-defined `*.page.*` files which may contain an error.
    pageContextRouteAddendum = await route(pageContext)
  } catch (err) {
    objectAssign(pageContext, { _err: err })
    const httpResponse = await handleRenderError(pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }

  // *** Handle 404 ***
  let statusCode: 200 | 404
  if (pageContextRouteAddendum._pageId === null) {
    if (!pageContext._isPageContextRequest) {
      warn404(pageContext)
    }
    const errorPageId = getErrorPageId(pageContext._allPageIds)
    if (!errorPageId) {
      warnMissingErrorPage()
      if (pageContext._isPageContextRequest) {
        const httpResponse = createHttpResponseObject(
          stringify({
            pageContext404PageDoesNotExist: true
          }),
          {
            statusCode: 200,
            renderFilePath: null
          }
        )
        objectAssign(pageContext, { httpResponse })
        return pageContext
      } else {
        const httpResponse = null
        objectAssign(pageContext, { httpResponse })
        return pageContext
      }
    }
    if (!pageContext._isPageContextRequest) {
      statusCode = 404
    } else {
      statusCode = 200
    }
    pageContextRouteAddendum = { _pageId: errorPageId, is404: true, routeParams: {} }
  } else {
    statusCode = 200
  }
  assert(hasProp(pageContextRouteAddendum, '_pageId', 'string'))
  assert(isPlainObject(pageContextRouteAddendum.routeParams))
  objectAssign(pageContext, pageContextRouteAddendum)

  const pageFilesData = await loadPageFiles(pageContext)
  objectAssign(pageContext, pageFilesData)

  try {
    // We use a try-catch because we execute user-defined `*.page.*` files which may contain an error.
    await executeAddPageContextHook(pageContext)
    executeAddPageContextHook_addTypes(pageContext)
  } catch (err) {
    objectAssign(pageContext, { _err: err })
    const httpResponse = await handleRenderError(pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }

  if (pageContext._isPageContextRequest) {
    const pageContextSerialized = serializeClientPageContext(pageContext)
    const httpResponse = createHttpResponseObject(pageContextSerialized, { statusCode: 200, renderFilePath: null })
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }

  let renderHookResult: RenderHookResult
  try {
    // We use a try-catch because we execute user-defined `*.page.*` files which may contain an error.
    renderHookResult = await executeRenderHook(pageContext)
  } catch (err) {
    objectAssign(pageContext, { _err: err })
    const httpResponse = await handleRenderError(pageContext)
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }
  if (renderHookResult === null) {
    objectAssign(pageContext, { httpResponse: null })
    return pageContext
  } else {
    const { escapeResult, renderFilePath } = renderHookResult
    const httpResponse = createHttpResponseObject(escapeResult, { statusCode, renderFilePath })
    objectAssign(pageContext, { httpResponse })
    return pageContext
  }
}

async function handleRenderError(
  pageContext: PageContextUrls & {
    url: string
    _allPageIds: string[]
    _allPageFiles: AllPageFiles
    _isPreRendering: false
    _isPageContextRequest: boolean
    _pageContextClient?: PageContextClient
    _err: unknown
  }
): Promise<HttpResponse> {
  handleError(pageContext._err)

  if (pageContext._isPageContextRequest) {
    const { body, statusCode } = renderPageContextError(pageContext._err)
    const httpResponse = createHttpResponseObject(body, { statusCode, renderFilePath: null })
    return httpResponse
  }

  const errorPageId = getErrorPageId(pageContext._allPageIds)
  if (errorPageId === null) {
    warnMissingErrorPage()
    return null
  }

  objectAssign(pageContext, {
    is404: false,
    _pageId: errorPageId,
    _isPageContextRequest: false,
    routeParams: {} as Record<string, string>
  })

  const pageFilesData = await loadPageFiles(pageContext)
  objectAssign(pageContext, pageFilesData)

  if (!pageContext._pageContextClient) {
    try {
      // We use a try-catch because we execute user-defined `*.page.*` files which may contain an error.
      await executeAddPageContextHook(pageContext)
      executeAddPageContextHook_addTypes(pageContext)
    } catch (err) {
      // We purposely swallow the error, because another error was already shown to the user in `handleError()`.
      // (And chances are high that this is the same error.)
      return null
    }
  }
  assert(hasProp(pageContext, '_pageContextClient', 'object'))

  let renderHookResult: RenderHookResult
  try {
    // We use a try-catch because we execute user-defined `*.page.*` files which may contain an error.
    renderHookResult = await executeRenderHook(pageContext)
  } catch (err) {
    // We purposely swallow the error, because another error was already shown to the user in `handleError()`.
    // (And chances are high that this is the same error.)
    return null
  }

  const { escapeResult, renderFilePath } = renderHookResult
  const httpResponse = createHttpResponseObject(escapeResult, { statusCode: 500, renderFilePath })
  return httpResponse
}

type HttpResponse = null | {
  statusCode: 200 | 404 | 500
  body: string
  getBody: () => Promise<string>
  bodyNodeStream: StreamReadableNode
  bodyWebStream: StreamReadableWeb
  bodyPipeToNodeWritable: StreamPipeNode
  bodyPipeToWebWritable: StreamPipeWeb
}
function createHttpResponseObject(
  escapeResult: null | EscapeResult,
  { statusCode, renderFilePath }: { statusCode: 200 | 404 | 500; renderFilePath: null | string }
): HttpResponse {
  if (escapeResult === null) {
    return null
  }

  return {
    statusCode,
    get body() {
      if (typeof escapeResult !== 'string') {
        assert(renderFilePath)
        assertUsage(
          false,
          '`pageContext.httpResponse.body` is not available because your `render()` hook (' +
            renderFilePath +
            ') provides an HTML stream. Use `const body = await pageContext.httpResponse.getBody()` instead, see https://vite-plugin-ssr.com/html-streaming'
        )
      }
      const body = escapeResult
      return body
    },
    async getBody(): Promise<string> {
      const body = await getHtmlString(escapeResult)
      return body
    },
    get bodyNodeStream() {
      assert(escapeResult !== null)
      const nodeStream = getNodeStream(escapeResult)
      assertUsage(
        nodeStream !== null,
        '`pageContext.httpResponse.bodyNodeStream` is not available: make sure your `render()` hook provides a Node.js Stream, see https://vite-plugin-ssr.com/html-streaming'
      )
      return nodeStream
    },
    get bodyWebStream() {
      assert(escapeResult !== null)
      const webStream = getWebStream(escapeResult)
      assertUsage(
        webStream !== null,
        '`pageContext.httpResponse.bodyWebStream` is not available: make sure your `render()` hook provides a Web Stream, see https://vite-plugin-ssr.com/html-streaming'
      )
      return webStream
    },
    bodyPipeToWebWritable(writable: StreamWritableWeb) {
      const success = pipeToStreamWritableWeb(escapeResult, writable)
      assertUsage(
        success,
        '`pageContext.httpResponse.pipeToWebWritable` is not available: make sure your `render()` hook provides a Web Stream Pipe, see https://vite-plugin-ssr.com/html-streaming'
      )
    },
    bodyPipeToNodeWritable(writable: StreamWritableNode) {
      const success = pipeToStreamWritableNode(escapeResult, writable)
      assertUsage(
        success,
        '`pageContext.httpResponse.pipeToNodeWritable` is not available: make sure your `render()` hook provides a Node.js Stream Pipe, see https://vite-plugin-ssr.com/html-streaming'
      )
    }
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
    _allPageFiles: AllPageFiles
  } & PageFilesData
) {
  assert(pageContext._isPreRendering === true)

  addComputedUrlProps(pageContext)

  await executeAddPageContextHook(pageContext)
  executeAddPageContextHook_addTypes(pageContext)

  const renderHookResult = await executeRenderHook(pageContext)
  assertUsage(
    renderHookResult.escapeResult !== null,
    "Pre-rendering requires your `render()` hook to provide HTML. Open a GitHub issue if that's a problem for you."
  )
  assert(!('_isPageContextRequest' in pageContext))
  const documentHtml = await getHtmlString(renderHookResult.escapeResult)
  assert(typeof documentHtml === 'string')
  if (!pageContext._usesClientRouter) {
    return { documentHtml, pageContextSerialized: null }
  } else {
    const pageContextSerialized = serializeClientPageContext(pageContext)
    return { documentHtml, pageContextSerialized }
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
    _usesClientRouter: false
  }

  const pageFilesData = await loadPageFiles(pageContext)
  objectAssign(pageContext, pageFilesData)

  return prerenderPage(pageContext)
}

function getDefaultPassToClientProps(pageContext: { _pageId: string; pageProps?: Record<string, unknown> }): string[] {
  const passToClient = []
  if (isErrorPage(pageContext._pageId)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    const pageProps = pageContext.pageProps || {}
    pageProps['is404'] = pageProps['is404'] || pageContext.is404
    pageContext.pageProps = pageProps
    passToClient.push(...['pageProps', 'is404'])
  }
  return passToClient
}

function serializeClientPageContext(pageContext: { _pageContextClient: PageContextClient }) {
  const pageContextClient = pageContext._pageContextClient
  assert(isPlainObject(pageContextClient))
  const pageContextSerialized = stringify({
    pageContext: pageContextClient
  })
  return pageContextSerialized
}

type PageContextPublic = {
  url: string
  urlNormalized: string
  urlPathname: string
  urlParsed: UrlParsed
  routeParams: Record<string, string>
  Page: unknown
  pageExports: Record<string, unknown>
}
function preparePageContextNode<T extends PageContextPublic>(pageContext: T) {
  assert(typeof pageContext.url === 'string')
  assert(typeof pageContext.urlNormalized === 'string')
  assert(typeof pageContext.urlPathname === 'string')
  assert(isPlainObject(pageContext.urlParsed))
  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  sortPageContext(pageContext)
}

type PageServerFileProps = {
  filePath: string
  fileExports: {
    render?: Function
    prerender?: Function
    onBeforeRender?: Function
    doNotPrerender?: true
    setPageProps: never
    passToClient?: string[]
  }
}
type PageServerFile = null | PageServerFileProps
//*
type PageServerFiles =
  | { pageServerFile: PageServerFileProps; pageServerFileDefault: PageServerFileProps }
  | { pageServerFile: null; pageServerFileDefault: PageServerFileProps }
  | { pageServerFile: PageServerFileProps; pageServerFileDefault: null }
/*/
type PageServerFiles = {
  pageServerFile: PageServerFile | null
  pageServerFileDefault: PageServerFile | null
}
//*/

function assert_pageServerFile(pageServerFile: {
  filePath: string
  fileExports: Record<string, unknown>
}): asserts pageServerFile is PageServerFileProps {
  if (pageServerFile === null) return

  const { filePath, fileExports } = pageServerFile
  assert(filePath)
  assert(fileExports)

  const render = fileExports['render']
  assertUsage(!render || isCallable(render), `The \`render()\` hook defined in ${filePath} should be a function.`)

  assertUsage(
    !('onBeforeRender' in fileExports) || isCallable(fileExports['onBeforeRender']),
    `The \`onBeforeRender()\` hook defined in ${filePath} should be a function.`
  )

  assertUsage(
    !('passToClient' in fileExports) || hasProp(fileExports, 'passToClient', 'string[]'),
    `The \`passToClient_\` export defined in ${filePath} should be an array of strings.`
  )

  const prerender = fileExports['prerender']
  assertUsage(
    !prerender || isCallable(prerender),
    `The \`prerender()\` hook defined in ${filePath} should be a function.`
  )
}

async function loadPageFiles(pageContext: { _pageId: string; _allPageFiles: AllPageFiles; _isPreRendering: boolean }) {
  const pageView = await loadPageView(pageContext)
  const pageClientPath = getPageClientPath(pageContext)

  const { pageServerFile, pageServerFileDefault } = await loadPageServerFiles(pageContext)

  const pageFilesData = {
    ...pageView,
    _pageServerFile: pageServerFile,
    _pageServerFileDefault: pageServerFileDefault,
    _pageClientPath: pageClientPath
  }

  const passToClient: string[] = [
    ...getDefaultPassToClientProps(pageContext),
    ...(pageServerFile?.fileExports.passToClient || pageServerFileDefault?.fileExports.passToClient || [])
  ]
  objectAssign(pageFilesData, {
    _passToClient: passToClient
  })

  const isPreRendering = pageContext._isPreRendering
  assert([true, false].includes(isPreRendering))
  const dependencies: string[] = [pageView._pageFilePath, pageClientPath].filter((p): p is string => p !== null)
  const pageAssets = await getPageAssets(pageContext, dependencies, pageClientPath, isPreRendering)
  objectAssign(pageFilesData, {
    _pageAssets: pageAssets
  })
  return pageFilesData
}
function getPageClientPath(pageContext: { _pageId: string; _allPageFiles: AllPageFiles }): string {
  const { _pageId: pageId, _allPageFiles: allPageFiles } = pageContext
  const pageClientFiles = allPageFiles['.page.client']
  assertUsage(
    pageClientFiles.length > 0,
    'No `*.page.client.js` file found. Make sure to create one. You can create a `_default.page.client.js` which will apply as default to all your pages.'
  )
  const pageClientPath =
    findPageFile(pageClientFiles, pageId)?.filePath || findDefaultFile(pageClientFiles, pageId)?.filePath
  assert(pageClientPath)
  return pageClientPath
}
async function loadPageServerFiles(pageContext: {
  _pageId: string
  _allPageFiles: AllPageFiles
}): Promise<PageServerFiles> {
  const pageId = pageContext._pageId
  let serverFiles = pageContext._allPageFiles['.page.server']
  assertUsage(
    serverFiles.length > 0,
    'No `*.page.server.js` file found. Make sure to create one. You can create a `_default.page.server.js` which will apply as default to all your pages.'
  )

  const serverFile = findPageFile(serverFiles, pageId)
  const serverFileDefault = findDefaultFile(serverFiles, pageId)
  assert(serverFile || serverFileDefault)
  const pageServerFile = !serverFile
    ? null
    : {
        filePath: serverFile.filePath,
        fileExports: await serverFile.loadFile()
      }
  if (pageServerFile) {
    assertExportsOfServerPage(pageServerFile.fileExports, pageServerFile.filePath)
  }
  const pageServerFileDefault = !serverFileDefault
    ? null
    : {
        filePath: serverFileDefault.filePath,
        fileExports: await serverFileDefault.loadFile()
      }
  if (pageServerFileDefault) {
    assertExportsOfServerPage(pageServerFileDefault.fileExports, pageServerFileDefault.filePath)
  }
  if (pageServerFile !== null) {
    assert_pageServerFile(pageServerFile)
  }
  if (pageServerFileDefault !== null) {
    assert_pageServerFile(pageServerFileDefault)
  }
  if (pageServerFile !== null) {
    return { pageServerFile, pageServerFileDefault }
  }
  if (pageServerFileDefault !== null) {
    return { pageServerFile, pageServerFileDefault }
  }
  assert(false)
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
          `The \`export { onBeforePrerender }\` in ${filePath} should be a function.`
        )
        assertUsage(
          onBeforePrerenderHook === null,
          'There can be only one `onBeforePrerender()` hook. If you need to be able to define several, open a new GitHub issue.'
        )
        onBeforePrerenderHook = fileExports.onBeforePrerender
        hookFilePath = filePath
      }
    })
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
      ['_onBeforePrerender']: 'onBeforePrerender'
    },
    {
      ['addPageContext']: 'onBeforeRender'
    }
  )
}

type PageContextUser = Record<string, unknown>
type PageContextClient = { _pageId: string } & Record<string, unknown>
async function executeAddPageContextHook(
  pageContext: {
    _pageId: string
    _pageServerFile: PageServerFile
    _pageServerFileDefault: PageServerFile
    _passToClient: string[]
    _pageContextAlreadyProvidedByPrerenderHook?: true
  } & PageContextPublic
) {
  const onBeforeRender =
    pageContext._pageServerFile?.fileExports.onBeforeRender ||
    pageContext._pageServerFileDefault?.fileExports.onBeforeRender
  if (!pageContext._pageContextAlreadyProvidedByPrerenderHook && onBeforeRender) {
    const filePath = pageContext._pageServerFile?.filePath || pageContext._pageServerFileDefault?.filePath
    assert(filePath)
    preparePageContextNode(pageContext)

    const result: unknown = await onBeforeRender(pageContext)
    assertHookResult(result, 'onBeforeRender', ['pageContext'] as const, filePath)
    Object.assign(pageContext, result?.pageContext)
  }

  const pageContextClient: PageContextClient = { _pageId: pageContext._pageId }
  pageContext._passToClient.forEach((prop) => {
    pageContextClient[prop] = (pageContext as PageContextUser)[prop]
  })
  ;(pageContext as Record<string, unknown>)['_pageContextClient'] = pageContextClient
}
function executeAddPageContextHook_addTypes<PageContext extends Record<string, unknown>>(
  pageContext: PageContext
): asserts pageContext is PageContext & { _pageContextClient: PageContextClient } {
  pageContext // make TS happy
}

type LoadedPageFiles = {
  _pageAssets: PageAssets
  _pageServerFile: PageServerFile
  _pageServerFileDefault: PageServerFile
  _pageFilePath: string | null
  _pageClientPath: string
  _passToClient: string[]
}
type RenderHookResult = { escapeResult: null | EscapeResult; renderFilePath: string }
async function executeRenderHook(
  pageContext: PageContextPublic & {
    _pageId: string
    _pageContextClient: PageContextClient
  } & LoadedPageFiles
): Promise<RenderHookResult> {
  assert(pageContext._pageServerFile || pageContext._pageServerFileDefault)
  let render
  let renderFilePath
  const pageServerFile = pageContext._pageServerFile
  const pageRenderFunction = pageServerFile?.fileExports.render
  if (pageServerFile && pageRenderFunction) {
    render = pageRenderFunction
    renderFilePath = pageServerFile.filePath
  } else {
    const pageServerFileDefault = pageContext._pageServerFileDefault
    const pageDefaultRenderFunction = pageServerFileDefault?.fileExports.render
    if (pageServerFileDefault && pageDefaultRenderFunction) {
      render = pageDefaultRenderFunction
      renderFilePath = pageServerFileDefault.filePath
    }
  }
  assertUsage(
    render,
    'No `render()` hook found. Make sure to define a `*.page.server.js` file with `export function render() { /*...*/ }`. You can also `export { render }` in `_default.page.server.js` which will be the default `render()` hook of all your pages.'
  )
  assert(renderFilePath)

  preparePageContextNode(pageContext)
  const result: unknown = await render(pageContext)
  if (isObject(result) && !isEscapeInject(result)) {
    assertHookResult(result, 'render', ['documentHtml', 'pageContext'] as const, renderFilePath)
  }

  if (hasProp(result, 'pageContext')) {
    Object.assign(pageContext, result.pageContext)
  }

  const errPrefix = 'The `render()` hook exported by ' + renderFilePath
  const errSuffix = [
    "a string generated with the `escapeInject` template tag or a string returned by `dangerouslySkipEscape('<p>Some HTML</p>')`",
    ', see https://vite-plugin-ssr.com/escapeInject'
  ].join(' ')

  let documentHtml: unknown
  if (!isObject(result) || isEscapeInject(result)) {
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
      result === null || isEscapeInject(result),
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
    assertKeys(result, ['documentHtml', 'pageContext'] as const, errPrefix)
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
        documentHtml === undefined || documentHtml === null || isEscapeInject(documentHtml),
        [errPrefix, 'returned `{ documentHtml }`, but `documentHtml` should be', errSuffix].join(' ')
      )
    }
  }

  assert(documentHtml === undefined || documentHtml === null || isEscapeInject(documentHtml))

  if (documentHtml === null || documentHtml === undefined) {
    return { escapeResult: null, renderFilePath }
  }

  const escapeResult = await renderEscapeInject(documentHtml, pageContext, renderFilePath)
  return { escapeResult, renderFilePath }
}

function assertHookResult<Keys extends readonly string[]>(
  hookResult: unknown,
  hookName: string,
  hookResultKeys: Keys,
  hookFile: string
): asserts hookResult is undefined | null | { [key in Keys[number]]?: unknown } {
  const errPrefix = `The \`${hookName}()\` hook exported by ${hookFile}`
  assertUsage(
    hookResult === null || hookResult === undefined || isPlainObject(hookResult),
    `${errPrefix} should return \`null\`, \`undefined\`, or a plain JavaScript object.`
  )
  if (hookResult === undefined || hookResult === null) {
    return
  }
  assertKeys(hookResult, hookResultKeys, errPrefix)
}

function assertKeys<Keys extends readonly string[]>(
  obj: Record<string, unknown>,
  keysExpected: Keys,
  errPrefix: string
): asserts obj is { [key in Keys[number]]?: unknown } {
  const keysUnknown: string[] = []
  const keys = Object.keys(obj)
  for (const key of keys) {
    if (!keysExpected.includes(key)) {
      keysUnknown.push(key)
    }
  }
  assertUsage(
    keysUnknown.length === 0,
    [
      errPrefix,
      'returned an object with unknown keys',
      stringifyStringArray(keysUnknown) + '.',
      'Only following keys are allowed:',
      stringifyStringArray(keysExpected) + '.'
    ].join(' ')
  )
}

function findDefaultFile<T extends { filePath: string }>(pageFiles: T[], pageId: string): T | null {
  const defautFiles = findDefaultFiles(pageFiles)

  // Sort `_default.page.server.js` files by filesystem proximity to pageId's `*.page.js` file
  defautFiles.sort(
    lowerFirst(({ filePath }) => {
      if (filePath.startsWith(pageId)) return -1
      assert(!filePath.includes('\\'))
      assert(!pageId.includes('\\'))
      const relativePath = pathPosix.relative(pageId, filePath)
      assert(!relativePath.includes('\\'))
      const changeDirCount = relativePath.split('/').length
      return changeDirCount
    })
  )

  return defautFiles[0] || null
}

function assertArguments(...args: unknown[]) {
  const pageContext = args[0]
  assertUsage(pageContext, '`renderPage(pageContext)`: argument `pageContext` is missing.')
  assertUsage(
    isPlainObject(pageContext),
    `\`renderPage(pageContext)\`: argument \`pageContext\` should be a plain JavaScript object, but you passed a \`pageContext\` with \`pageContext.constructor === ${
      (pageContext as any).constructor
    }\`.`
  )
  assertUsage(
    hasProp(pageContext, 'url'),
    '`renderPage(pageContext)`: The `pageContext` you passed is missing the property `pageContext.url`.'
  )
  assertUsage(
    typeof pageContext.url === 'string',
    '`renderPage(pageContext)`: `pageContext.url` should be a string but `typeof pageContext.url === "' +
      typeof pageContext.url +
      '"`.'
  )
  assertUsage(
    pageContext.url.startsWith('/') || pageContext.url.startsWith('http'),
    '`renderPage(pageContext)`: `pageContext.url` should start with `/` (e.g. `/product/42`) or `http` (e.g. `http://example.org/product/42`) but `pageContext.url === "' +
      pageContext.url +
      '"`.'
  )
  try {
    const { url } = pageContext
    const urlWithOrigin = url.startsWith('http') ? url : 'http://fake-origin.example.org' + url
    // `new URL()` conveniently throws if URL is not an URL
    new URL(urlWithOrigin)
  } catch (err) {
    assertUsage(
      false,
      '`renderPage(pageContext)`: `pageContext.url` should be a URL but `pageContext.url==="' + pageContext.url + '"`.'
    )
  }
  const len = args.length
  assertUsage(
    len === 1,
    `\`renderPage(pageContext)\`: You passed ${len} arguments but \`renderPage()\` accepts only one argument.'`
  )
}

function warnMissingErrorPage() {
  const { isProduction } = getSsrEnv()
  if (!isProduction) {
    assertWarning(
      false,
      'No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)'
    )
  }
}
function warn404(pageContext: { urlPathname: string; _pageRoutes: PageRoutes }) {
  const { isProduction } = getSsrEnv()
  const pageRoutes = pageContext._pageRoutes
  assertUsage(
    pageRoutes.length > 0,
    'No page found. Create a file that ends with the suffix `.page.js` (or `.page.vue`, `.page.jsx`, ...).'
  )
  const { urlPathname } = pageContext
  if (!isProduction && !isFileRequest(urlPathname)) {
    assertWarning(
      false,
      [
        `URL \`${urlPathname}\` is not matching any of your ${pageRoutes.length} page routes (this warning is not shown in production):`,
        ...getPagesAndRoutesInfo(pageRoutes)
      ].join('\n')
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

function renderPageContextError(err?: unknown) {
  if (err) {
    handleError(err)
  }
  const httpResponse = {
    body: stringify({
      userError: true
    }),
    statusCode: 500 as const
  }
  return httpResponse
}

function handleError(err: unknown) {
  const { viteDevServer } = getSsrEnv()
  if (viteDevServer) {
    cast<Error>(err)
    if (err?.stack) {
      viteDevServer.ssrFixStacktrace(err)
    }
  }
  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = (hasProp(err, 'stack') && String(err.stack)) || String(err)
  console.error(errStr)
}

type PageContextUrls = { urlNormalized: string; urlPathname: string; urlParsed: UrlParsed }

function analyzeUrl(url: string): {
  urlNormalized: string
  isPageContextRequest: boolean
  hasBaseUrl: boolean
} {
  assert(url.startsWith('/') || url.startsWith('http'))

  const { urlWithoutPageContextRequestSuffix, isPageContextRequest } = handlePageContextRequestSuffix(url)
  url = urlWithoutPageContextRequestSuffix

  const { urlWithoutBaseUrl, hasBaseUrl } = analyzeBaseUrl(url)
  url = urlWithoutBaseUrl

  url = handleUrlOrigin(url).urlWithoutOrigin
  assert(url.startsWith('/'))

  const urlNormalized = url
  assert(urlNormalized.startsWith('/'))
  return { urlNormalized, isPageContextRequest, hasBaseUrl }
}

function addComputedUrlProps<PageContext extends Record<string, unknown> & { url: string }>(
  pageContext: PageContext
): asserts pageContext is PageContext & PageContextUrls {
  if ('urlNormalized' in pageContext) {
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlNormalized')?.get === urlNormalizedGetter)
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlPathname')?.get === urlPathnameGetter)
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlParsed')?.get === urlParsedGetter)
  } else {
    Object.defineProperty(pageContext, 'urlNormalized', { get: urlNormalizedGetter })
    Object.defineProperty(pageContext, 'urlPathname', { get: urlPathnameGetter })
    Object.defineProperty(pageContext, 'urlParsed', { get: urlParsedGetter })
  }
}
function urlNormalizedGetter(this: { url: string }) {
  assert(hasProp(this, 'url', 'string'))
  return analyzeUrl(this.url).urlNormalized
}
function urlPathnameGetter(this: { urlNormalized: string }) {
  return getUrlPathname(this.urlNormalized)
}
function urlParsedGetter(this: { urlNormalized: string }) {
  return getUrlParsed(this.urlNormalized)
}

async function getGlobalContext() {
  const globalContext = {}

  const allPageFiles = await getAllPageFiles_serverSide()
  objectAssign(globalContext, {
    _allPageFiles: allPageFiles
  })

  const allPageIds = await getAllPageIds(allPageFiles)
  objectAssign(globalContext, { _allPageIds: allPageIds })

  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(globalContext)
  objectAssign(globalContext, { _pageRoutes: pageRoutes, _onBeforeRouteHook: onBeforeRouteHook })

  return globalContext
}
