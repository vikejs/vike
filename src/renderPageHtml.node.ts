import { getViteManifest } from './getViteManfiest.node'
import { assert } from './utils/assert'
import {
  findUserFilePath,
  loadUserFile
} from './user-files/findUserFiles.shared'

import { assertUsage } from './utils/assert'
import { isCallable } from './utils/isCallable'
import { slice } from './utils/slice'
import { getGlobal } from './global.node'
import { getPreloadLinks } from './getPreloadLinks.node'

export { renderPageHtml }

type PageView = any

type HtmlTemplate = { template: string; variables: Record<string, unknown> }
type PageServerConfig = {
  render: ({ pageView }: { pageView: PageView }) => Promise<string>
  html: (
    initialProps: Record<string, unknown>
  ) => HtmlTemplate | Promise<HtmlTemplate>
  addInitialProps: (
    initialProps: Record<string, unknown>
  ) => Record<string, unknown> | Promise<Record<string, unknown>>
}

async function renderPageHtml(pageId: string, url: string): Promise<string> {
  const pageView: PageView = await loadUserFile('.page', { pageId })
  assert(pageView)
  const pageFilePath: string | null = await findUserFilePath('.page', {
    pageId
  })
  assert(pageFilePath)
  assert(pageFilePath.startsWith('/'))

  const pageServerConfig: PageServerConfig =
    (await loadUserFile('.server', { pageId })) ||
    (await loadUserFile('.server', { defaultFile: true }))
  // TODO `render` and `html` can be defined in different files
  assert(pageServerConfig.render)
  assertUsage(
    pageServerConfig.html && isCallable(pageServerConfig.html),
    'TODO'
  )

  const initialProps = {}
  if (pageServerConfig.addInitialProps) {
    const newInitialProps = await pageServerConfig.addInitialProps(initialProps)
    Object.assign(initialProps, newInitialProps)
  }

  const pageHtml: string = await pageServerConfig.render({
    pageView,
    ...initialProps
  })

  const { template, variables } = await pageServerConfig.html({
    pageHtml: { dangerouslyManuallyEscaped: pageHtml },
    ...initialProps
  })
  assertUsage(template && variables, 'TODO')

  let html = template
  html = await applyViteHtmlTransform(html, url)

  let browserEntryPath: string | null =
    (await findUserFilePath('.browser', { pageId })) ||
    (await findUserFilePath('.browser', { defaultFile: true }))
  assert(browserEntryPath)
  const scriptSrc = await pathRelativeToRoot(browserEntryPath)
  html = injectScript(html, scriptSrc)

  const preloadLinks = getPreloadLinks(pageFilePath, browserEntryPath)
  html = injectPreloadLinks(html, preloadLinks)

  html = renderHtmlTemplate({
    html,
    variables
  })

  return html
}

async function applyViteHtmlTransform(
  html: string,
  url: string
): Promise<string> {
  const { viteDevServer, isProduction } = getGlobal()
  if (isProduction) {
    return html
  }
  html = await viteDevServer.transformIndexHtml(url, html)
  return html
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
  html,
  variables
}: {
  html: string
  variables: Record<string, any>
}): string {
  Object.entries(variables).forEach(([varName, varValue]) => {
    html = injectValue(html, varName, varValue)
  })
  return html
}
function injectValue(html: string, varName: string, varValue: any): string {
  if (
    typeof varValue === 'object' &&
    'dangerouslyManuallyEscaped' in varValue
  ) {
    varValue = varValue.dangerouslyManuallyEscaped
  } else {
    varValue = '' + varValue
    varValue = escapeHtml(varValue)
  }
  html = html.split('$' + varName).join(varValue)
  return html
}

function injectScript(html: string, scriptSrc: string): string {
  const injection = `<script type="module" src="${scriptSrc}"></script>`

  const bodyClose = '</body>'
  if (html.includes(bodyClose)) {
    return injectHtml(html, bodyClose, injection)
  }

  const htmlClose = '</html>'
  if (html.includes(htmlClose)) {
    return injectHtml(html, htmlClose, injection)
  }

  return html + '\n' + injection
}

function injectPreloadLinks(html: string, preloadLinks: string[]): string {
  const injection = preloadLinks.join('')

  const headClose = '</head>'
  if (html.includes(headClose)) {
    return injectHtml(html, headClose, injection)
  }

  const htmlBegin = '<html>'
  if (html.includes(htmlBegin)) {
    return injectHtml(html, htmlBegin, injection)
  }

  if (html.toLowerCase().startsWith('<!doctype')) {
    const lines = html.split('\n')
    return [slice(lines, 0, 1), injection, slice(lines, 1, 0)].join('\n')
  } else {
    return injection + '\n' + html
  }
}

function injectHtml(
  html: string,
  targetTag: string,
  injection: string
): string {
  assert(targetTag.startsWith('<'))
  assert(targetTag.endsWith('>'))
  assert(!targetTag.includes(' '))

  const htmlParts = html.split(targetTag)

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
