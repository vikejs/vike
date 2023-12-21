import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  // https://vike.dev/meta
  meta: {
    Page: {
      env: { server: true }
    }
  }
} satisfies Config
