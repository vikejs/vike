import type { Config } from 'vike/types'

export default {
  meta: {
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
    */
    ['document.title']: {
      env: { server: true, client: true }
    },
    Head: {
      env: { server: true },
      cumulative: true
    }
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
