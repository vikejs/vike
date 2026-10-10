export { middlewaresBeforeRoutes }
export { middlewaresAfterRoutes }

import {
  enhance,
  getUniversal,
  getUniversalProp,
  orderSymbol,
  pipeRoute,
  type RuntimeAdapterTarget,
  type UniversalHandler,
} from '@universal-middleware/core'
import { getAppMiddlewares, type Middleware } from './middlewares.js'
import { getVikeConfigError } from '../../shared-server-node/getVikeConfigError.js'
import '../assertEnvServer.js'

// What `vike(app)` runs before the app's routes, looked up upon each request: the +middleware that aren't handlers, as Universal Middleware's
// router runs them (its pipe() can't pass the request on): the first Response answers, response functions apply to the final response.
const middlewaresBeforeRoutes = enhance(
  async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
    const middlewares = await getAppMiddlewares()
    // An invalid config: Vike's pages show the error, instead of the app's routes running without the +middleware
    if (getVikeConfigError()) return getUniversal(middlewares.at(-1)!)(request, context, runtime)
    let response: Response | undefined
    const responseFunctions: ((response: Response) => Response | undefined | Promise<Response | undefined>)[] = []
    const others = middlewares
      .filter((middleware) => !middleware.isHandler)
      .sort((a, b) => getUniversalProp(a, orderSymbol, 0) - getUniversalProp(b, orderSymbol, 0))
    for (const middleware of others) {
      const result = await getUniversal(middleware)(request, context, runtime)
      if (result instanceof Response) response ??= result
      else if (typeof result === 'function') responseFunctions.push(result)
      else if (result) Object.assign(context, result)
    }
    const applyResponseFunctions = async (response: Response) => {
      for (const responseFunction of responseFunctions) response = (await responseFunction(response)) ?? response
      return response
    }
    if (response) return applyResponseFunctions(response)
    if (responseFunctions.length > 0) return applyResponseFunctions
  },
  { name: 'vike:middleware' },
)

// What `vike(app)` runs after the app's routes, looked up upon each request: the +middleware that are handlers, then Vike's pages
const middlewaresAfterRoutes = enhance(
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
