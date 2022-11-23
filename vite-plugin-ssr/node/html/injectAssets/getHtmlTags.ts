export { getHtmlTags }
export type { HtmlTag }
export type { PreloadFilter }
export type { InjectFilterEntry }

import { assert, assertWarning, assertUsage, isObject, freezePartial } from '../../utils'
import { serializePageContextClientSide } from '../../serializePageContextClientSide'
import { sanitizeJson } from './sanitizeJson'
import { inferAssetTag, inferPreloadTag } from './inferHtmlTags'
import { getViteDevScripts } from './getViteDevScripts'
import { mergeScriptTags } from './mergeScriptTags'
import type { PageContextInjectAssets } from '../injectAssets'
import type { InjectToStream } from 'react-streaming/server'
import type { PageAsset } from '../../renderPage/getPageAssets'

type PreloadFilter = null | ((assets: InjectFilterEntry[]) => InjectFilterEntry[])
type PreloadFilterInject = false | 'HTML_BEGIN' | 'HTML_END'
type InjectFilterEntry = {
  src: string
  assetType: null | PageAsset['assetType']
  mediaType: null | PageAsset['mediaType']
  isEntry: boolean
  inject: PreloadFilterInject
}

type HtmlTag = {
  htmlTag: string | (() => string)
  position: 'HTML_BEGIN' | 'HTML_END' | 'STREAM'
}
async function getHtmlTags(
  pageContext: PageContextInjectAssets,
  injectToStream: null | InjectToStream,
  injectFilter: PreloadFilter
) {
  assert([true, false].includes(pageContext._isHtmlOnly))
  const isHtmlOnly = pageContext._isHtmlOnly

  assert(pageContext._pageContextPromise === null || pageContext._pageContextPromise)
  const injectJavaScriptDuringStream = pageContext._pageContextPromise === null && !!injectToStream

  let pageAssets = await pageContext.__getPageAssets()

  const htmlTags: HtmlTag[] = []

  const stamp = Symbol('injectFilterEntryStamp')
  const injectFilterEntries: InjectFilterEntry[] = pageAssets
    .filter((asset) => {
      if (asset.assetType !== 'script') {
        return true
      } else {
        return (
          // We don't allow the user the manipulate <script> tags because it can break hydration while streaming
          !asset.isEntry &&
          // We don't allow the user to preload JavaScript when the page is HTML-only
          !isHtmlOnly
        )
      }
    })
    .map((asset) => {
      let inject: PreloadFilterInject = false
      if (asset.assetType === 'style' || asset.assetType === 'font') {
        inject = 'HTML_BEGIN'
      }
      if (asset.assetType === 'script') {
        inject = 'HTML_END'
      }
      const entry: InjectFilterEntry = {
        ...asset,
        inject,
        // @ts-ignore
        [stamp]: true
      }
      return entry
    })
  assertInjectFilterEntries(injectFilterEntries, stamp)

  if (injectFilter && pageContext._isProduction) {
    Object.freeze(injectFilterEntries)
    Object.values(injectFilterEntries).forEach((entry) =>
      freezePartial(entry, { inject: (val) => val === false || val === 'HTML_BEGIN' || val === 'HTML_END' })
    )

    const res = injectFilter(injectFilterEntries)
    assertUsage(res === undefined, 'Wrong injectFilter() usage, see https://vite-plugin-ssr.com/injectFilter')
    assertInjectFilterUsage(injectFilterEntries, stamp)
  }
  injectFilterEntries.forEach((a) => {
    if (a.assetType === 'style') {
      // In development, Vite automatically inject styles, but we still inject `<link rel="stylesheet" type="text/css" href="${src}">` tags in order to avoid FOUC (flash of unstyled content).
      //  - https://github.com/vitejs/vite/issues/2282
      //  - https://github.com/brillout/vite-plugin-ssr/issues/261
      assertWarning(a.inject, `We recommend against not injecting ${a.src}`, { onlyOnce: true, showStackTrace: false })
    }
    if (!isHtmlOnly && a.assetType === 'script') {
      assertWarning(a.inject, `We recommend against not preloading JavaScript (${a.src})`, {
        onlyOnce: true,
        showStackTrace: false
      })
    }
  })

  // Non-JavaScript
  for (const asset of injectFilterEntries) {
    if (asset.assetType !== 'script' && asset.inject) {
      const htmlTag = asset.isEntry ? inferAssetTag(asset) : inferPreloadTag(asset)
      htmlTags.push({ htmlTag, position: asset.inject })
    }
  }

  // JavaScript
  const positionJs = injectJavaScriptDuringStream ? 'STREAM' : 'HTML_END'
  const jsScript = await getMergedScriptTag(pageAssets, pageContext)
  if (jsScript) {
    htmlTags.push({
      htmlTag: jsScript,
      position: positionJs
    })
  }
  for (const asset of injectFilterEntries) {
    if (asset.assetType === 'script' && asset.inject) {
      const htmlTag = asset.isEntry ? inferAssetTag(asset) : inferPreloadTag(asset)
      const position = asset.inject === 'HTML_END' ? positionJs : asset.inject
      htmlTags.push({ htmlTag, position })
    }
  }

  // `pageContext` JSON data
  if (!isHtmlOnly) {
    htmlTags.push({
      // Needs to be called after `resolvePageContextPromise()`
      htmlTag: () => getPageContextTag(pageContext),
      position: positionJs
    })
  }

  return htmlTags
}

async function getMergedScriptTag(
  pageAssets: PageAsset[],
  pageContext: PageContextInjectAssets
): Promise<null | string> {
  const scriptAssets = pageAssets.filter((pageAsset) => pageAsset.isEntry && pageAsset.assetType === 'script')
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

function assertInjectFilterEntries(injectFilterEntries: InjectFilterEntry[], stamp: any) {
  try {
    assertInjectFilterUsage(injectFilterEntries, stamp)
  } catch (err) {
    if ((err as undefined | { message: string })?.message.includes('[Wrong Usage]')) {
      assert(false)
    }
    throw err
  }
}
function assertInjectFilterUsage(injectFilterEntries: InjectFilterEntry[], stamp: any) {
  injectFilterEntries.forEach((entry, i) => {
    assertUsage(isObject(entry), `[injectFilter()] Entry ${i} isn't an object`)
    assertUsage(typeof entry.src === 'string', `[injectFilter()] Entry ${i} is missing property \`src\``)
    assertUsage(
      (entry as any)[stamp] === true,
      `[injectFilter()] Entry ${i} (${entry.src}) isn't the original object, see https://vite-plugin-ssr.com/injectFilter`
    )
    assert([false, 'HTML_BEGIN', 'HTML_END'].includes(entry.inject))
    assert(entry.assetType === null || typeof entry.assetType === 'string')
    assert(entry.mediaType === null || typeof entry.mediaType === 'string')
    assert(typeof entry.isEntry === 'boolean')
    assert(Object.keys(entry).length === 5)
  })
}
