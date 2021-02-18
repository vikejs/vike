import { route } from './route.node'
import { getViteManifest } from './getViteManfiest.node'
import { assert } from './utils/assert'
import devalue from 'devalue'
import {
  findUserFilePath,
  loadUserFile
} from './user-files/findUserFiles.shared'
import { findPageFiles } from './user-files/findPageFiles.node'

import { assertUsage } from './utils/assert'
import { isCallable } from './utils/isCallable'
import { slice } from './utils/slice'
import { getGlobal } from './global.node'
import { getPreloadLinks } from './getPreloadLinks.node'

export { render }

async function render(
  url: string,
  initialProps: Record<string, any> = {}
): Promise<null | string> {
  const routedPage = await route(url)
  if (!routedPage) {
    return null
  }
  const { pageId, routeProps } = routedPage
  Object.assign(initialProps, routeProps)

  const { pageView, pageFilePaths } = await getPageView(pageId)

  const { render, html, addInitialProps } = await getPageFunctions(pageId)

  if (addInitialProps) {
    const newInitialProps = await addInitialProps(initialProps)
    Object.assign(initialProps, newInitialProps)
  }

  const pageHtml: string = await render(pageView, initialProps)

  const { template, variables } = await html(
    { dangerouslyManuallyEscaped: pageHtml },
    initialProps
  )
  assertUsage(
    template && variables,
    `The \`html\` function defined in ${html.sourceFilePath} should \`return { templates, variables }\`.`
  )

  let htmlDocument = template
  htmlDocument = await applyViteHtmlTransform(htmlDocument, url)

  // Inject initialProps
  htmlDocument = injectPageInfo(htmlDocument, initialProps, pageId)

  // Inject script
  const browserEntryPath = await getBrowserEntryPath(pageId)
  const scriptSrc = await pathRelativeToRoot(browserEntryPath)
  htmlDocument = injectScript(htmlDocument, scriptSrc)

  // Inject preload links
  const preloadLinks = getPreloadLinks(pageFilePaths, browserEntryPath)
  htmlDocument = injectPreloadLinks(htmlDocument, preloadLinks)

  // Inject initialProps variables
  htmlDocument = renderHtmlTemplate({
    htmlDocument,
    variables
  })

  return htmlDocument
}

async function getBrowserEntryPath(pageId: string): Promise<string> {
  const browserEntryPath: string | null =
    (await findUserFilePath('.browser', { pageId })) ||
    (await findUserFilePath('.browser', { defaultFile: true }))
  assert(browserEntryPath)
  return browserEntryPath
}

async function getPageView(pageId: string) {
  let pageView: any = await loadUserFile('.page', { pageId })
  assert(pageView)

  const pageFilePaths = []

  const pageFilePath: string | null = await findUserFilePath('.page', {
    pageId
  })
  assert(pageFilePath)
  assert(pageFilePath.startsWith('/'))
  pageFilePaths.push(pageFilePath)

  /*
  const pageViewWrapper: any = await loadUserFile('.page', {
    defaultFile: true
  })
  if (pageViewWrapper) {
    const pageView_original = pageView
    pageView = (initialProps: Record<string, any>) => {
      return pageViewWrapper(pageView_original, initialProps)
    }
    const pageFilePath: string | null = await findUserFilePath('.page', {
      defaultFile: true
    })
    assert(pageFilePath)
    assert(pageFilePath.startsWith('/'))
    pageFilePaths.push(pageFilePath)
  }
  */

  return { pageView, pageFilePaths }
}

type HtmlTemplate = { template: string; variables: Record<string, unknown> }
type ServerFunctions = {
  render: (pageView: any, initialProps: Record<string, any>) => Promise<string>
  html: ((
    pageHtml: { dangerouslyManuallyEscaped: string },
    initialProps: Record<string, unknown>
  ) => HtmlTemplate | Promise<HtmlTemplate>) & { sourceFilePath: string }
  addInitialProps: (
    initialProps: Record<string, unknown>
  ) => Record<string, unknown> | Promise<Record<string, unknown>>
}
async function getPageFunctions(pageId: string): Promise<ServerFunctions> {
  const files = await findPageFiles('.server', pageId)

  let render
  let html
  let addInitialProps

  for (const { filePath, loadFile } of files) {
    const fileExports = await loadFile()
    assertUsage(
      typeof fileExports === 'object' && 'default' in fileExports,
      `${filePath} should have a default export`
    )

    const renderFunction = fileExports.default.render
    assertUsage(
      !renderFunction || isCallable(renderFunction),
      `\`render\` defined in ${filePath} should be a function.`
    )
    render = render || renderFunction

    const htmlFunction = fileExports.default.html
    assertUsage(
      !htmlFunction || isCallable(htmlFunction),
      `\`html\` defined in ${filePath} should be a function.`
    )
    if (html) {
      htmlFunction.sourceFilePath = filePath
    }
    html = html || htmlFunction

    const addInitialPropsFunction = fileExports.default.addInitialProps
    assertUsage(
      !htmlFunction || isCallable(addInitialPropsFunction),
      `\`addInitialProps\` defined in ${filePath} should be a function.`
    )
    addInitialProps = addInitialProps || addInitialPropsFunction
  }

  const howToResolve =
    'Make sure to define a `*.page.server.*` file that exports a `render` function. You can define to `default.page.server.js` which will apply as a default to all your pages.'
  assertUsage(render, 'No `render` function found. ' + howToResolve)
  assertUsage(html, 'No `html` function found. ' + howToResolve)

  return { render, html, addInitialProps }
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

function renderHtmlTemplate({
  htmlDocument,
  variables
}: {
  htmlDocument: string
  variables: Record<string, any>
}): string {
  Object.entries(variables).forEach(([varName, varValue]) => {
    htmlDocument = injectValue(htmlDocument, varName, varValue)
  })
  return htmlDocument
}
function injectValue(
  htmlDocument: string,
  varName: string,
  varValue: any
): string {
  if (
    typeof varValue === 'object' &&
    'dangerouslyManuallyEscaped' in varValue
  ) {
    varValue = varValue.dangerouslyManuallyEscaped
  } else {
    varValue = '' + varValue
    varValue = escapeHtml(varValue)
  }
  htmlDocument = htmlDocument.split('$' + varName).join(varValue)
  return htmlDocument
}

function injectPageInfo(
  htmlDocument: string,
  initialProps: Record<string, any>,
  pageId: string
): string {
  const injection = `<script>window.__vite_plugin_ssr = {pageId: ${devalue(
    pageId
  )}, initialProps: ${devalue(initialProps)}}</script>`
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

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
