// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      pageProps?: PageProps
      config: {
        /** Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js) */
        title?: string
      }
      /** Title defined dynamically by onBeforeRender() */
      title?: string
      abortReason?: string
      someAsyncProps?: number
    }
  }
}

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = Record<string, unknown>

// Tell TypeScript that this file isn't an ambient module
export {}
