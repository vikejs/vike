export { getPrefetchConfig }

import { assert, assertUsage, assertInfo, assertWarning } from '../utils'

type PageContextPrefetch = {
  exports: Record<string, unknown>
  _isProduction: boolean
  url: string
}

type PrefetchConfig = {
  prefetchPageContext: false
  prefetchStaticAssets:
    | false
    | {
        when: 'HOVER' | 'VIEWPORT'
      }
}

function getPrefetchConfig(pageContext: PageContextPrefetch, linkTag: HTMLElement): PrefetchConfig {
  const prefetchStaticAssets = getStaticAssetsConfig(pageContext, linkTag)
  return {
    prefetchPageContext: false, // https://github.com/brillout/vite-plugin-ssr/issues/246
    prefetchStaticAssets,
  }
}
function getStaticAssetsConfig(pageContext: PageContextPrefetch, linkTag: HTMLElement) {
  let prefetchAttribute = getPrefetchAttribute(linkTag)
  let prefetchStaticAssets = ((): false | { when: 'HOVER' | 'VIEWPORT' } => {
    if (prefetchAttribute !== null) {
      assertWarning(prefetchAttribute === null, 'The `data-prefetch` attribute is outdated.', { onlyOnce: true })
      if (prefetchAttribute === true) {
        return { when: 'VIEWPORT' }
      } else {
        return { when: 'HOVER' }
      }
    }
    if ('prefetchLinks' in pageContext.exports) {
      assertUsage(
        prefetchAttribute === null,
        '`export { prefetchLinks }` is deprecated, use `export { prefetchStaticAssets }` instead.',
      )
    }

    if ('prefetchStaticAssets' in pageContext.exports) {
      if (pageContext.exports.prefetchStaticAssets === false) {
        return false
      }
      return pageContext.exports.prefetchStaticAssets as { when: 'HOVER' | 'VIEWPORT' }
    }

    return { when: 'HOVER' }
  })()

  if (prefetchStaticAssets && prefetchStaticAssets.when === 'VIEWPORT' && !pageContext._isProduction) {
    assertInfo(
      false,
      'Viewport prefetching is disabled in development, see https://vite-plugin-ssr.com/useClientRouter',
    )
    prefetchStaticAssets = { when: 'HOVER' }
  }

  return prefetchStaticAssets
}

function getPrefetchAttribute(linkTag: HTMLElement): boolean | null {
  const prefetchAttribute = linkTag.getAttribute('data-prefetch')

  if (prefetchAttribute === null) return null
  assert(typeof prefetchAttribute === 'string')

  if (prefetchAttribute === 'true') {
    return true
  }
  if (prefetchAttribute === 'false') {
    return false
  }

  assertUsage(false, `Wrong data-prefetch value: \`"${prefetchAttribute}"\`; it should be \`"true"\` or \`"false"\`.`)
}
