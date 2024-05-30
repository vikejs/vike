// TODO: rename file

export { getPrefetchSetting }
export { PAGE_CONTEXT_MAX_AGE_DEFAULT }
export type { PrefetchSetting }
export type { PrefetchSettingResolved }
export type { PrefetchStaticAssets }

import { assertUsage, assertInfo, assertWarning } from '../utils.js'

const PAGE_CONTEXT_MAX_AGE_DEFAULT = 5000
const prefetchSettingTrue = {
  staticAssets: 'hover',
  pageContext: PAGE_CONTEXT_MAX_AGE_DEFAULT
} satisfies PrefetchSettingResolved
const prefetchSettingFalse = {
  staticAssets: 'hover',
  pageContext: false
} satisfies PrefetchSettingResolved
// TODO/v1-release: change to `prefetchSettingTrue`?
const prefetchSettingDefault = prefetchSettingFalse

type PrefetchSettingResolved = {
  staticAssets: false | 'hover' | 'viewport'
  pageContext: false | number
}
type PrefetchSetting =
  // { staticAssets: 'hover', pageContext: false }
  | false
  // { staticAssets: 'hover', pageContext: true }
  | true
  | {
      staticAssets?: false | 'hover' | 'viewport'
      pageContext?: boolean | number
    }
// TODO/v1-design: remove
/** @deprecated Use `prefetch` setting instead, see https://vike.dev/prefetch */
type PrefetchStaticAssets = false | 'hover' | 'viewport'

type PageContextPrefetch = {
  exports: Record<string, unknown>
}

function getPrefetchSetting(pageContext: PageContextPrefetch, linkTag: null | HTMLElement): PrefetchSettingResolved {
  let prefetchSetting: PrefetchSettingResolved = prefetchSettingDefault

  // TODO/v1-release: remove
  if ('prefetchLinks' in pageContext.exports) {
    assertUsage(false, '`export { prefetchLinks }` is deprecated, use `export { prefetchStaticAssets }` instead.')
  }

  // TODO/v1-release: remove
  if ('prefetchStaticAssets' in pageContext.exports) {
    const { prefetchStaticAssets } = pageContext.exports
    const msg = `Setting 'prefetchStaticAssets' deprecated in favor of setting 'prefetch', see https://vike.dev/prefetch`
    assertWarning(false, msg, { onlyOnce: true })
    assertUsage(
      prefetchStaticAssets === false || prefetchStaticAssets === 'hover' || prefetchStaticAssets === 'viewport',
      msg
    )
    prefetchSetting.staticAssets = prefetchStaticAssets
  }

  if ('prefetch' in pageContext.exports) {
    const { prefetch } = pageContext.exports
    if (prefetch === true) prefetchSetting = prefetchSettingTrue
    if (prefetch === false) prefetchSetting = prefetchSettingFalse
    // No validation in order to save client-side KBs
    Object.assign(prefetchSetting, prefetch)
  }

  if (prefetchSetting.staticAssets === 'viewport' && import.meta.env.DEV) {
    assertInfo(false, 'Viewport prefetching is disabled in development', { onlyOnce: true })
    prefetchSetting.staticAssets = 'hover'
  }

  if (linkTag) {
    {
      let attr = linkTag.getAttribute('data-prefetch')
      if (attr !== null) {
        if (attr === '') attr = 'true'
        if (attr === 'true') prefetchSetting = prefetchSettingTrue
        if (attr === 'false') prefetchSetting = prefetchSettingFalse
      }
    }
    {
      let attr = linkTag.getAttribute('data-prefetch-static-assets')
      if (attr !== null) {
        if (attr === '') attr = 'viewport'
        if (attr === 'false') prefetchSetting.staticAssets = false
        // No validation in order to save client-side KBs
        prefetchSetting.staticAssets = attr as 'hover' | 'viewport'
      }
    }
    {
      let attr = linkTag.getAttribute('data-prefetch-page-context')
      if (attr !== null) {
        if (attr === '') attr = 'true'
        if (attr === 'true') prefetchSetting.pageContext = PAGE_CONTEXT_MAX_AGE_DEFAULT
        if (attr === 'false') prefetchSetting.pageContext = false
        const n = parseInt(attr, 10)
        if (!Number.isNaN(n)) prefetchSetting.pageContext = n
        // No validation in order to save client-side KBs
      }
    }
  }

  return prefetchSetting
}
