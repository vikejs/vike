import type { Config } from 'vite-plugin-ssr/types'

export default {
  passToClient: ['pageProps', 'urlPathname', 'urqlState']
} satisfies Config
