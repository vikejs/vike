export { config }

import type { Config } from 'vike/types'
import { onHydrationEnd, onPageTransitionStart, onPageTransitionEnd } from './onPageTransitionHooks'

// https://vike.dev/config
const config = {
  clientRouting: true,
  prefetchStaticAssets: 'viewport',
  onHydrationEnd,
  onPageTransitionStart,
  onPageTransitionEnd,
  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: true, client: true }
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
