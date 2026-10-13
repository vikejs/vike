export { middlewaresPipe_nonHandlers }
export { middlewaresPipe_handlers }
export { pipeNonHandlers }

import {
  enhance,
  isHandler,
  pipeRoute,
  type RuntimeAdapterTarget,
  type UniversalHandler,
  type UniversalMiddleware,
} from '@universal-middleware/core'
import { getMiddlewares_withErrorHandling, mergeContext, type Middleware } from './core.js'
import '../../assertEnvServer.js'

/**
 * What `vike(app, middlewares)` runs after the app's routes, looked up upon each request: the user-land universal middlewares that are handlers (the first one registered on a path answers), the +middleware that are handlers, then Vike's handler that renders pages.
 */
function middlewaresPipe_handlers(
  // `object[]`: the user-land universal middlewares can come from another copy of @universal-middleware/core, whose types (keyed by a `unique symbol`) never match this copy's
  middlewaresUserLand: object[],
): UniversalHandler {
  const handlersUserLand = (middlewaresUserLand as UniversalMiddleware[]).filter(isHandler)
  const router = pipe((middlewares) =>
    pipeRoute([...handlersUserLand, ...middlewares.filter((middleware) => middleware.isHandler)]),
  )
  return enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) =>
      // A method that no handler and no page answers (e.g. DELETE): what a server answers without a route for it
      (await router(request, context, runtime)) ?? new Response('Not Found', { status: 404 }),
    {
      name: 'vike:handlers',
      method: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'],
      path: '/**',
    },
  ) as UniversalHandler
}

/**
 * What `vike(app, middlewares)` applies before the app's routes: the +middleware and the user-land universal middlewares that aren't handlers, as one middleware (looked up upon each request).
 */
function middlewaresPipe_nonHandlers(
  // `object[]`: the user-land universal middlewares can come from another copy of @universal-middleware/core, whose types (keyed by a `unique symbol`) never match this copy's
  middlewaresUserLand: object[],
): UniversalMiddleware {
  const nonHandlersUserLand = (middlewaresUserLand as UniversalMiddleware[]).filter(
    (middleware) => !isHandler(middleware),
  )
  return enhance(
    pipe((middlewares) => pipeNonHandlers(middlewares, nonHandlersUserLand)),
    { name: 'vike:nonHandlers' },
  )
}

function pipeNonHandlers(middlewares: Middleware[], nonHandlersUserLand: UniversalMiddleware[]): UniversalMiddleware {
  const nonHandlers = [
    ...middlewares.filter((middleware) => !middleware.isHandler),
    ...nonHandlersUserLand.map((middleware) => mergeContext(enhance(middleware, { runs: 'always' }))),
  ]
  return pipeRoute(nonHandlers)
}

function pipe(getPipe: (middlewares: Middleware[]) => UniversalMiddleware): UniversalMiddleware {
  // The list changes only when the config does, so `getPipe()` runs once per list
  const cache = new WeakMap<Middleware[], UniversalMiddleware>()
  return async (request, context, runtime) => {
    const middlewares = await getMiddlewares_withErrorHandling()
    let ret = cache.get(middlewares)
    if (!ret) cache.set(middlewares, (ret = getPipe(middlewares)))
    return ret(request, context, runtime)
  }
}
