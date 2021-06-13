import { getErrorPageId, getPageIds, route, isErrorPage, loadPageRoutes, getFilesystemRoute } from './route.shared'
import { renderHtmlTemplate, isHtmlTemplate, injectAssets_internal } from './html/index.node'
import { getViteManifest, ViteManifest } from './getViteManifest.node'
import { getPageFile, getPageFiles, PageFile } from './page-files/getPageFiles.shared'
import { getSsrEnv } from './ssrEnv.node'
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
  isPageContextUrl,
  removePageContextUrlSuffix,
  getUrlPathname,
  getUrlFull,
  isPlainObject,
  getUrlParsed,
  UrlParsed
} from './utils'
import { prependBaseUrl, removeBaseUrl, startsWithBaseUrl } from './baseUrlHandling'

export { renderPage }
export { prerenderPage }
export { populatePageContext }
export { assert_pageContext_populated }
export { renderStatic404Page }

async function renderPage(
  pageContext: { url: string } & Record<string, unknown>
): Promise<
  | { nothingRendered: true; renderResult: undefined; statusCode: undefined }
  | {
      nothingRendered: false
      renderResult: string | unknown
      statusCode: 200 | 404 | 500
    }
> {
  assertArguments(...arguments)
  let { url } = pageContext
  assert(url)

  if (url.endsWith('/favicon.ico')) {
    return {
      nothingRendered: true,
      renderResult: undefined,
      statusCode: undefined
    }
  }

  const { urlWithoutOrigin, urlNormalized, isPageContextRequest, hasBaseUrl } = analyzeUrl(url)
  if (!hasBaseUrl) {
    return {
      nothingRendered: true,
      renderResult: undefined,
      statusCode: undefined
    }
  }

  pageContext.url = urlWithoutOrigin
  pageContext.urlNormalized = urlNormalized
  assert(hasProp(pageContext, 'urlNormalized', 'string'))
  addUrlPropsToPageContext(pageContext)

  pageContext._isPageContextRequest = isPageContextRequest
  assert(hasProp(pageContext, '_isPageContextRequest', 'boolean'))

  const allPageIds = await getPageIds()
  pageContext._allPageIds = allPageIds
  assert(hasProp(pageContext, '_allPageIds', 'string[]'))

  // *** Route ***
  // We use a try-catch because `route()` executes `.page.route.js` source code which is
  // written by the user and may contain errors.
  let routeResult
  try {
    routeResult = await route(pageContext.urlNormalized, allPageIds, pageContext)
  } catch (err) {
    pageContext._err = err
    assert(hasProp(pageContext, '_err'))
    if (pageContext._isPageContextRequest) {
      return renderPageContextError(err)
    } else {
      return await render500Page(pageContext)
    }
  }

  // *** Handle 404 ***
  let statusCode: 200 | 404
  if (!routeResult) {
    if (!pageContext._isPageContextRequest) {
      await warn404(pageContext.urlNormalized, allPageIds)
    }
    const errorPageId = getErrorPageId(allPageIds)
    if (!errorPageId) {
      warnMissingErrorPage()
      if (pageContext._isPageContextRequest) {
        return renderPageContext404PageDoesNotExist()
      }
      return {
        nothingRendered: true,
        renderResult: undefined,
        statusCode: undefined
      }
    }
    if (!pageContext._isPageContextRequest) {
      statusCode = 404
    } else {
      statusCode = 200
    }
    routeResult = { pageId: errorPageId, pageContextAddendum: { is404: true } }
  } else {
    statusCode = 200
  }

  const { pageId, pageContextAddendum } = routeResult
  pageContext.pageId = pageId
  assert(hasProp(pageContext, 'pageId', 'string'))
  Object.assign(pageContext, pageContextAddendum)

  // *** Render ***
  // We use a try-catch because `renderPageId()` execute a `*.page.*` file which is
  // written by the user and may contain an error.
  let renderResult
  try {
    renderResult = await renderPageId(pageContext)
  } catch (err) {
    pageContext._err = err
    assert(hasProp(pageContext, '_err'))
    if (pageContext._isPageContextRequest) {
      return renderPageContextError(err)
    } else {
      return await render500Page(pageContext)
    }
  }

  return { nothingRendered: false, renderResult, statusCode }
}

