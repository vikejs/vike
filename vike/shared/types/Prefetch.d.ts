export type { PrefetchStaticAssets, PrefetchExpire, PrefetchPageContext }

type PrefetchStaticAssets = false | 'hover' | 'viewport'
type PrefetchExpire = number
type PrefetchPageContext = {
  when?: Exclude<PrefetchStaticAssets, 'viewport'>
  expire?: number
}
