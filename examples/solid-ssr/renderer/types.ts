import { Component } from 'solid-js'
import type { PageContextBuiltInServer } from 'vite-plugin-ssr/types'
export type PageProps = {}
type Page = Component<PageProps>
export type PageContext = PageContextBuiltInServer<Page> & {
  pageProps: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
}
