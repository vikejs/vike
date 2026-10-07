import { getAdapterRuntime, getUniversal, pipe, type UniversalHandler } from '@universal-middleware/core'
import { getUniversalMiddlewares } from './getUniversalMiddlewares.js'
import universalHandler from './universal-middleware.js'
import '../assertEnvServer.js'

// Vike is the whole server: +middleware, then Vike's pages
const handler = pipe(
  ...getUniversalMiddlewares().map((middleware) => getUniversal(middleware)),
  getUniversal(universalHandler),
) as UniversalHandler

export default {
  fetch: (request: Request) => handler(request, {}, getAdapterRuntime('other', { params: undefined })),
}
