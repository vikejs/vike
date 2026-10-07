import type { Config } from 'vike/types'

export default {
  // Pre-rendering shouldn't execute +server.ts, see test-preview.test.ts
  prerender: true,
} satisfies Config
