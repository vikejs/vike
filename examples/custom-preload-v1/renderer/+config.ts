import type { Config } from 'vite-plugin-ssr/types'

export default {
  passToClient: ['pageProps'],
  meta: {
    preloadStrategy: {
      env: 'server-only'
    }
  }
} satisfies Config
