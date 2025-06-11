import type { Config } from 'vike/types'

// TEST: isn't pointer import
import prerender from './prerender'
if (!(globalThis as any).setAtBuildTime)
  throw new Error(
    'The prerender.ts file should be executed at build-time but it seems to be running at runtime instead.',
  )

// TEST: is a pointer import
import Page from './Page'

export default {
  Page,
  prerender,
} satisfies Config
