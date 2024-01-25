import type { Config } from 'vike/types'

// https://vike.dev/config
export const config = {
  passToClient: ['someAsyncProps'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: true, client: true }
    },
    data: {
      env: { server: true, client: false }
    }
  },
  hooksTimeout: {
    data: {
      error: 30 * 1000,
      warning: 10 * 1000
    }
  }
} satisfies Config

// https://vike.dev/meta#typescript
declare global {
  namespace Vike {
    interface Config {
      /** The page's `<title>` */
      title?: string
    }
  }
}