async function renderPageId(
  pageContext: Record<string, unknown> & {
    pageId: string
    url: string
    urlNormalized: string
    _isPageContextRequest: boolean
  }
) {
  pageContext.isPreRendering = false
  assert(hasProp(pageContext, 'isPreRendering', 'boolean'))

  await populatePageContext(pageContext)
  assert_pageContext_populated(pageContext)
  //const renderData = await getRenderData(pageId, pageContext, pageContextAlreadyFetched, false)

  if (pageContext.isPageContextRequest) {
    const renderResult = serializeClientPageContext(pageContext)
    return renderResult
  } else {
    const renderResult = await renderHtml(pageContext)
    return renderResult
  }
}

async function prerenderPage(
  pageContext: {
    pageId: string
    _serializedPageContextClientNeeded: boolean
    _pageContextAlreadyAddedInPrerenderHook: boolean
    url: string
    pageContextClient: Record<string, unknown>
  } & Record<string, unknown>
) {
  assert_pageContext_populated(pageContext)

  addUrlPropsToPageContext(pageContext)

  pageContext.isPageContextRequest = false
  assert(hasProp(pageContext, 'isPageContextRequest', 'boolean'))
  pageContext.isPreRendering = true
  assert(hasProp(pageContext, 'isPreRendering', 'boolean'))

  //assert_pageContext_full(pageContext)

  //const renderData = await getRenderData(pageId, pageContext, pageContextAlreadyFetched, true)

  const htmlDocument = await renderHtml(pageContext)
  assertUsage(
    typeof htmlDocument === 'string',
    "Pre-rendering requires your `html()` hook to return a string. Open a GitHub issue if that's a problem for you."
  )
  if (!pageContext._serializedPageContextClientNeeded) {
    return { htmlDocument, pageContextSerialized: null }
  } else {
    const pageContextSerialized = serializeClientPageContext(pageContext)
    return { htmlDocument, pageContextSerialized }
  }
}

async function renderStatic404Page() {
  const allPageIds = await getPageIds()
  const errorPageId = getErrorPageId(allPageIds)
  if (!errorPageId) {
    return null
  }
  const pageContext = {
    pageId: errorPageId,
    is404: true,
    url: '/fake-404-url', // A `url` is needed for `applyViteHtmlTransform`
    // `renderStatic404Page()` is about generating `dist/client/404.html` for static hosts; there is no Client-Side Routing.
    _serializedPageContextClientNeeded: false,
    _pageContextAlreadyAddedInPrerenderHook: false
  }
  populatePageContext(pageContext)
  assert_pageContext_populated(pageContext)
  return prerenderPage(pageContext)
}

function getDefaultPassToClientProps(pageContext: { pageId: string; pageProps?: Record<string, unknown> }): string[] {
  const passToClient = ['pageId']
  if (isErrorPage(pageContext.pageId)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    const pageProps = pageContext.pageProps || {}
    pageProps.is404 = pageProps.is404 || pageContext.is404
    pageContext.pageProps = pageProps
    passToClient.push(...['pageProps', 'is404'])
  }
  return passToClient
}

type PageContext = {
  urlNormalized: string
  pageServerFile?: {
    fileExports: {
      render?: Function
    }
    filePath: string
  }
  pageServerFileDefault?: {
    fileExports: {
      render?: Function
    }
    filePath: string
  }
  isPreRendering: boolean
} & Record<string, unknown>

function serializeClientPageContext(pageContext: { pageContextClient: Record<string, unknown> }) {
  const { pageContextClient } = pageContext
  assert(isPlainObject(pageContextClient))
  const pageContextSerialized = stringify({
    pageContext: pageContextClient
  })
  return pageContextSerialized
}

function assert_pageContext_full(pageContext: { pageId: string; url: string; urlNormalized: string; urlParsed: {} }) {
  assert(typeof pageContext.url === 'string')
  assert(typeof pageContext.urlNormalized === 'string')
  assert(typeof pageContext.urlPathname === 'string')
  assert(pageContext.urlParsed)
  assert(pageContext.Page)
  assert(pageContext.pageExports)
  assert(pageContext.urlParsed)
}
type PageFileLoaded = {
  filePath: string
  fileExports: Record<string, unknown>
}
type AllPageFiles = {
  pageClientFilePath: string
  pageViewFile: PageFileLoaded
} & PageServerFiles

type PageServerFile = {
  filePath: string
  fileExports: Record<string, unknown> & {
    render?: Function
    prerender?: Function
    addPageContext?: Function
    setPageProps: never
    passToClient?: string[]
  }
}
//*
type PageServerFiles =
  | { pageServerFile: PageServerFile; pageServerFileDefault: PageServerFile }
  | { pageServerFile: null; pageServerFileDefault: PageServerFile }
  | { pageServerFile: PageServerFile; pageServerFileDefault: null }
