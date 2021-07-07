import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'
export type PageProps = {}
export type VueComponent = any
export type PageContext = PageContextBuiltIn & {
  Page: VueComponent
  pageProps?: PageProps
  documentProps?: {
    title?: string
    description?: string
  }
  routeParams: Record<string, string>
}
