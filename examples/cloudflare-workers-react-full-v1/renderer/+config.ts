import type { Config } from 'vite-plugin-ssr/types'

// https://vite-plugin-ssr.com/config
export default {
  passToClient: ['pageProps']
} satisfies Config
