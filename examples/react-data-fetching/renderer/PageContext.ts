// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      config: {
        /** Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js) */
        title?: string
      }
    }

    interface Data {
      /** Title defined dynamically by the `data()` hook */
      title?: string
    }
  }
}

type Page = (data: Vike.Data) => React.ReactElement

// Tell TypeScript that this file isn't an ambient module
export {}
