import './assertEnvClient.js'

import { assertUsage } from '../utils/assert.js'
assertUsage(
  false,
  [
    'Server imports are forbidden on the client-side:',
    "  import { something } from 'vike/server'",
    'Did you mean the following instead?',
    "  import { something } from 'vike/client/router'",
  ].join('\n'),
  { showStackTrace: true },
)
