import type { Config } from 'vite-plugin-ssr/types'

// https://vite-plugin-ssr.com/config
export default {
  passToClient: ['pageProps', 'routeParams'],
  // https://vite-plugin-ssr.com/meta
  meta: {
    // Create new config 'Layout'
    Layout: {
      env: 'server-and-client'
    }
  },
  clientRouting: true
} satisfies Config
