export { middlewaresProxy_nonHandlers }
export { middlewaresProxy_handlers }
export { applyNonHandlers }

import {
  cancelReplacedBody,
  enhance,
  getUniversal,
  getUniversalProp,
  isHandler,
  orderSymbol,
  pipeRoute,
  type RuntimeAdapterTarget,
  type UniversalHandler,
  type UniversalMiddleware,
} from '@universal-middleware/core'
import { getMiddlewares_withErrorHandling, scopeToPath, type Middleware } from './core.js'
import '../../assertEnvServer.js'

// What `vike(app, middlewares)` applies before the app's routes: the +middleware and the user-land universal
// middlewares that aren't handlers, in one loop (looked up upon each request).
// `object[]`: the user-land universal middlewares can come from another copy of @universal-middleware/core, whose types
// (keyed by a `unique symbol`) never match this copy's.
function middlewaresProxy_nonHandlers(middlewaresUserLand: object[]): UniversalMiddleware {
  const nonHandlersUserLand = (middlewaresUserLand as UniversalMiddleware[])
    .filter((middleware) => !isHandler(middleware))
    .map(scopeToPath)
  return enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) =>
      applyNonHandlers(await getMiddlewares_withErrorHandling(), request, context, runtime, nonHandlersUserLand),
    { name: 'vike:middleware' },
  )
}

// The +middleware that aren't handlers (Universal Middleware's pipe() can't pass the request on) and the user-land
// universal middlewares, by order, the +middleware first at equal order. The first Response answers: the +middleware
// after it don't run, and the user-land universal middlewares after it run for their response functions, a Response
// they return being ignored. The response functions apply to the final response, in their order.
async function applyNonHandlers(
  plusMiddlewares: Middleware[],
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<unknown>,
  middlewaresUserLand: UniversalMiddleware[],
) {
  const responseFunctions: ((response: Response) => Response | undefined | Promise<Response | undefined>)[] = []
  const applyResponseFunctions = async (response: Response) => {
    for (const responseFunction of responseFunctions) {
      const replacement = await responseFunction(response)
      if (replacement) {
        cancelReplacedBody(response, replacement)
        response = replacement
      }
    }
    return response
  }
  const nonHandlers = [...plusMiddlewares.filter((middleware) => !middleware.isHandler), ...middlewaresUserLand].sort(
    (a, b) => getUniversalProp(a, orderSymbol, 0) - getUniversalProp(b, orderSymbol, 0),
  )
  const isMiddlewareUserLand = new Set<unknown>(middlewaresUserLand)
  let answer: Response | undefined
  for (const middleware of nonHandlers) {
    if (answer && !isMiddlewareUserLand.has(middleware)) continue
    const result = await getUniversal(middleware)(request, context, runtime)
    if (result instanceof Response) {
      if (answer) cancelReplacedBody(result, answer)
      else answer = result
    } else if (typeof result === 'function') responseFunctions.push(result)
    else if (result) Object.assign(context, result)
  }
  if (answer) return applyResponseFunctions(answer)
  if (responseFunctions.length > 0) return applyResponseFunctions
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
