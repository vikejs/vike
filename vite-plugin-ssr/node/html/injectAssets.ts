export { injectHtmlTagsToString }
export { injectHtmlTagsToStream }
export type { PageContextInjectAssets }
export type { PreloadFilter }
export { injectAssets__public }

import { assert, assertUsage, assertWarning, castProp, hasProp } from '../utils'
import type { PageAsset } from '../renderPage/getPageAssets'
import { serializePageContextClientSide } from '../serializePageContextClientSide'
import { sanitizeJson } from './injectAssets/sanitizeJson'
import { assertPageContextProvidedByUser } from '../../shared/assertPageContextProvidedByUser'
import { createHtmlHeadIfMissing, injectHtmlSnippets } from './injectAssets/injectHtmlSnippet'
import type { ViteDevServer } from 'vite'
import { inferAssetTag, inferPreloadTag } from './injectAssets/inferHtmlTags'
import { getViteDevScripts } from './injectAssets/getViteDevScripts'
import { mergeScriptTags } from './injectAssets/mergeScriptTags'
import type { InjectToStream } from 'react-streaming/server'
import { HtmlPart } from './renderHtml'

// TODO: BREAK THIS
async function injectAssets__public(htmlString: string, pageContext: Record<string, unknown>): Promise<string> {
  assertWarning(false, '`_injectAssets()` is deprecated and will be removed.', { onlyOnce: true, showStackTrace: true })
  assertUsage(
    typeof htmlString === 'string',
    '[injectAssets(htmlString, pageContext)]: Argument `htmlString` should be a string.'
  )
  assertUsage(pageContext, '[injectAssets(htmlString, pageContext)]: Argument `pageContext` is missing.')
  const errMsg = (body: string) =>
    '[injectAssets(htmlString, pageContext)]: ' +
    body +
    '. Make sure that `pageContext` is the object that `vite-plugin-ssr` provided to your `render(pageContext)` hook.'
  assertUsage(hasProp(pageContext, 'urlPathname', 'string'), errMsg('`pageContext.urlPathname` should be a string'))
  assertUsage(hasProp(pageContext, '_pageId', 'string'), errMsg('`pageContext._pageId` should be a string'))
  assertUsage(hasProp(pageContext, '__getPageAssets'), errMsg('`pageContext.__getPageAssets` is missing'))
  assertUsage(hasProp(pageContext, '_passToClient', 'string[]'), errMsg('`pageContext._passToClient` is missing'))
  castProp<() => Promise<PageAsset[]>, typeof pageContext, '__getPageAssets'>(pageContext, '__getPageAssets')
  htmlString = await injectHtmlTagsToString([htmlString], pageContext as any, false, null)
  return htmlString
}

type PageContextInjectAssets = {
  urlPathname: string
  __getPageAssets: () => Promise<PageAsset[]>
  _pageId: string
  _passToClient: string[]
  _isHtmlOnly: boolean
  _pageContextPromise: Promise<unknown> | null
  _renderHook: { hookFilePath: string; hookName: 'render' }
  _isProduction: boolean
  _viteDevServer: null | ViteDevServer
  _baseUrl: string
  is404: null | boolean
}

type PreloadFilter = null | ((assets: PreloadFilterEntry[]) => PreloadFilterEntry[])
type PreloadFilterEntry = {
  src: string
  assetType: null | PageAsset['assetType']
  mediaType: null | PageAsset['mediaType']
  isPreload: boolean
  inject: null | 'HTML_BEGIN' | 'HTML_END'
}

async function injectHtmlTagsToString(
  htmlParts: HtmlPart[],
  pageContext: PageContextInjectAssets,
  disableAutoInjectPreloadTags: boolean,
  preloadFilter: PreloadFilter
): Promise<string> {
  const htmlSnippets = await getHtmlSnippets(pageContext, null, disableAutoInjectPreloadTags, preloadFilter)
  const pageAssets = await pageContext.__getPageAssets()
  let htmlString = htmlPartsToString(htmlParts, pageAssets)
  htmlString = injectToHtmlBegin(htmlString, htmlSnippets, null)
  htmlString = injectToHtmlEnd(htmlString, htmlSnippets)
  return htmlString
}

