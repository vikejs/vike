export type { PageContextServer }
export type { PageContextClient }
export type { PageContext }
export type { PageProps }

import type {
  PageContextBuiltInServer,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient,
} from 'vike/types'
import React from 'react'

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = Record<string, unknown>

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
  config: {
    title?: string
  }
  title?: string
  abortReason?: string
}

type PageContextServer = PageContextBuiltInServer<Page> & PageContextCustom
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom

type PageContext = PageContextClient | PageContextServer
