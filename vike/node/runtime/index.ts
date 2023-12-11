import { isBrowser } from '../../utils/isBrowser.js'
import { assertUsage } from '../../utils/assert.js'
assertUsage(
  !isBrowser(),
  "It's forbidden to `import { something } from 'vike/server'` on the client-side: the module 'vike/server' is a server-only module.",
  { showStackTrace: true }
)

export * from './index-common.js'
