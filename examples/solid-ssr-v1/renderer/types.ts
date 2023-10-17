import { Component } from 'solid-js'
export type PageProps = {}
type Page = Component<PageProps>

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      pageProps?: PageProps
      documentProps?: {
        title?: string
        description?: string
      }
    }
  }
}
