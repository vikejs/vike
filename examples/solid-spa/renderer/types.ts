export type { PageContextServer }
export type { PageContextClient }
export type { PageContextCommon }
export type { PageProps }

import type {
  PageContextBuiltIn,
  /*
  // When using Client Routing https://vite-plugin-ssr.com/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
  /*/
  // When using Server Routing
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient
  //*/
} from 'vite-plugin-ssr/types'
import type { Component } from 'solid-js'

type Page = Component<PageProps>
type PageProps = {}

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
}

type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom

type PageContextCommon = PageContextClient | PageContextServer
