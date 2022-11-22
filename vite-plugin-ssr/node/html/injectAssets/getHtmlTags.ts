export { getHtmlTags }
export type { HtmlTag }
export type { PreloadFilter }
export type { PreloadFilterEntry }

import { assert, assertWarning } from '../../utils'
import { serializePageContextClientSide } from '../../serializePageContextClientSide'
import { sanitizeJson } from './sanitizeJson'
import { inferAssetTag, inferPreloadTag } from './inferHtmlTags'
import { getViteDevScripts } from './getViteDevScripts'
import { mergeScriptTags } from './mergeScriptTags'
import type { PageContextInjectAssets } from '../injectAssets'
import type { InjectToStream } from 'react-streaming/server'
import type { PageAsset } from '../../renderPage/getPageAssets'

type PreloadFilter = null | ((assets: PreloadFilterEntry[]) => PreloadFilterEntry[])
type PreloadFilterEntry = {
  src: string
  assetType: null | PageAsset['assetType']
  mediaType: null | PageAsset['mediaType']
  isPreload: boolean
  inject: false | 'HTML_BEGIN' | 'HTML_END'
}

type HtmlTag = {
  htmlTag: string | (() => string)
  position: 'HTML_BEGIN' | 'HTML_END' | 'STREAM'
}
async function getHtmlTags(
  pageContext: PageContextInjectAssets,
  injectToStream: null | InjectToStream,
  preloadFilter: PreloadFilter
) {
  assert([true, false].includes(pageContext._isHtmlOnly))
  const isHtmlOnly = pageContext._isHtmlOnly

  assert(pageContext._pageContextPromise === null || pageContext._pageContextPromise)
  const injectJavaScriptDuringStream = pageContext._pageContextPromise === null && !!injectToStream

  let pageAssets = await pageContext.__getPageAssets()

  const htmlSnippets: HtmlTag[] = []

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
      assertWarning(a.inject, `We recommend against not injecting ${a.src}`, { onlyOnce: true, showStackTrace: false })
    }
  })
  for (const entry of preloadFilterEntries) {
    if (entry.inject) {
      const htmlTag = entry.isPreload ? inferPreloadTag(entry) : inferAssetTag(entry)
      htmlSnippets.push({ htmlTag, position: entry.inject })
    }
  }

  const positionJs = injectJavaScriptDuringStream ? 'STREAM' : 'HTML_END'

  const jsScript = await getMergedScriptTag(pageAssets, pageContext)
  if (jsScript) {
    htmlSnippets.push({
      htmlTag: jsScript,
      position: positionJs
    })
  }
  for (const pageAsset of pageAssets) {
    const { assetType } = pageAsset

    // JavaScript
    if (assetType === 'script') {
      // We only add preload tags: asset tags are already included with `getMergedScriptTag()`
      const htmlTag = inferPreloadTag(pageAsset)
      if (!isHtmlOnly) {
        htmlSnippets.push({ htmlTag, position: positionJs })
      }
      continue
    }
  }

  // Serialized pageContext
  if (!isHtmlOnly) {
    htmlSnippets.push({
      // Needs to be called after `resolvePageContextPromise()`
      htmlTag: () => getPageContextTag(pageContext),
      position: positionJs
    })
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
  const htmlTag = `<script id="vite-plugin-ssr_pageContext" type="application/json">${pageContextSerialized}</script>`
  return htmlTag
}
