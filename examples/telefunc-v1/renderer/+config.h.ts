import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps']
} satisfies Config
