import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  passToClient: ['pageProps'],
  // https://vike.dev/meta
  meta: {
    // Define new setting 'preloadStrategy'
    preloadStrategy: {
      env: { server: true },
    },
  },
} satisfies Config
