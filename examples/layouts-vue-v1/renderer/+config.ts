import type { Config } from 'vite-plugin-ssr/types'

export default {
  passToClient: ['pageProps', 'routeParams'],
  meta: {
    Layout: {
      env: 'server-and-client'
    }
  },
  clientRouting: true
} satisfies Config
