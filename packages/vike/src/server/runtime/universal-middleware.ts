import { enhance, pipeRoute, type RuntimeAdapterTarget, type UniversalHandler } from '@universal-middleware/core'
import { getAppMiddlewares, type Middleware } from './middlewares.js'
import '../assertEnvServer.js'

// Vike's own server: `vike/fetch`, `vike(app)`, and `$ vike dev` and `$ vike preview` when the app has +middleware. It applies `globalContext.middlewares` in one router.
async function universalVikeHandler(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<unknown>,
) {
  return getRouter(await getAppMiddlewares())(request, context, runtime)
}

// The list changes only when the config does
const routers = new WeakMap<Middleware[], UniversalHandler>()
function getRouter(middlewares: Middleware[]): UniversalHandler {
  let handler = routers.get(middlewares)
  if (!handler) {
    handler = pipeRoute(middlewares) as UniversalHandler
    routers.set(middlewares, handler)
  }
  return handler
}

const universalVikeHandlerEnhanced = enhance(universalVikeHandler, {
  name: 'vike',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  path: '/**',
  immutable: true,
})

export default universalVikeHandlerEnhanced
