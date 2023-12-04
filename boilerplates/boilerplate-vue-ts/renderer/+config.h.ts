import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  /* To enable Client-side Routing:
  clientRouting: true,
  // !! WARNING !! Before doing so, read https://vike.dev/clientRouting */

  // See https://vike.dev/data-fetching
  passToClient: ['pageProps', 'urlPathname']
} satisfies Config
