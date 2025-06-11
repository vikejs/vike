export { config }

import type { Config } from 'vike/types'

// https://vike.dev/config
const config = {
  prerender: true,
  clientRouting: true,
  prefetchStaticAssets: 'viewport',
  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: true, client: true },
    },
  },
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
