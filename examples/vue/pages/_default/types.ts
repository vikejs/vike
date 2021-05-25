export type Component = any
export type PageContext = {
  pageProps: Record<string, unknown>
  documentProps: {
    title: string
  }
  routeParams: Record<string, unknown>
} & Record<string, any>
