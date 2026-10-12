export { middlewaresProxy_nonHandlers }
export { middlewaresProxy_handlers }
export { pipeNonHandlers }

import {
  enhance,
  getUniversal,
  getUniversalProp,
  isHandler,
  methodSymbol,
  nameSymbol,
  orderSymbol,
  pathSymbol,
  pipeRoute,
  runsSymbol,
  type EnhancedMiddleware,
  type RuntimeAdapterTarget,
  type UniversalHandler,
  type UniversalMiddleware,
} from '@universal-middleware/core'
import { getMiddlewares_withErrorHandling, type Middleware } from './core.js'
import '../../assertEnvServer.js'

// What `vike(app, middlewares)` applies before the app's routes: the +middleware and the user-land universal
// middlewares that aren't handlers, as one middleware (looked up upon each request).
// `object[]`: the user-land universal middlewares can come from another copy of @universal-middleware/core, whose types
// (keyed by a `unique symbol`) never match this copy's.
function middlewaresProxy_nonHandlers(middlewaresUserLand: object[]): UniversalMiddleware {
  const nonHandlersUserLand = (middlewaresUserLand as UniversalMiddleware[]).filter(
    (middleware) => !isHandler(middleware),
  )
  return enhance(
    proxy((plusMiddlewares) => pipeNonHandlers(plusMiddlewares, nonHandlersUserLand)),
    { name: 'vike:middleware' },
  )
}

// The +middleware that aren't handlers and the user-land universal middlewares, by order, the +middleware first at
// equal order, each on its path. The first Response answers: the +middleware after it don't run, and the user-land
// universal middlewares after it run for their response functions, a Response they return being ignored. The response
// functions apply to the final response, in their order.
function pipeNonHandlers(plusMiddlewares: Middleware[], middlewaresUserLand: UniversalMiddleware[]) {
  const nonHandlers = [
    ...plusMiddlewares.filter((middleware) => !middleware.isHandler),
    ...middlewaresUserLand.map((middleware) => enhance(middleware, { runs: 'always' })),
  ]
  return pipeRoute(nonHandlers.map(mergeContext)) as UniversalMiddleware
}

// Universal Middleware replaces the context with the one a middleware returns: Vike merges it, as a +middleware returns
// only what it adds
function mergeContext(middleware: EnhancedMiddleware): UniversalMiddleware {
  const order = getUniversalProp(middleware, orderSymbol)
  return enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const result = await getUniversal(middleware as UniversalMiddleware)(request, context, runtime)
      if (!result || result instanceof Response || typeof result === 'function') return result
      Object.assign(context, result)
    },
    {
      name: getUniversalProp(middleware, nameSymbol),
      path: getUniversalProp(middleware, pathSymbol),
      method: getUniversalProp(middleware, methodSymbol),
      runs: getUniversalProp(middleware, runsSymbol),
      ...(order !== undefined && { order }),
    },
  )
}

// What `vike(app, middlewares)` runs after the app's routes, looked up upon each request: the user-land universal
// middlewares that are handlers (the first one registered on a path answers), the +middleware that are handlers, then
// Vike's pages
function middlewaresProxy_handlers(middlewaresUserLand: object[]): UniversalHandler {
  const handlersUserLand = (middlewaresUserLand as UniversalMiddleware[]).filter(isHandler)
  const router = proxy((plusMiddlewares) =>
    pipeRoute([...handlersUserLand, ...plusMiddlewares.filter((middleware) => middleware.isHandler)]),
  )
  return enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) =>
      // A method that no handler and no page answers (e.g. DELETE): what a server answers without a route for it
      (await router(request, context, runtime)) ?? new Response('Not Found', { status: 404 }),
    {
      name: 'vike',
      method: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'],
      path: '/**',
    },
  ) as UniversalHandler
}

// Runs what `build()` makes of the list `getMiddlewares_withErrorHandling()` returns upon each request. The list changes
// only when the config does, so `build()` runs once per list.
function proxy(build: (plusMiddlewares: Middleware[]) => UniversalMiddleware): UniversalMiddleware {
  const built = new WeakMap<Middleware[], UniversalMiddleware>()
  return async (request, context, runtime) => {
    const plusMiddlewares = await getMiddlewares_withErrorHandling()
    let middleware = built.get(plusMiddlewares)
    if (!middleware) built.set(plusMiddlewares, (middleware = build(plusMiddlewares)))
    return middleware(request, context, runtime)
  }
}
