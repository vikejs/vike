import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  // https://vike.dev/meta
  meta: {
    // Create new config 'title'
    title: {
      env: { server: true, client: true }
    }
  }
} satisfies Config
