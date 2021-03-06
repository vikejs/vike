import devalue from 'devalue'
import { getErrorPageId, getPageIds, route, isErrorPage } from './route.node'
import { renderHtmlTemplate, isHtmlTemplate } from './html.node'
import { getViteManifest } from './getViteManfiest.node'
import { getUserFile, getUserFiles } from './user-files/getUserFiles.shared'
import { getGlobal } from './global.node'
import { getPreloadLinks } from './getPreloadLinks.node'
import { relative as pathRelative } from 'path'
import {
  assert,
  assertUsage,
  lowerFirst,
  isCallable,
  slice,
  cast,
  assertWarning,
  hasProp
} from './utils'

export { render }

async function render({
  url,
  contextProps = {}
}: {
  url: string
  contextProps: Record<string, unknown>
}): Promise<
  | { nothingRendered: true; renderResult: undefined; statusCode: undefined }
  | {
      nothingRendered: false
      renderResult: string | unknown
      statusCode: 200 | 404 | 500
    }
> {
  assertArguments(...arguments)

  if (isFaviconRequest(url)) {
    return {
      nothingRendered: true,
      renderResult: undefined,
      statusCode: undefined
    }
  }

  Object.assign(contextProps, { url })

  const allPageIds = await getPageIds()

  // *** Route ***
  // We use a try-catch because `route()` executes `.page.route.js` source code which is
  // written by the user and may contain errors.
  let routeResult
  try {
    routeResult = await route(url, allPageIds, contextProps)
  } catch (err) {
    return await render500Page(err, allPageIds, contextProps, url)
  }

  // *** Handle 404 ***
  let statusCode: 200 | 404
  if (!routeResult) {
    warn404(url, allPageIds)
    const errorPageId = getErrorPageId(allPageIds)
    if (!errorPageId) {
      warnMissingErrorPage()
      return {
        nothingRendered: true,
        renderResult: undefined,
        statusCode: undefined
      }
    }
    statusCode = 404
    routeResult = { pageId: errorPageId, contextPropsAddendum: { is404: true } }
  } else {
    statusCode = 200
  }

  const { pageId, contextPropsAddendum } = routeResult
  Object.assign(contextProps, contextPropsAddendum)

  // *** Render ***
  // We use a try-catch because `renderPage()` execute a `*.page.*` file which is
  // written by the user and may contain an error.
  let renderResult
  try {
    renderResult = await renderPage(pageId, contextProps, url)
  } catch (err) {
    return await render500Page(err, allPageIds, contextProps, url)
  }

  return { nothingRendered: false, renderResult, statusCode }
}

