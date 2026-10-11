export { middlewaresProxy_middlewares }
export { middlewaresProxy_handlers }
export { applyMiddlewares }

import {
  cancelReplacedBody,
  enhance,
  getUniversal,
  getUniversalProp,
  isHandler,
  methodSymbol,
  nameSymbol,
  orderSymbol,
  pathSymbol,
  pipeRoute,
  type RuntimeAdapterTarget,
  type UniversalHandler,
  type UniversalMiddleware,
} from '@universal-middleware/core'
import { getMiddlewares_internal, getMatcher, renderPageServerUniversal, type Middleware } from './middlewares.js'
import { getVikeConfigError } from '../../shared-server-node/getVikeConfigError.js'
import '../assertEnvServer.js'

// What `vike(app, middlewares)` applies before the app's routes: the +middleware and the app's middlewares in one loop
// (looked up upon each request), then the app's handlers, which the server routes as usual. The adapter passes the
// result to apply() as is, so it doesn't need to tell the handlers apart itself.
// `object[]`: the adapter's middlewares can come from another copy of @universal-middleware/core, whose types (keyed
// by a `unique symbol`) never match this copy's.
function middlewaresProxy_middlewares(middlewares_: object[] = []): [UniversalMiddleware, ...UniversalMiddleware[]] {
  const middlewares = middlewares_ as UniversalMiddleware[]
  const appMiddlewares = middlewares.filter((middleware) => !isHandler(middleware)).map(scopeToPath)
  const loop = enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const plusMiddlewares = await getMiddlewares_internal()
      // An invalid config: Vike's pages show the error, instead of the app's routes running without the +middleware
      if (getVikeConfigError()) return renderPageServerUniversal(request, context, runtime)
      return applyMiddlewares(plusMiddlewares, request, context, runtime, appMiddlewares)
    },
    { name: 'vike:middleware' },
  )
  return [loop, ...middlewares.filter(isHandler)]
}

// An app middleware with a `path` runs only on it, as apply() would scope it
function scopeToPath(middleware: UniversalMiddleware): UniversalMiddleware {
  const path = getUniversalProp(middleware, pathSymbol)
  if (!path) return middleware
  const isMatch = getMatcher(path, getUniversalProp(middleware, methodSymbol))
  return enhance(
    (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) =>
      isMatch(request) ? getUniversal(middleware)(request, context, runtime) : undefined,
    { name: getUniversalProp(middleware, nameSymbol), order: getUniversalProp(middleware, orderSymbol) },
  )
}

// The +middleware that aren't handlers (Universal Middleware's pipe() can't pass the request on) and the app's
// middlewares, by order, the +middleware first at equal order. The first Response answers: the +middleware after it
// don't run, and the app's middlewares after it run for their response functions, a Response they return being
// ignored. The response functions apply to the final response, in their order.
async function applyMiddlewares(
  plusMiddlewares: Middleware[],
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<unknown>,
  appMiddlewares: UniversalMiddleware[] = [],
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
  const nonHandlers = [...plusMiddlewares.filter((middleware) => !middleware.isHandler), ...appMiddlewares].sort(
    (a, b) => getUniversalProp(a, orderSymbol, 0) - getUniversalProp(b, orderSymbol, 0),
  )
  const isAppMiddleware = new Set<unknown>(appMiddlewares)
  let answer: Response | undefined
  for (const middleware of nonHandlers) {
    if (answer && !isAppMiddleware.has(middleware)) continue
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
    (await getRouter(await getMiddlewares_internal())(request, context, runtime)) ??
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
