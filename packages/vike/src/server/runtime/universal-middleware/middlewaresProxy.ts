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
  // The list changes only when the config does
  const pipes = new WeakMap<Middleware[], UniversalMiddleware>()
  return enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const list = await getMiddlewares_withErrorHandling()
      let piped = pipes.get(list)
      if (!piped) {
        piped = pipeNonHandlers(list, nonHandlersUserLand)
        pipes.set(list, piped)
      }
      return piped(request, context, runtime)
    },
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
  // The list changes only when the config does
  const routers = new WeakMap<Middleware[], UniversalHandler>()
  return enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const list = await getMiddlewares_withErrorHandling()
      let router = routers.get(list)
      if (!router) {
        router = pipeRoute([
          ...handlersUserLand,
          ...list.filter((middleware) => middleware.isHandler),
        ]) as UniversalHandler
        routers.set(list, router)
      }
      // A method that no handler and no page answers (e.g. DELETE): what a server answers without a route for it
      return (await router(request, context, runtime)) ?? new Response('Not Found', { status: 404 })
    },
    {
      name: 'vike',
      method: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'],
      path: '/**',
    },
  )
}
