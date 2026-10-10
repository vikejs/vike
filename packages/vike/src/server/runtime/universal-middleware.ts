import {
  apply,
  enhance,
  UniversalRouter,
  universalSymbol,
  type RuntimeAdapterTarget,
  type UniversalHandler,
} from '@universal-middleware/core'
import { getAppMiddlewares, type Middleware } from './middlewares.js'
import '../assertEnvServer.js'

// Vike as the whole server (`vike/fetch`, and `$ vike dev` and `$ vike preview` without +server.js): it applies `globalContext.middlewares` like any other server
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
    const router = new UniversalRouter(true, false)
    apply(router, middlewares)
    handler = router[universalSymbol] as UniversalHandler
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
