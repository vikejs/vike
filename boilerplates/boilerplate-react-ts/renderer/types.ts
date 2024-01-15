// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: () => React.ReactElement
      data?: {
        /** Value for <title> defined dynmically by by /pages/some-page/+data.js */
        title?: string
        /** Value for <meta name="description"> defined dynmically */
        description?: string
      }
      config: {
        /** Value for <title> defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js) */
        title?: string
        /** Value for <meta name="description"> defined statically */
        description?: string
      }
      /** https://vike.dev/render */
      abortReason?: string
    }
  }
}

// Tell TypeScript this file isn't an ambient module
export {}
