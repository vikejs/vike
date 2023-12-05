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
import pc from '@brillout/picocolors'

const stamp = '__injectFilterEntry'

type PreloadFilter = null | ((assets: InjectFilterEntry[]) => InjectFilterEntry[])
type PreloadFilterInject = false | 'HTML_BEGIN' | 'HTML_END'
/** Filter what assets vike injects in the HTML.
 *
 * https://vike.dev/injectFilter
 */
type InjectFilterEntry = {
  src: string
  assetType: null | PageAsset['assetType']
  mediaType: null | PageAsset['mediaType']
  /** Whether src is a root in the dependency graph.
   *  - For JavaScript this means whether src is imported by a dynamic import() statement.
   *  - All CSS files have `isEntry: true`
   */
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
  const { isProduction } = getGlobalContext()

  const pageAssets = await pageContext.__getPageAssets()
  const injectFilterEntries: InjectFilterEntry[] = pageAssets
    .filter((asset) => {
      if (asset.isEntry && asset.assetType === 'script') {
        // We could allow the user to change the position of <script> but we currently don't:
        //  - Because of mergeScriptEntries()
        //  - We would need to add STREAM to to PreloadFilterInject
        // To suppor this, we should add the JavaScript entry to injectFilterEntries (with an `src` value of `null`)
        return false
      }
      return true
    })
    .map((asset) => {
      const inject = (() => {
        if (!isProduction) {
          // In development, we should always load assets as soon as possible, in order to eagerly process assets (e.g. applying the transform() hooks of Vite plugins) which are lazily discovered.
          return 'HTML_BEGIN'
        }
        if (asset.assetType === 'style' || asset.assetType === 'font') {
          return 'HTML_BEGIN'
        }
        if (asset.assetType === 'script') {
          return 'HTML_END'
        }
        return false
      })()
      const entry: InjectFilterEntry = {
        ...asset,
        inject,
        // @ts-ignore
        [stamp]: true
      }
      return entry
    })
  assertInjectFilterEntries(injectFilterEntries)

  // ==============
  // injectFilter()
  // ==============
  if (injectFilter && isProduction) {
    Object.seal(injectFilterEntries) // `Object.seal()` instead of `Object.freeze()` to allow the user to `assets.sort()`
    Object.values(injectFilterEntries).forEach((entry) =>
      freezePartial(entry, { inject: (val) => val === false || val === 'HTML_BEGIN' || val === 'HTML_END' })
    )
    // Call the user's injectFilter() hook https://vike.dev/injectFilter
    const res = injectFilter(injectFilterEntries)
    assertUsage(
      res === undefined,
      `injectFilter() should return ${pc.cyan('undefined')}, see https://vike.dev/injectFilter`
    )
    assertInjectFilterUsage(injectFilterEntries)
  }

  const htmlTags: HtmlTag[] = []

  // ==============
  // Non-JavaScript
  // ==============
  injectFilterEntries
    .filter((asset) => asset.assetType !== 'script' && asset.inject)
    .forEach((asset) => {
      if (!asset.inject) return
      const htmlTag = asset.isEntry ? inferAssetTag(asset) : inferPreloadTag(asset)
      htmlTags.push({ htmlTag, position: asset.inject })
    })

  // ==========
  // JavaScript
  // ==========
  // In order to avoid the race-condition depicted in https://github.com/vikejs/vike/issues/567
  // 1. <script id="vike_pageContext" type="application/json"> must appear before the entry <script> (which loads Vike's client runtime).
  // 2. <script id="vike_pageContext" type="application/json"> can't be async nor defer.
  // Additionally:
  // 3. the entry <script> can't be defer, otherwise progressive hydration while SSR streaming won't work.
  // 4. the entry <script> should be towards the end of the HTML as performance-wise it's more interesting to parse
  //    <div id="page-view"> before running the entry <script> which initiates the hydration.
  // See https://github.com/vikejs/vike/pull/1271
  const positionJavaScriptEntry = (() => {
    if (pageContext._pageContextPromise) {
      // If there is a pageContext._pageContextPromise (which is resolved after the stream has ended) then the pageContext JSON data needs to await for it: https://vike.dev/stream#initial-data-after-stream-end
      return 'HTML_END'
    }
    if (injectToStream) {
      // If there is a stream then, in order to support partial hydration, inject the JavaScript during the stream after React(/Vue/Solid/...) resolved the first suspense boundary
      return 'STREAM'
    } else {
      return 'HTML_END'
    }
  })()
  // <script id="vike_pageContext" type="application/json">
  if (!isHtmlOnly) {
    htmlTags.push({
      htmlTag: () =>
        // Needs to be called after resolvePageContextPromise()
        getPageContextJsonScriptTag(pageContext),
      position: positionJavaScriptEntry
    })
  }
  // The JavaScript entry <script> tag
  const scriptEntry = await mergeScriptEntries(pageAssets, isProduction)
  if (scriptEntry) {
    htmlTags.push({
      htmlTag: scriptEntry,
      position: positionJavaScriptEntry
    })
  }
  // Preload tags
  injectFilterEntries
    .filter((asset) => asset.assetType === 'script')
    .forEach((asset) => {
      assert(!asset.isEntry) // Users cannot re-order JavaScript entries, see creation of injectFilterEntries
      const htmlTag = inferPreloadTag(asset)
      if (!asset.inject) return
      // Ideally, instead of this conditional ternary operator, we should add STREAM to PreloadFilterInject (or a better fitting name such as HTML_STREAM)
      const position = asset.inject === 'HTML_END' ? positionJavaScriptEntry : asset.inject
      htmlTags.push({ htmlTag, position })
    })

  return htmlTags
}

