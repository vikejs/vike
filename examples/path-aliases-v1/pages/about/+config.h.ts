import type { Config } from 'vite-plugin-ssr/types'

// https://vike.dev/config
export default {
  // https://vike.dev/meta
  meta: {
    Page: {
      env: 'server-only'
    }
  }
} satisfies Config
