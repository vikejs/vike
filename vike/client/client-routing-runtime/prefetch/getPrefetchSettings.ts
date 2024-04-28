export { getPrefetchSettings }
export { PrefetchPageContext }

import type { PrefetchWhen, PrefetchExpire } from '../../../shared/types/Prefetch.js'
import { assert, assertUsage, assertInfo, assertWarning, isPlainObject } from '../utils.js'

type PageContextPrefetch = {
  exports: Record<string, unknown>
}

type PrefetchPageContext = {
  when?: PrefetchWhen
  expire?: PrefetchExpire
}

type PrefetchSettings = {
  prefetchStaticAssets: PrefetchWhen
  prefetchPageContext: PrefetchPageContext
}

function getPrefetchSettings(pageContext: PageContextPrefetch, linkTag: HTMLElement): PrefetchSettings {
  let prefetchStaticAssets = getPrefetchStaticAssets(pageContext, linkTag)
  let prefetchPageContext = getPrefetchPageContext(pageContext, linkTag)
  if (prefetchStaticAssets === 'viewport' && import.meta.env.DEV) {
    assertInfo(false, 'Viewport prefetching is disabled in development', { onlyOnce: true })
    prefetchStaticAssets = 'hover'
  }
  if (prefetchPageContext.when === 'viewport' && import.meta.env.DEV) {
    assertInfo(false, 'Viewport prefetching is disabled in development', { onlyOnce: true })
    prefetchStaticAssets = 'hover'
  }
  return {
    prefetchStaticAssets,
    prefetchPageContext
  }
}

function getPrefetchStaticAssets(pageContext: PageContextPrefetch, linkTag: HTMLElement): PrefetchWhen {
  {
    const prefetchAttribute = getPrefetchStaticAssetsAttribute(linkTag)
    if (prefetchAttribute !== null) return prefetchAttribute
  }

  // TODO/v1-release: remove
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

function getPrefetchPageContext(pageContext: PageContextPrefetch, linkTag: HTMLElement): PrefetchPageContext {
  {
    const prefetchAttribute = getPrefetchPageContextAttribute(linkTag)
    if (prefetchAttribute !== null) return prefetchAttribute
  }

  if ('prefetchPageContext' in pageContext.exports) {
    const { prefetchPageContext } = pageContext.exports

    const wrongUsageMsg = `prefetchPageContext should be an object with 'when' and 'expire' properties. 'when' should be false, 'hover' or 'viewport', and 'expire' should be a number`

    assertUsage(isPlainObject(prefetchPageContext), wrongUsageMsg)
    const keys = Object.keys(prefetchPageContext)
    assertUsage(keys.length === 2 && keys[0] === 'when' && keys[1] === 'expire', wrongUsageMsg)
    const { when, expire } = prefetchPageContext
    if (when === false) {
      return { when: false, expire: 0 }
    }
    if ((when === 'hover' || when === 'viewport') && typeof expire === 'number') {
      return { when, expire }
    }

    if ((when === 'HOVER' || when === 'VIEWPORT') && typeof expire === 'number') {
      const correctValue: 'hover' | 'viewport' = when.toLowerCase() as any
      return { when: correctValue, expire }
    }

    assertUsage(false, wrongUsageMsg)
  }

  return { when: false, expire: 0 }
}

function getPrefetchStaticAssetsAttribute(linkTag: HTMLElement): PrefetchWhen | null {
  const attr = linkTag.getAttribute('data-prefetch-static-assets')
  const attrOld = linkTag.getAttribute('data-prefetch')

  if (attr === null && attrOld === null) {
    return null
  }

  // TODO/v1-release: remove
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

function getPrefetchPageContextAttribute(linkTag: HTMLElement): PrefetchPageContext | null {
  const whenAttr = linkTag.getAttribute('data-prefetch-page-context-when')
  const expireAttr = linkTag.getAttribute('data-prefetch-page-context-expire')

  if (whenAttr === null && expireAttr === null) {
    return null
  }

  if (whenAttr) {
    if (whenAttr === 'false') {
      return { when: false, expire: 0 }
    }

    if (whenAttr === 'hover' || whenAttr === 'viewport') {
      const correctValue: 'hover' | 'viewport' = whenAttr.toLowerCase() as any

      if (expireAttr === null) {
        return { when: correctValue, expire: 0 }
      }

      if (!Number.isNaN(parseInt(expireAttr, 10))) {
        return { when: correctValue, expire: parseInt(expireAttr, 10) }
      }

      assertUsage(false, `data-prefetch-page-context-expire has value "${expireAttr}" but it should instead be number`)
    }

    assertUsage(
      false,
      `data-prefetch-page-context has value "${whenAttr}" but it should instead be "false", "hover", or "viewport"`
    )
  }

  if (expireAttr !== null) {
    if (!Number.isNaN(parseInt(expireAttr, 10))) {
      return { when: 'hover', expire: parseInt(expireAttr, 10) }
    }

    assertUsage(false, `data-prefetch-page-context-expire has value "${expireAttr}" but it should instead be number`)
  }

  assert(false)
}
