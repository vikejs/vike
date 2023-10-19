export type PageProps = {}

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: (pageProps: PageProps) => React.ReactElement
      pageProps?: PageProps
      urqlState?: { [key: string]: any }
      pageHtml: string
      documentProps?: {
        title?: string
        description?: string
      }
    }
  }
}
