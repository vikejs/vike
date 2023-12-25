export type Component = any
// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
  Page: Component
  pageProps: Record<string, unknown>
  exports: {
    documentProps?: {
      title: string
    }
  }
  documentProps?: {
    title: string
  }
}
