import type { Config } from 'vite-plugin-ssr/types'

// https://vike.dev/config
export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps']
} satisfies Config
