export type PageProps = {}
export type PageContext = {
  pageProps?: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
  routeParams: Record<string, string>
}
export type VueComponent = any
