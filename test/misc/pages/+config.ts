import type { Config } from 'vike/types'

export default {
  meta: {
    ['document.title']: {
      env: { server: true, client: true }
    },
    ['document.description']: {
      env: { server: true }
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
    }
    interface PageContext {
      Page?: any
      pageProps?: Record<string, unknown>
    }
  }
}
