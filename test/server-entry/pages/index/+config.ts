import type { Config } from 'vike/types'

export default {
  // Pre-rendering shouldn't execute +serverEntry.ts, see test-preview.test.ts
  prerender: true,
} satisfies Config
