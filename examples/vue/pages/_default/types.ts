export type Component = any
export type PageContext = {
  Page: Component
  pageProps: Record<string, unknown>
  documentProps: {
    title: string
  }
  routeParams: Record<string, unknown>
} & Record<string, any>
