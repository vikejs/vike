import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'
export type Component = any
export type PageContext = PageContextBuiltIn & {
  Page: Component
  pageProps: Record<string, unknown>
  pageExports: {
    documentProps?: {
      title: string
    }
  }
  documentProps?: {
    title: string
  }
}
