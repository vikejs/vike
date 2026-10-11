export { middlewaresProxy_middlewares }
export { middlewaresProxy_handlers }
export { applyMiddlewares }

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
import { getMiddlewares_withErrorHandling, renderPageServer_universal, scopeToPath, type Middleware } from './core.js'
import { getVikeConfigError } from '../../../shared-server-node/getVikeConfigError.js'
import '../../assertEnvServer.js'

// What `vike(app, middlewares)` applies before the app's routes: the +middleware and the user-land universal
// middlewares in one loop (looked up upon each request), then the user-land handlers, which the server routes as usual.
// The adapter passes the result to apply() as is, so it doesn't need to tell the handlers apart itself.
// `object[]`: the user-land universal middlewares can come from another copy of @universal-middleware/core, whose types
// (keyed by a `unique symbol`) never match this copy's.
function middlewaresProxy_middlewares(middlewaresUserLand_: object[]): [UniversalMiddleware, ...UniversalMiddleware[]] {
  const middlewaresUserLand = middlewaresUserLand_ as UniversalMiddleware[]
  const nonHandlersUserLand = middlewaresUserLand.filter((middleware) => !isHandler(middleware)).map(scopeToPath)
  const loop = enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const plusMiddlewares = await getMiddlewares_withErrorHandling()
      // An invalid config: Vike's pages show the error, instead of the app's routes running without the +middleware
      if (getVikeConfigError()) return renderPageServer_universal(request, context, runtime)
      return applyMiddlewares(plusMiddlewares, request, context, runtime, nonHandlersUserLand)
    },
    { name: 'vike:middleware' },
  )
  return [loop, ...middlewaresUserLand.filter(isHandler)]
}

// The +middleware that aren't handlers (Universal Middleware's pipe() can't pass the request on) and the user-land
// universal middlewares, by order, the +middleware first at equal order. The first Response answers: the +middleware
// after it don't run, and the user-land universal middlewares after it run for their response functions, a Response
// they return being ignored. The response functions apply to the final response, in their order.
async function applyMiddlewares(
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

// What `vike(app)` runs after the app's routes, looked up upon each request: the +middleware that are handlers, then Vike's pages
const middlewaresProxy_handlers = enhance(
  async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) =>
    // A method that no handler and no page answers (e.g. DELETE): what a server answers without a route for it
    (await getRouter(await getMiddlewares_withErrorHandling())(request, context, runtime)) ??
    new Response('Not Found', { status: 404 }),
  {
    name: 'vike',
    method: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'],
    path: '/**',
  },
)

// The list changes only when the config does
const routers = new WeakMap<Middleware[], UniversalHandler>()
function getRouter(list: Middleware[]): UniversalHandler {
  let router = routers.get(list)
  if (!router) {
    router = pipeRoute(list.filter((middleware) => middleware.isHandler)) as UniversalHandler
    routers.set(list, router)
  }
  return router
}
