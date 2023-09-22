import type { Config } from 'vite-plugin-ssr/types'

// https://vike.dev/config
export default {
  passToClient: ['pageProps'],
  // https://vike.dev/meta
  meta: {
    // Create new config 'preloadStrategy'
    preloadStrategy: {
      env: 'server-only'
    }
  }
} satisfies Config