function injectHtmlTagsToStream(
  pageContext: PageContextInjectAssets,
  injectToStream: null | InjectToStream,
  preloadFilter: PreloadFilter
) {
  let htmlSnippets: HtmlSnippet[] | undefined

  return {
    injectAtStreamBegin,
    injectAtStreamEnd
  }

  async function injectAtStreamBegin(
    htmlPartsBegin: HtmlPart[],
    disableAutoInjectPreloadTags: boolean
  ): Promise<string> {
    htmlSnippets = await getHtmlSnippets(pageContext, injectToStream, disableAutoInjectPreloadTags, preloadFilter)

    const pageAssets = await pageContext.__getPageAssets()
    let htmlBegin = htmlPartsToString(htmlPartsBegin, pageAssets)

    htmlBegin = injectToHtmlBegin(htmlBegin, htmlSnippets, injectToStream)
    return htmlBegin
  }

  async function injectAtStreamEnd(htmlPartsEnd: HtmlPart[]): Promise<string> {
    assert(htmlSnippets)
    await resolvePageContextPromise(pageContext)
    const pageAssets = await pageContext.__getPageAssets()
    let htmlEnd = htmlPartsToString(htmlPartsEnd, pageAssets)
    htmlEnd = injectToHtmlEnd(htmlEnd, htmlSnippets)
    return htmlEnd
  }
}

function injectToHtmlBegin(
  htmlBegin: string,
  htmlSnippets: HtmlSnippet[],
  injectToStream: null | InjectToStream
): string {
  const htmlSnippetsAtBegin = htmlSnippets.filter((snippet) => snippet.position !== 'DOCUMENT_END')

  // Ensure existence of `<head>`
  htmlBegin = createHtmlHeadIfMissing(htmlBegin)

  htmlBegin = injectHtmlSnippets(htmlBegin, htmlSnippetsAtBegin, injectToStream)

  return htmlBegin
}

function injectToHtmlEnd(htmlEnd: string, htmlSnippets: HtmlSnippet[]): string {
  const htmlSnippetsAtEnd = htmlSnippets.filter((snippet) => snippet.position === 'DOCUMENT_END')
  htmlEnd = injectHtmlSnippets(htmlEnd, htmlSnippetsAtEnd, null)
  return htmlEnd
}

// https://vite-plugin-ssr.com/stream#initial-data-after-streaming
async function resolvePageContextPromise(pageContext: {
  _pageContextPromise: null | Promise<unknown>
  _renderHook: { hookFilePath: string; hookName: 'render' }
}) {
  if (pageContext._pageContextPromise !== null) {
    const pageContextProvidedByUser = await pageContext._pageContextPromise
    assertPageContextProvidedByUser(pageContextProvidedByUser, { hook: pageContext._renderHook })
    Object.assign(pageContext, pageContextProvidedByUser)
  }
}