async function renderPage(
  pageId: string,
  contextProps: Record<string, unknown>,
  url: string
) {
  const { Page, pageFilePaths } = await getPage(pageId)

  const {
    renderFunction,
    addContextPropsFunction,
    setPagePropsFunction
  } = await getPageFunctions(pageId)

  if (addContextPropsFunction) {
    const contextPropsAddendum = await addContextPropsFunction.addContextProps({
      Page,
      contextProps
    })
    assertUsage(
      typeof contextPropsAddendum === 'object' &&
        contextPropsAddendum !== null &&
        contextPropsAddendum.constructor === Object,
      `The \`addContextProps\` hook exported by ${addContextPropsFunction.filePath} should return a plain JavaScript object.`
    )
    Object.assign(contextProps, contextPropsAddendum)
  }

  const pageProps: Record<string, unknown> = {}
  if (setPagePropsFunction) {
    const pagePropsAddendum = setPagePropsFunction.setPageProps({
      contextProps
    })
    assertUsage(
      typeof pagePropsAddendum === 'object' &&
        pagePropsAddendum !== null &&
        pagePropsAddendum.constructor === Object,
      `The \`setPageProps\` hook exported by ${setPagePropsFunction.filePath} should return a plain JavaScript object.`
    )
    assertUsage(
      !hasProp(pagePropsAddendum, 'then'),
      `The \`setPageProps\` hook exported by ${setPagePropsFunction.filePath} should not return a promise.`
    )
    Object.assign(pageProps, pagePropsAddendum)
  } else if (isErrorPage(pageId)) {
    assert(
      hasProp(contextProps, 'is404') && typeof contextProps.is404 === 'boolean'
    )
    Object.assign(pageProps, { is404: contextProps.is404 })
  }

  const renderResult: unknown = await renderFunction.render({
    Page,
    contextProps,
    pageProps
  })

  if (!isHtmlTemplate(renderResult)) {
    // Allow user to return whatever he wants in their `render` hook, such as `{redirectTo: '/some/path'}`.
    if (typeof renderResult !== 'string') {
      return renderResult
    }
    assertUsage(
      typeof renderResult !== 'string',
      `The \`render()\` hook exported by ${renderFunction.filePath} returned a string that is an unsafe. Make sure to return a sanitized string by using the \`html\` tag (\`import { html } from 'vite-plugin-ssr'\`).`
    )
  }
  let htmlDocument: string = renderHtmlTemplate(
    renderResult,
    renderFunction.filePath
  )

  // Inject Vite transformations
  htmlDocument = await applyViteHtmlTransform(htmlDocument, url)

  // Inject pageProps
  htmlDocument = injectPageInfo(htmlDocument, pageProps, pageId)

  // Inject script
  const browserFilePath = await getBrowserFilePath(pageId)
  const scriptSrc = await pathRelativeToRoot(browserFilePath)
  htmlDocument = injectScript(htmlDocument, scriptSrc)

  // Inject preload links
  const preloadLinks = getPreloadLinks(pageFilePaths, browserFilePath)
  htmlDocument = injectPreloadLinks(htmlDocument, preloadLinks)

  return htmlDocument
}

async function getPage(pageId: string) {
  const pageFile = await getUserFile('.page', pageId)
  assert(pageFile)
  const { filePath, loadFile } = pageFile
  const fileExports = await loadFile()
  assertUsage(
    typeof fileExports === 'object' &&
      ('Page' in fileExports || 'default' in fileExports),
    `${filePath} should have a \`export { Page }\` (or a default export).`
  )
  const Page = fileExports.Page || fileExports.default

  return { Page, pageFilePaths: [filePath] }
}

type ServerFunctions = {
  renderFunction: {
    filePath: string
    render: (arg1: {
      Page: unknown
      contextProps: Record<string, unknown>
      pageProps: Record<string, unknown>
    }) => unknown
  }
  addContextPropsFunction?: {
    filePath: string
    addContextProps: (arg1: {
      Page: unknown
      contextProps: Record<string, unknown>
    }) => unknown
  }
  setPagePropsFunction?: {
    filePath: string
    setPageProps: (arg1: { contextProps: Record<string, unknown> }) => unknown
  }
}
async function getPageFunctions(pageId: string): Promise<ServerFunctions> {
  const serverFiles = await getServerFiles(pageId)

  let renderFunction
  let addContextPropsFunction
  let setPagePropsFunction

  for (const { filePath, loadFile } of serverFiles) {
    const fileExports = await loadFile()

    const render = fileExports.render || fileExports.default?.render
    assertUsage(
      !render || isCallable(render),
      `The \`render\` export of ${filePath} should be a function.`
    )
    const addContextProps =
      fileExports.addContextProps || fileExports.default?.addContextProps
    assertUsage(
      !addContextProps || isCallable(addContextProps),
      `The \`addContextProps\` export of ${filePath} should be a function.`
    )
    const setPageProps =
      fileExports.setPageProps || fileExports.default?.setPageProps
    assertUsage(
      !setPageProps || isCallable(setPageProps),
      `The \`setPageProps\` export of ${filePath} should be a function.`
    )

    if (render) {
      renderFunction = renderFunction || { render, filePath }
    }
    if (addContextProps) {
      addContextPropsFunction = addContextPropsFunction || {
        addContextProps,
        filePath
      }
    }
    if (setPageProps) {
      setPagePropsFunction = setPagePropsFunction || { setPageProps, filePath }
    }
  }

  assertUsage(
    renderFunction,
    'No `render` function found. Make sure to define a `*.page.server.js` file that exports a `render` function. You can export a `render` function in a file `_default.page.server.js` which will apply as default to all your pages.'
  )

  return { renderFunction, addContextPropsFunction, setPagePropsFunction }
}

