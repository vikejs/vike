export type Component = any
export type PageContext = {
  pageProps: Record<string, unknown>
  docTitle?: string
  routeParams: Record<string, unknown>
} & Record<string, any>
