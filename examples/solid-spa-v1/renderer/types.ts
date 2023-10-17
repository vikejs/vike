export type { PageProps }

import type { Component } from 'solid-js'

type Page = Component<PageProps>
type PageProps = {}

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      pageProps?: PageProps
    }
  }
}
