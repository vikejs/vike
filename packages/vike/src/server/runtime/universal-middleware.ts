import { enhance, getUniversal, pipe, type UniversalHandler } from '@universal-middleware/core'
import { getUniversalMiddlewares } from './getUniversalMiddlewares.js'
import universalHandler from './universalHandler.js'
import '../assertEnvServer.js'

// What the released `@vikejs/*` adapters apply, as their only handler: +middleware, then Vike's pages
const universalVikeHandler = enhance(
  pipe(
    ...getUniversalMiddlewares().map((middleware) => getUniversal(middleware)),
    getUniversal(universalHandler),
  ) as UniversalHandler,
  { name: 'vike', method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'], path: '/**', immutable: true },
)

export default universalVikeHandler
