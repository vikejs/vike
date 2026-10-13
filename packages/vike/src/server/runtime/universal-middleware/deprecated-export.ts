import { vikeUniversalMiddleware } from './vikeUniversalMiddleware.js'
import { assertWarning } from '../../../utils/assert.js'
import '../../assertEnvServer.js'

// TO-DO/next-major-release: remove this export
assertWarning(
  false,
  [
    "You're using a deprecated Vike extension:",
    '- If you use one of the following, update to its latest version: @vikejs/hono, @vikejs/express, @vikejs/fastify, @vikejs/h3, @vikejs/elysia, @vikejs/hattip or @vikejs/srvx',
    '- If you use vike-photon or vike-server, migrate to +server.js — see https://vike.dev/migration/server',
  ].join('\n'),
  { onlyOnce: true },
)

export default vikeUniversalMiddleware
