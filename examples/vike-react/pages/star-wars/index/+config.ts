import type { Config } from 'vike/types'

// Default configs (can be overriden by pages)
export default {
  // @ts-ignore
  mything: true,
  meta: {
    mything: { env: { client: true } }
  }
} satisfies Config
