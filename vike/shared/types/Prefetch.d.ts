export type { PrefetchWhen, PrefetchExpire, PrefetchPageContext }

type PrefetchWhen = false | 'hover' | 'viewport'
type PrefetchExpire = number
type PrefetchPageContext = {
  when?: Exclude<PrefetchWhen, 'viewport'>
  expire?: number
}