async function mergeScriptEntries(pageAssets: PageAsset[], isProduction: boolean): Promise<null | string> {
  const scriptEntries = pageAssets.filter((pageAsset) => pageAsset.isEntry && pageAsset.assetType === 'script')
  const viteScripts = await getViteDevScripts()
  const scriptTagsHtml = `${viteScripts}${scriptEntries.map((asset) => inferAssetTag(asset)).join('')}`
  const scriptTag = mergeScriptTags(scriptTagsHtml, isProduction)
  return scriptTag
}

function getPageContextJsonScriptTag(pageContext: PageContextSerialization): string {
  const pageContextSerialized = sanitizeJson(serializePageContextClientSide(pageContext))
  const htmlTag = `<script id="vike_pageContext" type="application/json">${pageContextSerialized}</script>`
  // @ts-expect-error
  pageContext._pageContextHtmlTag = htmlTag
  return htmlTag
}

function assertInjectFilterEntries(injectFilterEntries: InjectFilterEntry[]) {
  try {
    checkForWrongUsage(injectFilterEntries)
  } catch (err) {
    if ((err as undefined | { message: string })?.message.includes('[Wrong Usage]')) {
      assert(false)
    }
    throw err
  }
}

function assertInjectFilterUsage(injectFilterEntries: InjectFilterEntry[]) {
  checkForWrongUsage(injectFilterEntries)
  checkForWarnings(injectFilterEntries)
}
function checkForWrongUsage(injectFilterEntries: InjectFilterEntry[]) {
  injectFilterEntries.forEach((entry, i) => {
    assertUsage(isObject(entry), `[injectFilter()] Entry ${i} isn't an object`)
    assertUsage(typeof entry.src === 'string', `[injectFilter()] Entry ${i} is missing property ${pc.cyan('src')}`)
    assertUsage(
      (entry as Record<string, unknown>)[stamp] === true,
      `[injectFilter()] Entry ${i} (${entry.src}) isn't the original object, see https://vike.dev/injectFilter`
    )
    assert([false, 'HTML_BEGIN', 'HTML_END'].includes(entry.inject))
    assert(entry.assetType === null || typeof entry.assetType === 'string')
    assert(entry.mediaType === null || typeof entry.mediaType === 'string')
    assert(typeof entry.isEntry === 'boolean')
    assert(Object.keys(entry).length === 6)
  })
}
function checkForWarnings(injectFilterEntries: InjectFilterEntry[]) {
  injectFilterEntries.forEach((a) => {
    /*
    if (a.assetType === 'script' && a.isEntry) {
      assertUsage(a.inject, `[injectFilter()] ${a.src} needs to be injected`)
    }
    */
    if (a.assetType === 'style' && a.isEntry) {
      // In development, Vite automatically inject styles, but we still inject `<link rel="stylesheet" type="text/css" href="${src}">` tags in order to avoid FOUC (flash of unstyled content).
      //  - https://github.com/vitejs/vite/issues/2282
      //  - https://github.com/vikejs/vike/issues/261
      assertWarning(a.inject, `[injectFilter()] We recommend against not injecting ${a.src}`, {
        onlyOnce: true
      })
    }
    if (a.assetType === 'script') {
      assertWarning(a.inject, `[injectFilter()] We recommend against not preloading JavaScript (${a.src})`, {
        onlyOnce: true
      })
    }
  })
}
