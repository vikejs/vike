import { assertUsage } from './server-routing-runtime/utils.js'
assertUsage(
  false,
  [
    'Following imports are forbidden on the client-side:',
    "  import { something } from 'vike/server'",
    // TODO/v1-release: remove this line (also remove s above in `s/Following imports/Following import/`)
    "  import { something } from 'vike'",
    'Did you mean the following instead?',
    "  import { something } from 'vike/client/router'"
  ].join('\n'),
  { showStackTrace: true }
)
