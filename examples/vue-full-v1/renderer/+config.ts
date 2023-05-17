import type { Config } from 'vite-plugin-ssr/types'
import { onHydrationEnd, onPageTransitionStart, onPageTransitionEnd } from './onPageTransitionHooks'

// https://vite-plugin-ssr.com/config
export default {
  passToClient: ['pageProps', 'title'],
  clientRouting: true,
  prefetchStaticAssets: 'viewport',
  onHydrationEnd,
  onPageTransitionStart,
  onPageTransitionEnd,
  // https://vite-plugin-ssr.com/meta
  meta: {
    // Create new config 'title'
    title: {
      env: 'server-and-client'
    }
  }
} satisfies Config
