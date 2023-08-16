import { assertUsage } from './server-routing-runtime/utils.js'
assertUsage(
  false,
  [
    'Following imports are forbidden on the client-side:',
    "  import { something } from 'vite-plugin-ssr/server'",
    // TODO/v1-release: remove this line (also remove s above in `s/Following imports/Following import/`)
    "  import { something } from 'vite-plugin-ssr'",
    'Did you mean the following instead?',
    "  import { something } from 'vite-plugin-ssr/client/router'"
  ].join('\n'),
  { showStackTrace: true }
)
