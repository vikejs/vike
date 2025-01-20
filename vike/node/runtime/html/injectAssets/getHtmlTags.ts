export { getHtmlTags }
export type { HtmlTag }
export type { PreloadFilter }
export type { InjectFilterEntry }

import { assert, assertWarning, assertUsage, isObject, freezePartial } from '../../utils.js'
import { type PageContextSerialization, serializePageContextClientSide } from '../serializePageContextClientSide.js'
import { sanitizeJson } from './sanitizeJson.js'
import { inferAssetTag, inferPreloadTag } from './inferHtmlTags.js'
import { mergeScriptTags } from './mergeScriptTags.js'
import type { PageContextInjectAssets } from '../injectAssets.js'
import type { StreamFromReactStreamingPackage } from '../stream/react-streaming.js'
import type { PageAsset } from '../../renderPage/getPageAssets.js'
import type { PageConfigRuntime } from '../../../../shared/page-configs/PageConfig.js'
import { getPageConfig } from '../../../../shared/page-configs/helpers.js'
import { getConfigValueRuntime } from '../../../../shared/page-configs/getConfigValueRuntime.js'
import { getGlobalContext } from '../../globalContext.js'
import pc from '@brillout/picocolors'
import { getConfigDefinedAt } from '../../../../shared/page-configs/getConfigDefinedAt.js'

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

type Position = 'HTML_BEGIN' | 'HTML_END' | 'HTML_STREAM'
type HtmlTag = {
  htmlTag: string | (() => string)
  position: Position
}
function getHtmlTags(
  pageContext: { _isStream: boolean } & PageContextInjectAssets,
  streamFromReactStreamingPackage: null | StreamFromReactStreamingPackage,
  injectFilter: PreloadFilter,
  pageAssets: PageAsset[],
  viteDevScript: string,
  isStream: boolean
) {
  assert([true, false].includes(pageContext._isHtmlOnly))
  const isHtmlOnly = pageContext._isHtmlOnly
  const { isProduction } = getGlobalContext()
  const injectScriptsAt = getInjectScriptsAt(pageContext.pageId, pageContext._pageConfigs)

  const injectFilterEntries: InjectFilterEntry[] = pageAssets
    .filter((asset) => {
      if (asset.isEntry && asset.assetType === 'script') {
        // We could allow the user to change the position of <script> but we currently don't:
        //  - Because of mergeScriptEntries()
        //  - We would need to add HTML_STREAM to to PreloadFilterInject
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
          if (isHtmlOnly) return false
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
  // - By default, we place the entry <script> towards the end of the HTML for better performance.
  //   - Performance-wise, it's more interesting to start showing the page (parse HTML and load CSS) before starting loading scripts.
  //   - But with HTML streaming, in order to support [Progressive Rendering](https://vike.dev/streaming#progressive-rendering), the entry <script> should be injected earlier instead.
  // - The entry <script> shouldn't be `<script defer>` upon HTML streaming, otherwise progressive hydration while SSR streaming won't work.
  // - `<script id="vike_pageContext" type="application/json">` (the `pageContext` JSON) should be fully sent before Vike's client runtime starts executing.
  //   - Otherwise, race condition "SyntaxError: Unterminated string in JSON": https://github.com/vikejs/vike/issues/567
  //   - `<script id="vike_pageContext" type="application/json">` must appear before the entry <script> (which loads Vike's client runtime).
  //   - `<script id="vike_pageContext" type="application/json">` can't be async nor defer.
  const positionJavaScriptDefault = 'HTML_END'
  const positionJavaScriptEntry = (() => {
    if (injectScriptsAt !== null) {
      if (pageContext._pageContextPromise) {
        assertWarning(
          injectScriptsAt === 'HTML_END' || !isStream,
          `You're setting injectScriptsAt to ${pc.code(
            JSON.stringify(injectScriptsAt)
          )} while using HTML streaming with a pageContext promise (https://vike.dev/streaming#initial-data-after-stream-end) which is contradictory: the pageContext promise is skipped.`,
          { onlyOnce: true }
        )
      }
      if (injectScriptsAt === 'HTML_STREAM' && !isStream) {
        return positionJavaScriptDefault
      }
      return injectScriptsAt
    }
    if (pageContext._pageContextPromise) {
      // - If there is a pageContext._pageContextPromise then <script id="vike_pageContext" type="application/json"> needs to await for it.
      // - pageContext._pageContextPromise is typically resolved only after the page's components are rendered and the stream ended.
      // - https://vike.dev/streaming#initial-data-after-stream-end
      return positionJavaScriptDefault
    }
    if (streamFromReactStreamingPackage && !streamFromReactStreamingPackage.hasStreamEnded()) {
      // If there is a stream then, in order to support progressive hydration, inject the JavaScript during the stream after React(/Vue/Solid/...) resolved the first suspense boundary.
      return 'HTML_STREAM'
    }
    return positionJavaScriptDefault
  })()
  if (pageContext._pageContextPromise && streamFromReactStreamingPackage) {
    // - Should we show this warning for Solid as well? Solid seems to also support progressive rendering.
    //   - https://github.com/vikejs/vike-solid/issues/95
    // - Vue doesn't seem to support progressive rendering yet.
    //   - https://github.com/vikejs/vike-vue/issues/85
    assertWarning(
      false,
      "We recommend against using HTML streaming and a pageContext promise (https://vike.dev/streaming#initial-data-after-stream-end) at the same time, because progressive hydration (https://vike.dev/streaming#progressive-rendering) won't work.",
      { onlyOnce: true }
    )
  }
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
  const scriptEntry = mergeScriptEntries(pageAssets, viteDevScript)
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
      // Ideally, instead of this conditional ternary operator, we should add HTML_STREAM to PreloadFilterInject
      const position = asset.inject === 'HTML_END' ? positionJavaScriptEntry : asset.inject
      htmlTags.push({ htmlTag, position })
    })

  return htmlTags
}

function mergeScriptEntries(pageAssets: PageAsset[], viteDevScript: string): null | string {
  const scriptEntries = pageAssets.filter((pageAsset) => pageAsset.isEntry && pageAsset.assetType === 'script')
  const scriptTagsHtml = `${viteDevScript}${scriptEntries.map((asset) => inferAssetTag(asset)).join('')}`
  const scriptTag = mergeScriptTags(scriptTagsHtml)
  return scriptTag
}

function getPageContextJsonScriptTag(pageContext: PageContextSerialization): string {
  const pageContextSerialized = sanitizeJson(serializePageContextClientSide(pageContext))
  const htmlTag = `<script id="vike_pageContext" type="application/json">${pageContextSerialized}</script>`

  // Used by contra.com https://github.com/gajus
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
function getInjectScriptsAt(pageId: string, pageConfigs: PageConfigRuntime[]): null | Position {
  if (pageConfigs.length === 0) return null // only support V1 design
  const pageConfig = getPageConfig(pageId, pageConfigs)
  const configValue = getConfigValueRuntime(pageConfig, 'injectScriptsAt')
  if (!configValue) return null
  const injectScriptsAt = configValue.value
  assert(configValue.definedAtData)
  const configDefinedAt = getConfigDefinedAt('Config', 'injectScriptsAt', configValue.definedAtData)
  assertUsage(
    injectScriptsAt === null ||
      injectScriptsAt === 'HTML_BEGIN' ||
      injectScriptsAt === 'HTML_END' ||
      injectScriptsAt === 'HTML_STREAM',
    `${configDefinedAt} has an invalid value`
  )
  return injectScriptsAt
}
