export { getPrefetchSettings }
export type { PrefetchStaticAssets }

import { assert, assertUsage, assertInfo, assertWarning, isPlainObject } from '../utils'

type PageContextPrefetch = {
  exports: Record<string, unknown>
  _isProduction: boolean
}

type PrefetchStaticAssets = false | 'hover' | 'viewport'
type PrefetchSettings = {
  prefetchStaticAssets: PrefetchStaticAssets
}

function getPrefetchSettings(pageContext: PageContextPrefetch, linkTag: HTMLElement): PrefetchSettings {
  let prefetchStaticAssets = getPrefetchStaticAssets(pageContext, linkTag)
  if (prefetchStaticAssets === 'viewport' && !pageContext._isProduction) {
    assertInfo(false, 'Viewport prefetching is disabled in development', { onlyOnce: true })
    prefetchStaticAssets = 'hover'
  }
  return {
    prefetchStaticAssets
  }
}
function getPrefetchStaticAssets(pageContext: PageContextPrefetch, linkTag: HTMLElement): PrefetchStaticAssets {
  {
    const prefetchAttribute = getPrefetchAttribute(linkTag)
    if (prefetchAttribute !== null) return prefetchAttribute
  }

  if ('prefetchLinks' in pageContext.exports) {
    assertUsage(false, '`export { prefetchLinks }` is deprecated, use `export { prefetchStaticAssets }` instead.')
  }

  if ('prefetchStaticAssets' in pageContext.exports) {
    const { prefetchStaticAssets } = pageContext.exports
    if (prefetchStaticAssets === false) {
      return false
    }
    if (prefetchStaticAssets === 'hover') {
      return 'hover'
    }
    if (prefetchStaticAssets === 'viewport') {
      return 'viewport'
    }

    const wrongUsageMsg = "prefetchStaticAssets value should be false, 'hover', or 'viewport'"

    // TODO/v1-release: remove
    assertUsage(isPlainObject(prefetchStaticAssets), wrongUsageMsg)
    const keys = Object.keys(prefetchStaticAssets)
    assertUsage(keys.length === 1 && keys[0] === 'when', wrongUsageMsg)
    const { when } = prefetchStaticAssets
    if (when === 'HOVER' || when === 'VIEWPORT') {
      const correctValue: 'hover' | 'viewport' = when.toLowerCase() as any
      assertWarning(
        false,
        `prefetchStaticAssets value \`{ when: '${when}' }\` is outdated: set prefetchStaticAssets to '${correctValue}' instead`,
        { onlyOnce: true }
      )
      return correctValue
    }

    assertUsage(false, wrongUsageMsg)
  }

  return 'hover'
}

function getPrefetchAttribute(linkTag: HTMLElement): PrefetchStaticAssets | null {
  const attr = linkTag.getAttribute('data-prefetch-static-assets')
  const attrOld = linkTag.getAttribute('data-prefetch')

  if (attr === null && attrOld === null) {
    return null
  }

  const deprecationNotice = 'The attribute data-prefetch is outdated, use data-prefetch-static-assets instead.'

  if (attr) {
    assertUsage(attrOld === null, deprecationNotice)
    if (attr === 'hover' || attr === 'viewport') {
      return attr
    }
    if (attr === 'false') {
      return false
    }
    assertUsage(
      false,
      `data-prefetch-static-assets has value "${attr}" but it should instead be "false", "hover", or "viewport"`
    )
  }

  // TODO/v1-release: remove
  if (attrOld) {
    assert(!attr)
    assertWarning(false, deprecationNotice, {
      onlyOnce: true
    })
    if (attrOld === 'true') {
      return 'viewport'
    }
    if (attrOld === 'false') {
      return 'hover'
    }
    assertUsage(false, `data-prefetch has value "${attrOld}" but it should instead be "true" or "false"`)
  }

  assert(false)
}
