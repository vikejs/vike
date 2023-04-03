import { Component } from 'solid-js'
import type { PageContextBuiltIn, PageContextBuiltInClientWithClientRouting } from 'vite-plugin-ssr/types'

export type IPageContext = {
  pageProps: Record<string, unknown>
  documentProps?: {
    title?: string
    description?: string
  }

  exports: {
    Head?: Component
    Layout?: Component
    Wrapper?: Component
    // What-ever you want
  }
} & PageContextBuiltIn &
  PageContextBuiltInClientWithClientRouting
