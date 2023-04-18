import type { Config } from 'vite-plugin-ssr/types'

export default {
  // https://vite-plugin-ssr.com/meta
  meta: {
    Page: {
      // Our pages are rendered as SPA, we therefore load our Page component only on the client-side
      env: 'client-only'
    }
  }
} satisfies Config