type HtmlSnippet = {
  htmlSnippet: string | (() => string)
  // TODO: remove HEAD_CLOSING
  position: 'HEAD_CLOSING' | 'HEAD_OPENING' | 'DOCUMENT_END' | 'STREAM'
}
// TODO: rename htmlSnippets => htmtTags
// TODO: move getHtmlSnippets to own module
async function getHtmlSnippets(
  pageContext: PageContextInjectAssets,
  injectToStream: null | InjectToStream,
  disableAutoInjectPreloadTags: boolean,
  preloadFilter: PreloadFilter
) {
  assert([true, false].includes(pageContext._isHtmlOnly))
  const isHtmlOnly = pageContext._isHtmlOnly

  assert(pageContext._pageContextPromise === null || pageContext._pageContextPromise)
  const injectJavaScriptDuringStream = pageContext._pageContextPromise === null && !!injectToStream

  let pageAssets = await pageContext.__getPageAssets()

  // TODO: remove
  if (disableAutoInjectPreloadTags) {
    pageAssets = pageAssets.filter(({ isPreload }) => !isPreload)
  }

  const htmlSnippets: HtmlSnippet[] = []

  let preloadFilterEntries: PreloadFilterEntry[] = pageAssets
    .filter((p) => p.assetType !== 'script')
    .map((p) => ({
      src: p.src,
      assetType: p.assetType,
      mediaType: p.mediaType,
      isPreload: p.isPreload,
      inject: p.assetType === 'style' || p.assetType === 'font' ? 'HTML_BEGIN' : 'HTML_END'
    }))
  if (preloadFilter) {
    preloadFilterEntries = preloadFilter(preloadFilterEntries)
  }
  preloadFilterEntries.forEach((a) => {
    if (a.assetType === 'style') {
      // In development, Vite automatically inject styles, but we still inject `<link rel="stylesheet" type="text/css" href="${src}">` tags in order to avoid FOUC (flash of unstyled content).
      //   - https://github.com/vitejs/vite/issues/2282
      //   - https://github.com/brillout/vite-plugin-ssr/issues/261
      // TODO: enforce `showStackTrace`
      assertWarning(a.inject, `We recommend against not injecting ${a.src}`, { onlyOnce: true, showStackTrace: false })
    }
  })
  for (const entry of preloadFilterEntries) {
    if (entry.inject) {
      const htmlSnippet = entry.isPreload ? inferPreloadTag(entry) : inferAssetTag(entry)
      // TODO: align naming
      const position = entry.inject === 'HTML_BEGIN' ? 'HEAD_OPENING' : 'DOCUMENT_END'
      htmlSnippets.push({ htmlSnippet, position })
    }
  }

  const positionJs = injectJavaScriptDuringStream ? 'STREAM' : 'DOCUMENT_END'

  // Serialized pageContext
  if (!isHtmlOnly) {
    htmlSnippets.push({
      // Needs to be called after `resolvePageContextPromise()`
      htmlSnippet: () => getPageContextTag(pageContext),
      position: positionJs
    })
  }

  const jsScript = await getMergedScriptTag(pageAssets, pageContext)
  if (jsScript) {
    htmlSnippets.push({
      htmlSnippet: jsScript,
      position: positionJs
    })
  }
  for (const pageAsset of pageAssets) {
    const { assetType } = pageAsset

    // JavaScript
    if (assetType === 'script') {
      // We only add preload tags: asset tags are already included with `getMergedScriptTag()`
      const htmlSnippet = inferPreloadTag(pageAsset)
      if (!isHtmlOnly) {
        htmlSnippets.push({ htmlSnippet, position: positionJs })
      }
      continue
    }
  }

  return htmlSnippets
}

async function getMergedScriptTag(
  pageAssets: PageAsset[],
  pageContext: PageContextInjectAssets
): Promise<null | string> {
  const scriptAssets = pageAssets.filter((pageAsset) => !pageAsset.isPreload && pageAsset.assetType === 'script')
  const viteScripts = await getViteDevScripts(pageContext)
  const scriptTagsHtml = `${viteScripts}${scriptAssets.map(inferAssetTag).join('')}`
  const scriptTag = mergeScriptTags(scriptTagsHtml, pageContext)
  return scriptTag
}

function getPageContextTag(pageContext: { _pageId: string; _passToClient: string[]; is404: null | boolean }): string {
  const pageContextSerialized = sanitizeJson(serializePageContextClientSide(pageContext))
  const htmlSnippet = `<script id="vite-plugin-ssr_pageContext" type="application/json">${pageContextSerialized}</script>`
  return htmlSnippet
}

function htmlPartsToString(htmlParts: HtmlPart[], pageAssets: PageAsset[]): string {
  let htmlString = ''
  htmlParts.forEach((p) => {
    htmlString += typeof p === 'string' ? p : p(pageAssets)
  })
  return htmlString
}
