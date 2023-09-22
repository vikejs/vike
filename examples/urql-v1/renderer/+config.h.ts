import type { Config } from 'vite-plugin-ssr/types'

// https://vike.dev/config
export default {
  passToClient: ['pageProps', 'urlPathname', 'urqlState']
} satisfies Config
