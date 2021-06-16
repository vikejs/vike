export type Component = any
export type PageContext = {
  Page: Component
  pageProps: Record<string, unknown>
  pageExports: {
    documentProps?: {
      title: string
    }
  }
  documentProps?: {
    title: string
  }
  routeParams: Record<string, unknown>
}
