import { Component } from 'solid-js'
import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'
export type PageProps = {}
type Page = Component<PageProps>
export type PageContext = PageContextBuiltIn<Page> & {
  pageProps: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
}
