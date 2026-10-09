import { enhance, getUniversal, pipe, type UniversalHandler } from '@universal-middleware/core'
import { plusMiddlewareProxy } from './plusMiddlewares.js'
import { pageMethods } from './pagesHandler.js'
import '../assertEnvServer.js'

// What the released `@vikejs/*` adapters apply, as their only handler: +middleware, then Vike's pages.
// Only the methods of the pages: applied before the server's routes, it must not answer the others (a `DELETE` route of the server)
const universalVikeHandler = enhance(
  pipe(...plusMiddlewareProxy.map((middleware) => getUniversal(middleware))) as UniversalHandler,
  { name: 'vike', method: pageMethods, path: '/**', immutable: true },
)

export default universalVikeHandler
