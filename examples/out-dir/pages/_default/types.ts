import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'
export type PageProps = {}
export type PageContext = PageContextBuiltIn & {
  Page: any
  pageProps?: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
}
