import type { Config } from 'vike/types'

export default {
  // https://vike.dev/vercel#isr
  vercel: { isr: { expiration: 15 } },
} satisfies Config
