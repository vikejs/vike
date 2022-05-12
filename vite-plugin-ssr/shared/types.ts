import type { PageContextUrls } from './addComputedUrlProps'

export type PageContextBuiltIn = {
  Page: any
  routeParams: Record<string, string>
  exports: Record<string, unknown>
  url: string
  // Outdated
  pageExports: Record<string, unknown>
} & PageContextUrls
