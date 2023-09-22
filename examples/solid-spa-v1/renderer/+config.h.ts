import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  // https://vike.dev/meta
  meta: {
    Page: {
      // Our pages are rendered as SPA, we therefore load our Page component only on the client-side
      env: 'client-only'
    }
  }
} satisfies Config