async function getBrowserFilePath(pageId: string) {
  const browserFiles = await getBrowserFiles(pageId)
  const browserFile = browserFiles[0]
  const browserFilePath = browserFile.filePath
  return browserFilePath
}
async function getBrowserFiles(pageId: string) {
  let browserFiles = await getUserFiles('.page.client')
  assertUsage(
    browserFiles.length > 0,
    'No *.page.client.* file found. Make sure to create one. You can create a `_default.page.client.js` which will apply as default to all your pages.'
  )
  browserFiles = filterAndSort(browserFiles, pageId)
  return browserFiles
}

async function getServerFiles(pageId: string) {
  let serverFiles = await getUserFiles('.page.server')
  assertUsage(
    serverFiles.length > 0,
    'No *.page.server.* file found. Make sure to create one. You can create a `_default.page.server.js` which will apply as default to all your pages.'
  )
  serverFiles = filterAndSort(serverFiles, pageId)
  return serverFiles
}

function filterAndSort<T extends { filePath: string }>(
  userFiles: T[],
  pageId: string
): T[] {
  userFiles = userFiles.filter(({ filePath }) => {
    assert(filePath.startsWith('/'))
    assert(!filePath.includes('\\'))
    return filePath.startsWith(pageId) || filePath.includes('/_default')
  })

  // Sort `_default.page.server.js` files by filesystem proximity to pageId's `*.page.js` file
  userFiles.sort(
    lowerFirst(({ filePath }) => {
      if (filePath.startsWith(pageId)) return -1
      const relativePath = pathRelative(pageId, filePath)
      assert(!relativePath.includes('\\'))
      const changeDirCount = relativePath.split('/').length
      return changeDirCount
    })
  )

  return userFiles
}

async function applyViteHtmlTransform(
  htmlDocument: string,
  url: string
): Promise<string> {
  const { viteDevServer, isProduction } = getGlobal()
  if (isProduction) {
    return htmlDocument
  }
  htmlDocument = await viteDevServer.transformIndexHtml(url, htmlDocument)
  return htmlDocument
}

async function pathRelativeToRoot(filePath: string): Promise<string> {
  assert(filePath.startsWith('/'))
  const { isProduction } = getGlobal()

  if (!isProduction) {
    return filePath
  } else {
    const manifest = getViteManifest()
    const manifestKey = filePath.slice(1)
    const manifestVal = manifest[manifestKey]
    assert(manifestVal)
    assert(manifestVal.isEntry)
    const { file } = manifestVal
    assert(!file.startsWith('/'))
    return '/' + file
  }
}

function injectPageInfo(
  htmlDocument: string,
  pageProps: Record<string, unknown>,
  pageId: string
): string {
  const injection = `<script>window.__vite_plugin_ssr = {pageId: ${devalue(
    pageId
  )}, pageProps: ${devalue(pageProps)}}</script>`
  return injectEnd(htmlDocument, injection)
}

function injectScript(htmlDocument: string, scriptSrc: string): string {
  const injection = `<script type="module" src="${scriptSrc}"></script>`
  return injectEnd(htmlDocument, injection)
}

function injectPreloadLinks(
  htmlDocument: string,
  preloadLinks: string[]
): string {
  const injection = preloadLinks.join('')
  return injectBegin(htmlDocument, injection)
}

function injectBegin(htmlDocument: string, injection: string): string {
  const headClose = '</head>'
  if (htmlDocument.includes(headClose)) {
    return injectHtml(htmlDocument, headClose, injection)
  }

  const htmlBegin = '<html>'
  if (htmlDocument.includes(htmlBegin)) {
    return injectHtml(htmlDocument, htmlBegin, injection)
  }

  if (htmlDocument.toLowerCase().startsWith('<!doctype')) {
    const lines = htmlDocument.split('\n')
    return [slice(lines, 0, 1), injection, slice(lines, 1, 0)].join('\n')
  } else {
    return injection + '\n' + htmlDocument
  }
}

