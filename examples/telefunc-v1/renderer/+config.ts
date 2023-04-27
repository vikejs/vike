import type { Config } from 'vite-plugin-ssr/types'

// https://vite-plugin-ssr.com/config
export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps']
} satisfies Config
