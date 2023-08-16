export { getHtmlTags }
export type { HtmlTag }
export type { PreloadFilter }
export type { InjectFilterEntry }

import { assert, assertWarning, assertUsage, isObject, freezePartial } from '../../utils.js'
import { type PageContextSerialization, serializePageContextClientSide } from '../serializePageContextClientSide.js'
import { sanitizeJson } from './sanitizeJson.js'
import { inferAssetTag, inferPreloadTag } from './inferHtmlTags.js'
import { getViteDevScripts } from './getViteDevScripts.js'
import { mergeScriptTags } from './mergeScriptTags.js'
import type { PageContextInjectAssets } from '../injectAssets.js'
import type { InjectToStream } from '../stream/react-streaming.js'
import type { PageAsset } from '../../renderPage/getPageAssets.js'
import { getGlobalContext } from '../../globalContext.js'

type PreloadFilter = null | ((assets: InjectFilterEntry[]) => InjectFilterEntry[])
type PreloadFilterInject = false | 'HTML_BEGIN' | 'HTML_END'
/** Filter what assets vite-plugin-ssr injects in the HTML.
 *
 * https://vite-plugin-ssr.com/injectFilter
 */
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
  pageContext: { _isStream: boolean } & PageContextInjectAssets,
  injectToStream: null | InjectToStream,
  injectFilter: PreloadFilter
) {
  assert([true, false].includes(pageContext._isHtmlOnly))
  const isHtmlOnly = pageContext._isHtmlOnly

  const globalContext = getGlobalContext()
  const { isProduction } = globalContext

  const injectJavaScriptDuringStream = !pageContext._pageContextPromise && !!injectToStream

  const pageAssets = await pageContext.__getPageAssets()

  const stamp = Symbol('injectFilterEntryStamp')
  const getInject = (asset: PageAsset): PreloadFilterInject => {
    if (!isProduction) {
      return 'HTML_BEGIN'
    }
    if (asset.assetType === 'style' || asset.assetType === 'font') {
      return 'HTML_BEGIN'
    }
    if (asset.assetType === 'script') {
      return 'HTML_END'
    }
    return false
  }
  const injectFilterEntries: InjectFilterEntry[] = pageAssets
    .filter((asset) => {
      if (asset.isEntry && asset.assetType === 'script') {
        // We could in principle allow the user to change the position of <script> but we don't because of `getMergedScriptTag()`
        return false
      }
      if (isHtmlOnly && asset.assetType === 'script') {
        return false
      }
      return true
    })
    .map((asset) => {
      const inject = getInject(asset)
      const entry: InjectFilterEntry = {
        ...asset,
        inject,
        // @ts-ignore
        [stamp]: true
      }
      return entry
    })
  assertInjectFilterEntries(injectFilterEntries, stamp)

  if (injectFilter && isProduction) {
    Object.seal(injectFilterEntries) // `Object.seal()` instead of `Object.freeze()` to allow the user to `assets.sort()`
    Object.values(injectFilterEntries).forEach((entry) =>
      freezePartial(entry, { inject: (val) => val === false || val === 'HTML_BEGIN' || val === 'HTML_END' })
    )

    const res = injectFilter(injectFilterEntries)
    assertUsage(res === undefined, 'Wrong injectFilter() usage, see https://vite-plugin-ssr.com/injectFilter')
    assertInjectFilterUsage(injectFilterEntries, stamp)
    injectFilterEntries.forEach((a) => {
      /*
      if (a.assetType === 'script' && a.isEntry) {
        assertUsage(a.inject, `[injectFilter()] ${a.src} needs to be injected`)
      }
      */
      if (a.assetType === 'style' && a.isEntry) {
        // In development, Vite automatically inject styles, but we still inject `<link rel="stylesheet" type="text/css" href="${src}">` tags in order to avoid FOUC (flash of unstyled content).
        //  - https://github.com/vitejs/vite/issues/2282
        //  - https://github.com/brillout/vite-plugin-ssr/issues/261
        assertWarning(a.inject, `[injectFilter()] We recommend against not injecting ${a.src}`, {
          onlyOnce: true
        })
      }
      if (!isHtmlOnly && a.assetType === 'script') {
        assertWarning(a.inject, `[injectFilter()] We recommend against not preloading JavaScript (${a.src})`, {
          onlyOnce: true
        })
      }
    })
  }

  const htmlTags: HtmlTag[] = []

  // Non-JavaScript
  for (const asset of injectFilterEntries) {
    if (asset.assetType !== 'script' && asset.inject) {
      const htmlTag = asset.isEntry ? inferAssetTag(asset) : inferPreloadTag(asset)
      htmlTags.push({ htmlTag, position: asset.inject })
    }
  }

  // JavaScript
  const positionProd = injectJavaScriptDuringStream ? 'STREAM' : 'HTML_END'
  const positionScript = !isProduction ? 'HTML_BEGIN' : positionProd
  const positionJsonData =
    !isProduction && !pageContext._pageContextPromise && !pageContext._isStream ? 'HTML_BEGIN' : positionProd
  const jsScript = await getMergedScriptTag(pageAssets, isProduction)
  if (jsScript) {
    htmlTags.push({
      htmlTag: jsScript,
      position: positionScript
    })
  }
  for (const asset of injectFilterEntries) {
    if (asset.assetType === 'script' && asset.inject) {
      const htmlTag = asset.isEntry ? inferAssetTag(asset) : inferPreloadTag(asset)
      const position = asset.inject === 'HTML_END' ? positionScript : asset.inject
      htmlTags.push({ htmlTag, position })
    }
  }

  // `pageContext` JSON data
  if (!isHtmlOnly) {
    // Don't allow the user to manipulate with injectFilter(): injecting <script type="application/json"> before the stream can break the app when:
    //  - using https://vite-plugin-ssr.com/stream#initial-data-after-stream-end
    //  - `pageContext` is modified during the stream, e.g. /examples/vue-pinia which uses https://vuejs.org/api/composition-api-lifecycle.html#onserverprefetch
    // The <script> tags are handled separately by vite-plugin-ssr down below.
    htmlTags.push({
      // Needs to be called after `resolvePageContextPromise()`
      htmlTag: () => getPageContextTag(pageContext),
      position: positionJsonData
    })
  }

  return htmlTags
}

async function getMergedScriptTag(pageAssets: PageAsset[], isProduction: boolean): Promise<null | string> {
  const scriptAssets = pageAssets.filter((pageAsset) => pageAsset.isEntry && pageAsset.assetType === 'script')
  const viteScripts = await getViteDevScripts()
  const scriptTagsHtml = `${viteScripts}${scriptAssets.map((asset) => inferAssetTag(asset)).join('')}`
  const scriptTag = mergeScriptTags(scriptTagsHtml, isProduction)
  return scriptTag
}

function getPageContextTag(pageContext: PageContextSerialization): string {
  const pageContextSerialized = sanitizeJson(serializePageContextClientSide(pageContext))
  const htmlTag = `<script id="vite-plugin-ssr_pageContext" type="application/json">${pageContextSerialized}</script>`
  // @ts-expect-error
  pageContext._pageContextHtmlTag = htmlTag
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
