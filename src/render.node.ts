import devalue from 'devalue'
import { route } from './route.node'
import { getSanitizedHtml } from './html.node'
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
  cast
} from './utils'

export { render }

async function render({
  url,
  contextProps = {}
}: {
  url: string
  contextProps: Record<string, any>
}): Promise<null | string> {
  assertArguments(...arguments)

  const routedPage = await route(url)
  if (!routedPage) {
    return null
  }
  Object.assign(contextProps, { url })

  const { pageId, routeProps } = routedPage
  Object.assign(contextProps, routeProps)

  const { Page, pageFilePaths } = await getPage(pageId)

  const {
    renderFunction,
    addContextPropsFunction,
    setPagePropsFunction
  } = await getPageFunctions(pageId)

  if (addContextPropsFunction) {
    const newContextProps = await addContextPropsFunction.addContextProps({
      contextProps
    })
    assertUsage(
      newContextProps && (newContextProps as any).constructor === Object,
      `The \`addContextProps\` function exported by ${addContextPropsFunction.filePath} should return a plain JavaScript object.`
    )
    Object.assign(contextProps, newContextProps)
  }

  let pageProps: Record<string, unknown>
  if (setPagePropsFunction) {
    const props = await setPagePropsFunction.setPageProps({ contextProps })
    assertUsage(
      props && typeof props === 'object' && props.constructor === Object,
      `The \`setPageProps\` function exported by ${setPagePropsFunction.filePath} should return a plain JavaScript object.`
    )
    cast<Record<string, unknown>>(props)
    pageProps = props
  } else {
    pageProps = {}
  }

  let htmlDocument: string = getSanitizedHtml(
    await renderFunction.render({ Page, contextProps, pageProps }),
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
    `${filePath} should have a \`export { Page }\`.`
  )
  const Page = fileExports.Page || fileExports.default

  return { Page, pageFilePaths: [filePath] }
}

type ServerFunctions = {
  renderFunction: {
    filePath: string
    render: (arg1: {
      Page: any
      contextProps: Record<string, any>
      pageProps: Record<string, any>
    }) => unknown
  }
  addContextPropsFunction?: {
    filePath: string
    addContextProps: (arg1: {
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
    'No `render` function found. Make sure to define a `*.page.server.js` file that exports a `render` function. You can export a `render` function in a file `_default.page.server.js` which will apply as a default to all your pages.'
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
  browserFiles = filterAndSort(browserFiles, pageId)
  return browserFiles
}

async function getServerFiles(pageId: string) {
  let serverFiles = await getUserFiles('.page.server')
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
  pageProps: Record<string, any>,
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

function assertArguments(...args: any[]) {
  const { url, contextProps, ...rest } = args[0]
  assertUsage(url, '`render({url, contextProps})`: argument `url` is missing.')
  assertUsage(
    url.startsWith('/'),
    '`render({url, contextProps})`: argument `url` should start with a `/`.'
  )
  assertUsage(
    typeof contextProps === 'object',
    '`render({url, contextProps})`: argument `contextProps` should be a `typeof contextProps === "object"`.'
  )
  assertUsage(
    args.length === 1,
    '`render({url, contextProps})`: arguments should be passed as a single object.'
  )
  const unknownArgs = Object.keys(rest)
  assertUsage(
    unknownArgs.length === 0,
    '`render({url, contextProps})`: unknown arguments [' +
      unknownArgs.map((s) => `'${s}'`).join(', ') +
      '].'
  )
}
