export * from './index-common.mjs'

import { isBrowser, assertUsage } from './utils.mjs'
assertUsage(
  !isBrowser(),
  "It's forbidden to `import { something } from 'vite-plugin-ssr/server'` in code loaded in the browser: the module 'vite-plugin-ssr/server' is a server-only module.",
  { showStackTrace: true }
)
