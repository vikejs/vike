export default vikeUniversalMiddleware

// TO-DO/next-major-release: remove this export (the entire file)

import { vikeUniversalMiddleware } from './vikeUniversalMiddleware.js'
import { assertWarning } from '../../../utils/assert.js'
import '../../assertEnvServer.js'

assertWarning(
  false,
  [
    "You're using a deprecated Vike extension:",
    '- If you use one of the following, update to its latest version: @vikejs/hono, @vikejs/express, @vikejs/fastify, @vikejs/h3, or @vikejs/elysia',
    '- If you use vike-photon or vike-server, migrate to +server.js — see https://vike.dev/migration/server',
  ].join('\n'),
  { onlyOnce: true },
)
