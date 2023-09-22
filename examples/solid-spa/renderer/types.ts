export type { PageContextServer }
export type { PageContextClient }
export type { PageContextCommon }
export type { PageProps }

import type {
  PageContextBuiltInServer,
  /*
  // When using Client Routing https://vike.dev/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
  /*/
  // When using Server Routing
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient
  //*/
} from 'vike/types'
import type { Component } from 'solid-js'

type Page = Component<PageProps>
type PageProps = {}

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
}

type PageContextServer = PageContextBuiltInServer<Page> & PageContextCustom
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom

type PageContextCommon = PageContextClient | PageContextServer
