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

// TODO/pageContext-prefetch: use and implement PrefetchSettingFuture
type PrefetchSettingValue = {
  staticAssets?:
    | false
    | 'hover'
    | 'viewport'
    | {
        when?: 'hover' | 'viewport'
        precedence?: number
      }
  pageContext?:
    | false
    | 'hover'
    | 'viewport'
    | {
        when?: 'hover' | 'viewport'
        maxAge?: number
        precedence?: number
      }
}
type PrefetchSettingFuture = PrefetchSettingValue & {
  links?: PrefetchSettingValue
}

// TODO/v1-release: remove
type PrefetchStaticAssets = false | 'hover' | 'viewport'
