export type PageProps = {}
// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
  urqlState: { [key: string]: any }
  pageHtml: string
  Page: (pageProps: PageProps) => React.ReactElement
  pageProps: PageProps
  urlPathname: string
  documentProps?: {
    title?: string
    description?: string
  }
}
