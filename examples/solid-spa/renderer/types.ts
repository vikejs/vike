export type { PageContextServer }
export type { PageContextClient }
export type { PageContextCommon }
export type { PageProps }

import type { PageContextBuiltIn } from 'vite-plugin-ssr'
// import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router' // When using Client Routing
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client' // When using Server Routing
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
