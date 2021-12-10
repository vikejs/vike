import { Component } from 'solid-js'
import type { GetPageContext } from 'vite-plugin-ssr'
export type PageProps = {}
export type PageContext = GetPageContext<{
  Page: (pageProps: PageProps) => Component
  pageProps: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
}>