/*/
type PageServerFiles = {
  pageServerFile: PageServerFile | null
  pageServerFileDefault: PageServerFile | null
}
//*/

async function loadAllPageFiles(pageId: string): Promise<AllPageFiles> {
  // todo: parallelize loading
  const pageViewFile: PageFileLoaded = await loadPageViewFile(pageId)
  const pageClientFilePath: string = await getPageClientFile(pageId)
  const pageServerFiles: PageServerFiles = await loadPageServerFiles(pageId)
  return { pageViewFile, pageClientFilePath, ...pageServerFiles }
}
async function getPageClientFile(pageId: string): Promise<string> {
  let pageClientFiles = await getPageFiles('.page.client')
  assertUsage(
    pageClientFiles.length > 0,
    'No `*.page.client.js` file found. Make sure to create one. You can create a `_default.page.client.js` which will apply as default to all your pages.'
  )
  let pageClientFile = findPageSpecific(pageClientFiles, pageId)
  if (!pageClientFile) {
    pageClientFile = findDefault(pageClientFiles, pageId)
    assert(pageClientFile)
  }
  return pageClientFile.filePath
}
async function loadPageViewFile(pageId: string): Promise<PageFileLoaded> {
  const pageFile = await getPageFile('.page', pageId)
  const { filePath, loadFile } = pageFile
  const fileExports = await loadFile()
  return { filePath, fileExports }
}
async function loadPageServerFiles(pageId: string): Promise<PageServerFiles> {
  let serverFiles = await getPageFiles('.page.server')
  assertUsage(
    serverFiles.length > 0,
    'No `*.page.server.js` file found. Make sure to create one. You can create a `_default.page.server.js` which will apply as default to all your pages.'
  )

  const serverFile = findPageSpecific(serverFiles, pageId)
  const serverFileDefault = findDefault(serverFiles, pageId)
  assert(serverFile || serverFileDefault)
  const pageServerFile = !serverFile
    ? null
    : {
        filePath: serverFile.filePath,
        fileExports: await serverFile.loadFile()
      }
  const pageServerFileDefault = !serverFileDefault
    ? null
    : {
        filePath: serverFileDefault.filePath,
        fileExports: await serverFileDefault.loadFile()
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
function assert_pageServerFile(pageServerFile: {
  filePath: string
  fileExports: Record<string, unknown>
}): asserts pageServerFile is PageServerFile {
  if (pageServerFile === null) return

  const { filePath, fileExports } = pageServerFile
  assert(filePath)
  assert(fileExports)

  assertUsage(
    !('setPageProps' in fileExports),
    "The `setPageProps()` hook is deprecated: instead, return `pageProps` in your `addPageContext()` hook and use `passToClient = ['pageProps']` to pass `context.pageProps` to the browser. See `BREAKING CHANGE` in `CHANGELOG.md`. (You have a `export { setPageProps }` in `" +
      filePath +
      '`.)'
  )

  const render = fileExports.render
  assertUsage(!render || isCallable(render), `The \`render()\` hook defined in ${filePath} should be a function.`)

  const addPageContext = fileExports.addPageContext
  assertUsage(
    !addPageContext || isCallable(addPageContext),
    `The \`addPageContext()\` hook defined in ${filePath} should be a function.`
  )

  assertUsage(
    !('passToClient' in fileExports) || hasProp(fileExports, 'passToClient', 'string[]'),
    `The \`passToClient_\` export defined in ${filePath} should be an array of strings.`
  )

  const prerender = fileExports.prerender
  assertUsage(
    !prerender || isCallable(prerender),
    `The \`prerender()\` hook defined in ${filePath} should be a function.`
  )
}
async function populatePageContext(pageContext: { pageId: string } & Record<string, unknown>): Promise<void> {
  assert(pageContext.pageId)
  const allPageFiles = await loadAllPageFiles( pageContext.pageId)

  const { pageViewFile } = allPageFiles
  const pageExports = pageViewFile.fileExports
  assert(pageExports)
  const Page = pageViewFile.fileExports.Page || pageViewFile.fileExports.default
  assertUsage(Page, `${pageViewFile.fileExports.filePath} should have a \`export { Page }\` (or a default export).`)
  pageContext.Page = Page
  assert(hasProp(pageContext, 'Page'))
  pageContext.pageExports = pageExports
  assert(hasProp(pageContext, 'pageExports', 'object'))

  const { pageServerFile, pageServerFileDefault} = allPageFiles
  pageContext.passToClient = {
    ...getDefaultPassToClientProps(pageContext),
    ...(pageServerFile?.fileExports.passToClient || pageServerFileDefault?.fileExports.passToClient || [])
  }
  assert(hasProp(pageContext, 'passToClient', 'string[]'))

  const { pageClientFilePath} = allPageFiles
  pageContext.pageAssets = getPageAssets(pageContext)
}

type PageServerFile3 = {
  fileExports: Record<string, unknown> & {
    prerender?: Function
    render?: Function
    addPageContext?: Function
    passToClient?: string[]
  }
  filePath: string
}
type PageContextPopulated = {
  pageId: string
  url: string
  _pageServerFile: PageServerFile3
  pageServerFileDefault: PageServerFile3
  pageContextClient: Record<string, unknown>
}
function assert_pageContext_populated<PageContext extends Record<string, unknown>>(
  pageContext: PageContext
): asserts pageContext is PageContext & PageContextPopulated {
  // @ts-ignore
  // prettier-ignore
  const { _pageServerFile: { fileExports, filePath } } = pageContext
  assert(Object.keys(fileExports).length >= 1)
  assert(filePath)
}
async function renderHtml(pageContext: PageContext) {
  const { addPageContextFunction } = pageFunctions
  if (!pageContextAlreadyFetched && addPageContextFunction) {
    assertPageContext(pageContext)
    assert(hasProp(pageContext, 'Page'))
    const pageContextAddendum = await addPageContextFunction.addPageContext(pageContext)
    assertUsage(
      isPlainObject(pageContextAddendum),
      `The \`addPageContext()\` hook exported by ${addPageContextFunction.filePath} should return a plain JavaScript object.`
    )
    Object.assign(pageContext, pageContextAddendum)
  }

  const pageContext__client: Record<string, unknown> = {}
  pageContext.passToClient.forEach((prop) => {
    pageContext__client[prop] = pageContext[prop]
  })
  pageContext.pageContextClient = pageContext__client

  let render
  let renderFilePath
  const { _pageServerFile } = pageContext
  const pageRenderFunction = _pageServerFile?.fileExports.render
  if (_pageServerFile && pageRenderFunction) {
    render = pageRenderFunction
    renderFilePath = _pageServerFile.filePath
  }
  assertUsage(
    render,
    'No `render()` hook found. Make sure to define a `*.page.server.js` file with `export function render() { /*...*/ }`. You can also `export { render }` in `_default.page.server.js` which will be the default `render()` hook of all your pages.'
  )
  const { pageServerFileDefault } = pageContext
  const pageDefaultRenderFunction = pageServerFileDefault?.fileExports.render
  if (pageServerFileDefault && pageDefaultRenderFunction) {
    render = pageDefaultRenderFunction
    renderFilePath = pageServerFileDefault.filePath
  }
  assert(render)
  assert(renderFilePath)

  const { isProduction = false } = getSsrEnv()
  let clientManifest: null | ViteManifest = null
  let serverManifest: null | ViteManifest = null
  const { isPreRendering } = pageContext
  if (isPreRendering || isProduction) {
    const manifests = retrieveViteManifest(isPreRendering)
    clientManifest = manifests.clientManifest
    serverManifest = manifests.serverManifest
  }

  assertPageContext(pageContext)
  assert(hasProp(pageContext, 'Page'))
  const renderResult: unknown = await render(pageContext)

  if (!isHtmlTemplate(renderResult)) {
    // Allow user to return whatever he wants in their `render` hook, such as `{redirectTo: '/some/path'}`.
    if (typeof renderResult !== 'string') {
      return renderResult
    }
    assertUsage(
      typeof renderResult !== 'string',
      `The \`render()\` hook exported by ${renderFilePath} returned an unsafe (i.e. unescaped) string. Make sure to return a sanitized (i.e. escaped) string by using the \`html\` template tag (\`import { html } from 'vite-plugin-ssr'\`). Alternatively, you can use \`html.injectAssets()\` and wrap your entire html with \`html.dangerouslySkipEscape()\`.`
    )
  } else {
    let htmlDocument: string = renderHtmlTemplate(renderResult, renderFilePath)
    htmlDocument = await injectAssets_internal(htmlDocument, pageContext)
    return htmlDocument
  }
}

type PageServerFile2 = {
  filePath: string
  fileExports: {
    prerender?: Function
    render?: Function
    passToClient?: string[]
  } & Record<string, unknown>
}
type ViewComponent = unknown
type PageViewFile = {
  filePath: string
  fileExports: (
    | {
        default?: ViewComponent
      }
    | {
        Page?: Function
      }
  ) &
    Record<string, unknown>
}

function findPageSpecific<T extends { filePath: string }>(pageFiles: T[], pageId: string): T | null {
  const hits = pageFiles.filter(({ filePath }) => {
    assert(filePath.startsWith('/'))
    assert(!filePath.includes('\\'))
    assert(!pageId.includes('\\'))
    return filePath.startsWith(pageId)
  })
  assert(hits.length <= 1)
  return hits.length === 1 ? hits[0] : null
}
function findDefault<T extends { filePath: string }>(pageFiles: T[], pageId: string): T | null {
  const hits = pageFiles.filter(({ filePath }) => {
    assert(filePath.startsWith('/'))
    assert(!filePath.includes('\\'))
    return filePath.includes('/_default')
  })

  // Sort `_default.page.server.js` files by filesystem proximity to pageId's `*.page.js` file
  hits.sort(
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

  return hits.length === 1 ? hits[0] : null
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
    '`renderPage(pageContext)`: `pageContext.url` should be a string but we got `typeof pageContext.url === "' +
      typeof pageContext.url +
      '"`.'
  )
  try {
    removeOrigin(pageContext.url)
  } catch (err) {
    assertUsage(
      false,
      '`renderPage(pageContext)`: argument `pageContext.url` should be a URL but we got `url==="' +
        pageContext.url +
        '"`.'
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
async function warn404(urlNormalized: string, allPageIds: string[]) {
  const { isProduction } = getSsrEnv()
  const relevantPageIds = allPageIds.filter((pageId) => !isErrorPage(pageId))
  assertUsage(
    relevantPageIds.length > 0,
    'No page found. Create a file that ends with the suffix `.page.js` (or `.page.vue`, `.page.jsx`, ...).'
  )
  if (!isProduction && !isFileRequest(urlNormalized)) {
    assertWarning(
      false,
      `No page is matching the URL \`${getUrlPathname(
        urlNormalized
      )}\`. ${await getPagesAndRoutesInfo()}. (This warning is not shown in production.)`
    )
  }
}
async function getPagesAndRoutesInfo(): Promise<string> {
  const allPageIds = await getPageIds()
  const pageRoutes = await loadPageRoutes()
  const relevantPageIds = allPageIds.filter((pageId) => !isErrorPage(pageId))
  return [
    `You defined ${relevantPageIds.length} pages:`,
    relevantPageIds
      .map((pageId, i) => {
        let routeInfo
        let routeSrc
        if (!(pageId in pageRoutes)) {
          routeInfo = `\`${getFilesystemRoute(pageId, allPageIds)}\``
          routeSrc = 'Filesystem Routing'
        } else {
          const { pageRoute, pageRouteFile } = pageRoutes[pageId]
          const pageRouteStringified = truncateString(String(pageRoute).split(/\s/).filter(Boolean).join(' '), 64)
          routeInfo = `\`${pageRouteStringified}\``
          const routeType = typeof pageRoute === 'string' ? 'Route String' : 'Route Function'
          const routeFile = pageRouteFile
          routeSrc = `${routeType} defined in \`${routeFile}\``
        }
        return `(${i + 1}) \`${pageId}.page.*\` with route ${routeInfo} (${routeSrc})`
      })
      .join(', ')
  ].join(' ')
}

function truncateString(str: string, len: number) {
  if (len > str.length) {
    return str
  } else {
    str = str.substring(0, len)
    return str + '...'
  }
}

function isFileRequest(urlNormalized: string) {
  const urlPathname = getUrlPathname(urlNormalized)
  assert(urlPathname.startsWith('/'))
  const paths = urlPathname.split('/')
  const lastPath = paths[paths.length - 1]
  const parts = lastPath.split('.')
  if (parts.length < 2) {
    return false
  }
  const fileExtension = parts[parts.length - 1]
  return /^[a-z0-9]+$/.test(fileExtension)
}

async function render500Page(
  pageContext: Record<string, unknown> & {
    url: string
    urlNormalized: string
    _allPageIds: string[]
    _err: unknown
  }
): Promise<
  | { nothingRendered: true; renderResult: undefined; statusCode: undefined }
  | { nothingRendered: false; renderResult: string | unknown; statusCode: 500 }
> {
  handleErr(pageContext._err)

  const errorPageId = getErrorPageId(pageContext._allPageIds)
  if (errorPageId === null) {
    warnMissingErrorPage()
    return {
      nothingRendered: true,
      renderResult: undefined,
      statusCode: undefined
    }
  }

  pageContext.is404 = false
  assert(hasProp(pageContext, 'is404', 'boolean'))
  pageContext.pageId = errorPageId
  assert(hasProp(pageContext, 'pageId', 'string'))
  pageContext._isPageContextRequest = false
  assert(hasProp(pageContext, '_isPageContextRequest', 'boolean'))

  let renderResult
  try {
    renderResult = await renderPageId(pageContext)
  } catch (err) {
    // We purposely swallow the error, because another error was already shown to the user in `handleErr()`.
    // (And chances are high that this is the same error.)
    return {
      nothingRendered: true,
      renderResult: undefined,
      statusCode: undefined
    }
  }
  return { nothingRendered: false, renderResult, statusCode: 500 }
}

function renderPageContextError(err?: unknown): { nothingRendered: false; renderResult: string; statusCode: 500 } {
  if (err) {
    handleErr(err)
  }
  const renderResult = stringify({
    userError: true
  })
  return { nothingRendered: false, renderResult, statusCode: 500 }
}
function renderPageContext404PageDoesNotExist(): { nothingRendered: false; renderResult: string; statusCode: 200 } {
  const renderResult = stringify({
    pageContext404PageDoesNotExist: true
  })
  return { nothingRendered: false, renderResult, statusCode: 200 }
}

function handleErr(err: unknown) {
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

function retrieveViteManifest(isPreRendering: boolean): { clientManifest: ViteManifest; serverManifest: ViteManifest } {
  // Get Vite manifest
  const { clientManifest, serverManifest, clientManifestPath, serverManifestPath } = getViteManifest()
  const userOperation = isPreRendering
    ? 'running `$ vite-plugin-ssr prerender`'
    : 'running the server with `isProduction: true`'
  assertUsage(
    clientManifest && serverManifest,
    'You are ' +
      userOperation +
      " but you didn't build your app yet: make sure to run `$ vite build && vite build --ssr` before. (Following build manifest is missing: `" +
      clientManifestPath +
      '` and/or `' +
      serverManifestPath +
      '`.)'
  )
  return { clientManifest, serverManifest }
}

function removeOrigin(url: string): string {
  const urlFull = getUrlFull(url)
  return urlFull
}

function addUrlPropsToPageContext<
  PageContext extends Record<string, unknown> & { url: string; urlNormalized?: string }
>(
  pageContext: PageContext
): asserts pageContext is PageContext & { urlNormalized: string; urlPathname: string; urlParsed: UrlParsed } {
  if (!('urlNormalized' in pageContext)) {
    const urlNormalized: string = analyzeUrl(pageContext.url).urlNormalized
    pageContext.urlNormalized = urlNormalized
    assert(hasProp(pageContext, 'urlNormalized', 'string'))
  }
  const { urlNormalized } = pageContext
  assert(typeof urlNormalized === 'string')
  const urlPathname: string = getUrlPathname(urlNormalized)
  const urlParsed: UrlParsed = getUrlParsed(urlNormalized)
  assert(urlPathname.startsWith('/'))
  assert(isPlainObject(urlParsed))
  Object.assign(pageContext, { urlPathname, urlParsed })
}

function assertPageContext(pageContext: PageContext) {
  // todo
  assert(typeof pageContext.url === 'string')
  assert(typeof pageContext.urlNormalized === 'string')
  assert(typeof pageContext.urlPathname === 'string')
  assert(isPlainObject(pageContext.urlParsed))
  assert(typeof pageContext.pageId === 'string')
}

function analyzeUrl(
  url: string
): { urlWithoutOrigin: string; urlNormalized: string; isPageContextRequest: boolean; hasBaseUrl: boolean } {
  const isPageContextRequest = isPageContextUrl(url)
  if (isPageContextRequest) {
    url = removePageContextUrlSuffix(url)
  }
  const urlWithoutOrigin = url

  url = removeOrigin(url)
  assert(url.startsWith('/'))

  const hasBaseUrl = startsWithBaseUrl(url)
  if (hasBaseUrl) {
    url = removeBaseUrl(url)
  }

  const urlNormalized = url
  return { urlWithoutOrigin, urlNormalized, isPageContextRequest, hasBaseUrl }
}
