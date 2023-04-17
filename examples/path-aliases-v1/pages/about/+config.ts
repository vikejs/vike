import type { Config } from 'vite-plugin-ssr/types'

export default {
  meta: {
    Page: {
      env: 'server-only'
    }
  }
} satisfies Config
