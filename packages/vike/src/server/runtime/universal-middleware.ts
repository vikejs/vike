import { enhance, getUniversal, pipe, type UniversalHandler } from '@universal-middleware/core'
import { plusMiddlewareProxy } from './getUniversalMiddlewares.js'
import universalHandler, { pageMethods } from './universalHandler.js'
import '../assertEnvServer.js'

// What the released `@vikejs/*` adapters apply, as their only handler: +middleware, then Vike's pages.
// Only the methods of the pages: applied before the server's routes, it must not answer the others (a `DELETE` route of the server)
const universalVikeHandler = enhance(
  pipe(getUniversal(plusMiddlewareProxy), getUniversal(universalHandler)) as UniversalHandler,
  { name: 'vike', method: pageMethods, path: '/**', immutable: true },
)

export default universalVikeHandler
