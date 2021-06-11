import {assert, assertUsage, hasProp, normalizePath, slice} from "../utils"
import { getPreloadTags } from '../getPreloadTags.node'
import {getSsrEnv} from "../ssrEnv.node"
import { getViteManifest, ViteManifest } from '../getViteManifest.node'
import { getPageFile, getPageFiles } from './page-files/getPageFiles.shared'
import {prependBaseUrl} from "../baseUrlHandling"
import devalue from "devalue"

export { injectAssets }
export { injectAssets_internal }

type PageContext_Assets = {
  pageId: string,
  urlNormalized: string,
  pageAssets: any,
}

async function injectAssets(htmlDocument: string, pageContext: Record<string, unknown>): Promise<string> {
  const errMsg = (body: string) => "[html.injectAssets(htmlDocument, pageContext)]: "+body+". Make sure that `pageContext` is the object provided to your `render()` hook."
  assertUsage(hasProp(pageContext, 'pageId', 'string'), errMsg("`pageContext.pageId` should be a string"))
  assertUsage(hasProp(pageContext, 'urlNormalized', 'string'), errMsg("`pageContext.urlNormalized` should be a string"))
  assertUsage(hasProp(pageContext, 'pageAssets'), errMsg("`pageContext.pageAssets` is missing"))
  htmlDocument = await injectAssets_internal(htmlDocument, pageContext)
  return htmlDocument
}

async function injectAssets_internal(htmlDocument: string, pageContext: PageContext_Assets): Promise<string> {
  const { pageId } = pageContext

  // Inject Vite transformations
  const { urlNormalized } = pageContext
  assert(typeof urlNormalized === 'string')
  htmlDocument = await applyViteHtmlTransform(htmlDocument, urlNormalized)

  // Inject pageContext__client
  htmlDocument = injectPageInfo(htmlDocument, pageContext__client, pageId)

  // Inject script
  const browserFilePath = pageContext.pageClientFile
  const scriptSrc = !isProduction ? browserFilePath : resolveScriptSrc(browserFilePath, clientManifest!)
  htmlDocument = injectScript(htmlDocument, scriptSrc)

  // Inject preload links
  const dependencies = new Set<string>()
  dependencies.add(pageFilePath)
  dependencies.add(browserFilePath)
  dependencies.add(renderFunction.filePath)
  if (addPageContextFunction) dependencies.add(addPageContextFunction.filePath)
  const preloadTags = await getPreloadTags(Array.from(dependencies), clientManifest, serverManifest)
  htmlDocument = injectPreloadTags(htmlDocument, preloadTags)

  return htmlDocument
}

async function applyViteHtmlTransform(htmlDocument: string, urlNormalized: string): Promise<string> {
  const ssrEnv = getSsrEnv()
  if (ssrEnv.isProduction) {
    return htmlDocument
  }
  htmlDocument = await ssrEnv.viteDevServer.transformIndexHtml(urlNormalized, htmlDocument)
  return htmlDocument
}

function resolveScriptSrc(filePath: string, clientManifest: ViteManifest): string {
  assert(filePath.startsWith('/'))
  assert(getSsrEnv().isProduction)
  const manifestKey = filePath.slice(1)
  const manifestVal = clientManifest[manifestKey]
  assert(manifestVal)
  assert(manifestVal.isEntry)
  let { file } = manifestVal
  assert(!file.startsWith('/'))
  file = normalizePath(file)
  return '/' + file
}

function injectPageInfo(htmlDocument: string, pageContext__client: Record<string, unknown>, pageId: string): string {
  assert(pageContext__client.pageId === pageId)
  const injection = `<script>window.__vite_plugin_ssr__pageContext = ${devalue(pageContext__client)}</script>`
  return injectEnd(htmlDocument, injection)
}

function injectScript(htmlDocument: string, scriptSrc: string): string {
  const injection = `<script type="module" src="${prependBaseUrl(scriptSrc)}"></script>`
  return injectEnd(htmlDocument, injection)
}

function injectPreloadTags(htmlDocument: string, preloadTags: string[]): string {
  const injection = preloadTags.join('')
  return injectBegin(htmlDocument, injection)
}

function injectBegin(htmlDocument: string, injection: string): string {
  const headOpen = /<head[^>]*>/
  if (headOpen.test(htmlDocument)) {
    return injectAtOpeningTag(htmlDocument, headOpen, injection)
  }

  const htmlBegin = /<html[^>]*>/
  if (htmlBegin.test(htmlDocument)) {
    return injectAtOpeningTag(htmlDocument, htmlBegin, injection)
  }

  if (htmlDocument.toLowerCase().startsWith('<!doctype')) {
    const lines = htmlDocument.split('\n')
    return [...slice(lines, 0, 1), injection, ...slice(lines, 1, 0)].join('\n')
  } else {
    return injection + '\n' + htmlDocument
  }
}

function injectEnd(htmlDocument: string, injection: string): string {
  const bodyClose = '</body>'
  if (htmlDocument.includes(bodyClose)) {
    return injectAtClosingTag(htmlDocument, bodyClose, injection)
  }

  const htmlClose = '</html>'
  if (htmlDocument.includes(htmlClose)) {
    return injectAtClosingTag(htmlDocument, htmlClose, injection)
  }

  return htmlDocument + '\n' + injection
}

function injectAtOpeningTag(htmlDocument: string, openingTag: RegExp, injection: string): string {
  const matches = htmlDocument.match(openingTag)
  assert(matches && matches.length >= 1)
  const tag = matches[0]
  const htmlParts = htmlDocument.split(tag)
  assert(htmlParts.length >= 2)

  // Insert `injection` after first `tag`
  const before = slice(htmlParts, 0, 1)
  const after = slice(htmlParts, 1, 0).join(tag)
  return before + tag + injection + after
}

function injectAtClosingTag(htmlDocument: string, closingTag: string, injection: string): string {
  assert(closingTag.startsWith('</'))
  assert(closingTag.endsWith('>'))
  assert(!closingTag.includes(' '))

  const htmlParts = htmlDocument.split(closingTag)
  assert(htmlParts.length >= 2)

  // Insert `injection` before last `closingTag`
  const before = slice(htmlParts, 0, -1).join(closingTag)
  const after = slice(htmlParts, -1, 0)
  return before + injection + closingTag + after
}
