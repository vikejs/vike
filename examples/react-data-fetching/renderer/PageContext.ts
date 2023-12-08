export type { GlobalData }

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
  }
}

type Page = () => React.ReactElement

/**
 * `data()` hook return type common to all pages.
 *
 * See https://vike.dev/data
 */
type GlobalData = {
  title: string
}
