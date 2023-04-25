import type { Config } from 'vite-plugin-ssr/types'
import { onHydrationEnd, onPageTransitionStart, onPageTransitionEnd } from './onPageTransitionHooks'

export default {
  passToClient: ['pageProps', 'title'],
  clientRouting: true,
  prefetchStaticAssets: { when: 'VIEWPORT' },
  onHydrationEnd,
  onPageTransitionStart,
  onPageTransitionEnd,
  // We create a custom config, see https://vite-plugin-ssr.com/meta
  meta: {
    title: {
      env: 'server-and-client'
    }
  }
} satisfies Config
