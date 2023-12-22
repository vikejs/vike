export type { PageProps }

import type fetch from 'node-fetch'

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = Record<string, unknown>

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      pageProps?: PageProps
    }
  }
}
