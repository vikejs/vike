export { middlewaresProxy_middlewares }
export { middlewaresProxy_handlers }
export { applyMiddlewares }

import {
  cancelReplacedBody,
  enhance,
  getUniversal,
  getUniversalProp,
  orderSymbol,
  pipeRoute,
  type RuntimeAdapterTarget,
  type UniversalHandler,
} from '@universal-middleware/core'
import { getAppMiddlewares, renderPageUniversal, type Middleware } from './middlewares.js'
import { getVikeConfigError } from '../../shared-server-node/getVikeConfigError.js'
import '../assertEnvServer.js'

// What `vike(app)` runs before the app's routes, looked up upon each request
const middlewaresProxy_middlewares = enhance(
  async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
    const middlewares = await getAppMiddlewares()
    // An invalid config: Vike's pages show the error, instead of the app's routes running without the +middleware
    if (getVikeConfigError()) return renderPageUniversal(request, context, runtime)
    return applyMiddlewares(middlewares, request, context, runtime)
  },
  { name: 'vike:middleware' },
)

// The +middleware that aren't handlers (Universal Middleware's pipe() can't pass the request on): the first Response answers and the ones after
// it don't run, and the response functions of the ones that ran apply to the final response, in their order.
async function applyMiddlewares(
  middlewares: Middleware[],
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<unknown>,
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
  const nonHandlers = middlewares
    .filter((middleware) => !middleware.isHandler)
    .sort((a, b) => getUniversalProp(a, orderSymbol, 0) - getUniversalProp(b, orderSymbol, 0))
  for (const middleware of nonHandlers) {
    const result = await getUniversal(middleware)(request, context, runtime)
    if (result instanceof Response) return applyResponseFunctions(result)
    if (typeof result === 'function') responseFunctions.push(result)
    else if (result) Object.assign(context, result)
  }
  if (responseFunctions.length > 0) return applyResponseFunctions
}

// What `vike(app)` runs after the app's routes, looked up upon each request: the +middleware that are handlers, then Vike's pages
const middlewaresProxy_handlers = enhance(
  async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) =>
    // A method that no handler and no page answers (e.g. DELETE): what a server answers without a route for it
    (await getRouter(await getAppMiddlewares())(request, context, runtime)) ??
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