function injectEnd(htmlDocument: string, injection: string): string {
  const bodyClose = '</body>'
  if (htmlDocument.includes(bodyClose)) {
    return injectHtml(htmlDocument, bodyClose, injection)
  }

  const htmlClose = '</html>'
  if (htmlDocument.includes(htmlClose)) {
    return injectHtml(htmlDocument, htmlClose, injection)
  }

  return htmlDocument + '\n' + injection
}

function injectHtml(
  htmlDocument: string,
  targetTag: string,
  injection: string
): string {
  assert(targetTag.startsWith('<'))
  assert(targetTag.endsWith('>'))
  assert(!targetTag.includes(' '))

  const htmlParts = htmlDocument.split(targetTag)

  if (targetTag.startsWith('</')) {
    // Insert `injection` before last `targetTag`
    const before = slice(htmlParts, 0, -1).join(targetTag)
    const after = slice(htmlParts, -1, 0)
    return before + injection + targetTag + after
  } else {
    // Insert `injection` after first `targetTag`
    const before = slice(htmlParts, 0, 1)
    const after = slice(htmlParts, 1, 0).join(targetTag)
    return before + targetTag + injection + after
  }
}

function assertArguments(...args: unknown[]) {
  const argObject = args[0]
  assertUsage(
    hasProp(argObject, 'url'),
    '`render({url, contextProps})`: argument `url` is missing.'
  )
  assertUsage(
    typeof argObject.url === 'string' && argObject.url.startsWith('/'),
    '`render({url, contextProps})`: argument `url` should start with a `/`.'
  )
  assertUsage(
    !hasProp(argObject, 'contextProps') ||
      typeof argObject.contextProps === 'object',
    '`render({url, contextProps})`: argument `contextProps` should be a `typeof contextProps === "object"`.'
  )
  assertUsage(
    args.length === 1,
    '`render({url, contextProps})`: all arguments should be passed as a single argument object.'
  )
  const unknownArgs = Object.keys(argObject).filter(
    (key) => !['url', 'contextProps'].includes(key)
  )
  assertUsage(
    unknownArgs.length === 0,
    '`render({url, contextProps})`: unknown arguments [' +
      unknownArgs.map((s) => `'${s}'`).join(', ') +
      '].'
  )
}

function warnMissingErrorPage() {
  const { isProduction } = getGlobal()
  if (!isProduction) {
    assertWarning(
      false,
      'No `_error.page.js` found. We recommend creating a `_error.page.js` file. (This warning is not shown in production.)'
    )
  }
}
function warn404(url: string, allPageIds: string[]) {
  const { isProduction } = getGlobal()
  if (!isProduction) {
    const relevantPageIds = allPageIds.filter((pageId) => !isErrorPage(pageId))
    assertUsage(
      relevantPageIds.length > 0,
      'No page found. Create a file that ends with the suffix `.page.js` (or `.page.vue`, `.page.jsx`, ...).'
    )
    assertWarning(
      false,
      `No page is matching the URL \`${url}\`. Defined pages: ${relevantPageIds
        .map((pageId) => `${pageId}.page.*`)
        .join(' ')} (this warning is not shown in production.)`
    )
  }
}

async function render500Page(
  err: unknown,
  allPageIds: string[],
  contextProps: Record<string, unknown>,
  url: string
): Promise<
  | { nothingRendered: true; renderResult: undefined; statusCode: undefined }
  | { nothingRendered: false; renderResult: string | unknown; statusCode: 500 }
> {
  handleErr(err)

  const errorPageId = getErrorPageId(allPageIds)
  if (errorPageId === null) {
    warnMissingErrorPage()
    return {
      nothingRendered: true,
      renderResult: undefined,
      statusCode: undefined
    }
  }

  Object.assign(contextProps, { is404: false })
  let renderResult
  try {
    renderResult = await renderPage(errorPageId, contextProps, url)
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
function handleErr(err: unknown) {
  const { viteDevServer } = getGlobal()
  if (viteDevServer) {
    cast<Error>(err)
    if (err?.stack) {
      viteDevServer.ssrFixStacktrace(err)
    }
  }
  console.error(err)
}

function isFaviconRequest(url: string): boolean {
  return url === '/favicon.ico'
}
