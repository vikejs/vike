export { Component }

import type { ComponentPublicInstance } from 'vue'
type Component = ComponentPublicInstance // https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086

type Page = Component

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page
      data?: {
        // Needed by getPageTitle() and onBeforePrerenderStart()
        title?: string
      }
      config: {
        /** Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js) */
        title?: string
      }
      abortReason?: string
    }
  }
}
