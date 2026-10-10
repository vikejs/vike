import universalVikeHandler from './universalVikeHandler.js'
import { assertWarning } from '../../utils/assert.js'
import '../assertEnvServer.js'

// Vike's own server imports universalVikeHandler.js directly: only the released @vikejs/* adapters, vike-photon and vike-server import this entry
assertWarning(
  false,
  'vike/universal-middleware is deprecated: update @vikejs/express, @vikejs/hono, @vikejs/fastify, @vikejs/h3, @vikejs/elysia, @vikejs/hattip or @vikejs/srvx to 0.4.0 or above, and move from vike-photon or vike-server to +server or one of these adapters, see https://vike.dev/server',
  { onlyOnce: true },
)

export default universalVikeHandler
