export * from './index-common.js'

import { isBrowser, assertUsage } from './utils.js'
assertUsage(
  !isBrowser(),
  "It's forbidden to `import { something } from 'vike/server'` in code loaded on the client-side: the module 'vike/server' is a server-only module.",
  { showStackTrace: true }
)
