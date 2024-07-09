import type { Config } from 'vike/types'

export default {
  meta: {
    Head: {
      env: { server: true },
      cumulative: true
    },
    /*
    For supporting nested configs, is the following the only thing missing?
    ```diff
    // /pages/some-page/+config.js

      export {
    -   ['document.title']: 'Some Title'
    +   document: {
    +     title: 'Some Title'
    +   }
      }
    ```

    Work-in-progress: https://github.com/vikejs/vike/tree/brillout/feat/nested-configs
    */
    ['document.title']: {
      env: { server: true, client: true }
    }
  },
  prefetch: {
    pageContext: false
  }
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      ['document.title']?: string
      frontmatter?: {
        title: string
      }
      Head?: () => JSX.Element
    }
    interface ConfigResolved {
      Head: (() => JSX.Element)[]
    }
    interface PageContext {
      Page?: any
      pageProps?: Record<string, unknown>
    }
  }
}
