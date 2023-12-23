// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      data?: Data
      config: {
        /** Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js) */
        title?: string
      }
      abortReason?: string
      someAsyncProps?: number
    }
  }
}

type Page = (data: Data) => React.ReactElement
type Data = Record<string, unknown> & { title?: string }

// Tell TypeScript that this file isn't an ambient module
export {}
