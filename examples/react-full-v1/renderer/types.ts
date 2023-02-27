export type { PageContextServer }
export type { PageContextClient }
export type { PageContext }
export type { PageProps }

import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router' // When using Client Routing
// import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client' // When using Server Routing

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = Record<string, unknown>

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
  exports: {
    documentProps?: {
      title: string
    }
  }
  documentProps?: {
    title: string
  }
}

type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom

type PageContext = PageContextClient | PageContextServer
