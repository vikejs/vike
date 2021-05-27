export type PageProps = {}
export type VueComponent = any
export type PageContext = {
  Page: VueComponent
  pageProps?: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
  routeParams: Record<string, string>
}
