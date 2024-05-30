export type { PrefetchStaticAssets }
export type { PrefetchSetting }

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
