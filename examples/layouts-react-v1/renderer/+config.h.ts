import type { Config } from 'vite-plugin-ssr/types'

// https://vike.dev/config
export default {
  passToClient: ['pageProps', 'routeParams'],
  // https://vike.dev/meta
  meta: {
    // Create new config 'Layout'
    Layout: {
      env: 'server-and-client'
    }
  },
  clientRouting: true,
  hydrationCanBeAborted: true
} satisfies Config
