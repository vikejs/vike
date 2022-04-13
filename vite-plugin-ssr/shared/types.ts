import type { PageContextUrls } from './addComputedUrlProps'

export type PageContextBuiltIn = {
  Page: any
  routeParams: Record<string, string>
  exports: Record<string, unknown>
  url: string
  /** @deprecated */
  pageExports: Record<string, unknown>
} & PageContextUrls
