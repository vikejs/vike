export { getUniversalMiddlewares }
export { runUniversalMiddlewares }
export { runHandlerMiddlewares }
export { runPlusMiddlewares }
export { httpMethods }

import { getGlobalContextServerInternal, type GlobalContextServerInternal } from './globalContext.js'
import { renderPageServerConfigError } from './renderPageServer.js'
import { normalizeMiddlewarePath } from './normalizeMiddlewarePath.js'
import { pageContextJsonFileExtension } from '../../shared-server-client/getPageContextRequestUrl.js'
import { parseUrl } from '../../utils/parseUrl.js'
import {
  enhance,
  getUniversal,
  getUniversalProp,
  methodSymbol,
  nameSymbol,
  orderSymbol,
  pathSymbol,
  pipeRoute,
  type Awaitable,
  type EnhancedMiddleware,
  type HttpMethod,
  type RuntimeAdapter,
  type UniversalHandler,
} from '@universal-middleware/core'
import { assertPlusMiddlewareInstalled, setPlusMiddlewareInstalled } from './assertPlusMiddlewareInstalled.js'
import '../assertEnvServer.js'

/**
 * Get the Universal Middlewares that apply your `+middleware` that run before your server's routes.
 *
 * Your server's `vike(app)` calls it for you. Call it yourself to control where `+middleware` run:
 * apply them before your server's other handlers, and `universalHandler` last.
 *
 * The `+middleware` that are handlers (`order: 0`, or a `path` and no `order`) aren't in it: `universalHandler` runs
 * them, next to Vike's pages, so that a route of your server can override one.
 *
 * @example
 * ```js
 * import { apply } from '@universal-middleware/express'
 * import { getUniversalMiddlewares, universalHandler } from 'vike'
 *
 * apply(app, getUniversalMiddlewares())
 * app.get('/api/hello', (req, res) => res.send('Hello'))
 * apply(app, [universalHandler])
 * ```
 *
 * https://github.com/magne4000/universal-middleware
 */
function getUniversalMiddlewares(): EnhancedMiddleware[] {
  return [nonHandlerMiddlewares]
}

// Servers install a handler only for the methods it declares, and a +middleware that is a handler can be on any method
const httpMethods: HttpMethod[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']
type ResponseHandler = (response: Response) => Awaitable<Response | undefined>

// What Vike's own dev and preview server runs before its pages: the +middleware that aren't handlers, then the ones that are
async function runUniversalMiddlewares(request: Request, context: Universal.Context, runtime: RuntimeAdapter) {
  const result = await runPhase(request, context, runtime, false)
  if (result instanceof Response) return result
  const applyResponseHandlers = typeof result === 'function' ? result : undefined
  if (!applyResponseHandlers) Object.assign(context, result)
  const response = await runHandlerMiddlewares(request, context, runtime)
  if (response) return applyResponseHandlers ? applyResponseHandlers(response) : response
  return applyResponseHandlers
}

// What universalHandler runs before the pages: the +middleware that are handlers. A Response is the answer; otherwise the
// context they build is added to `context`, for the pages.
async function runHandlerMiddlewares(request: Request, context: Universal.Context, runtime: RuntimeAdapter) {
  // Applying only universalHandler would silently skip the +middleware that aren't handlers
  const result = await runPhase(request, context, runtime, true, assertPlusMiddlewareInstalled)
  if (result instanceof Response) return result
  if (typeof result !== 'function') Object.assign(context, result)
}

async function applyResponseHandlers(responseHandlers: ResponseHandler[], response: Response) {
  for (const responseHandler of responseHandlers) response = (await responseHandler(response)) ?? response
  return response
}

// Resolved upon each request: the Vike config imports +server, so awaiting the config while +server loads deadlocks
async function runPhase(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapter,
  handlers: boolean,
  check?: (globalContext: GlobalContextServerInternal) => void,
) {
  // Fail closed: skipping the +middleware of an erroneous config would let requests through unguarded
  const pageContextConfigError = await renderPageServerConfigError({
    urlOriginal: request.url,
    headersOriginal: request.headers,
  })
  if (pageContextConfigError) {
    const { httpResponse } = pageContextConfigError
    return new Response(httpResponse.getReadableWebStream(), {
      status: httpResponse.statusCode,
      headers: httpResponse.headers,
    })
  }
  const { globalContext } = await getGlobalContextServerInternal()
  check?.(globalContext)
  const middlewares = (globalContext.config.middleware ?? []).flat().filter((m) => isHandler(m) === handlers)
  return runPlusMiddlewares(middlewares, globalContext.baseServer, request, context, runtime)
}

async function runPlusMiddlewares(
  plusMiddlewares: EnhancedMiddleware[],
  baseServer: string,
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapter,
) {
  const middlewares = plusMiddlewares.map(normalizeMiddlewarePath)
  if (middlewares.length === 0) return
  const responseHandlers: ResponseHandler[] = []
  // Universal Middleware's pipe() throws `No Response found` if nothing returns a Response
  const fallThrough = new Response(null)
  let contextAtFallThrough: Universal.Context | undefined
  const fallThroughRoute = enhance(
    (_request: Request, context: Universal.Context) => {
      contextAtFallThrough = context
      return fallThrough
    },
    { name: 'vike:fall-through', method: httpMethods, path: '/**' },
  )
  const handler = pipeRoute([
    fallThroughRoute,
    ...middlewares.map((middleware) => collectResponseHandler(middleware, request, responseHandlers, fallThroughRoute)),
  ]) as UniversalHandler
  const response = await handler(getRoutingRequest(request, baseServer), context, runtime)
  // Response handlers returned by +middleware apply to the final response, which may come after this middleware
  if (response !== fallThrough) return applyResponseHandlers(responseHandlers, response)
  // The pipe's context stays local: hand the context built by the +middleware to the handlers after this middleware.
  // A middleware returns a context or a response handler, not both: with response handlers, mutate the context instead.
  if (responseHandlers.length === 0) return contextAtFallThrough
  Object.assign(context, contextAtFallThrough)
  return (response: Response) => applyResponseHandlers(responseHandlers, response)
}

// The chain of the +middleware that aren't handlers runs before the routes of the server
const nonHandlerMiddlewares = enhance(
  async (request: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
    setPlusMiddlewareInstalled()
    return runPhase(request, context, runtime, false)
  },
  { name: 'vike:middleware' },
)

// Universal Middleware core's isHandler(), which it doesn't export
function isHandler(middleware: EnhancedMiddleware) {
  const order = getUniversalProp(middleware, orderSymbol)
  return typeof order === 'number' ? order === 0 : Boolean(getUniversalProp(middleware, pathSymbol))
}

// A `path` is matched against the page's URL, the way Vike routes pages: without the Base URL, and with a
// `.pageContext.json` request standing for its page. So `/dash` also covers `/base/dash` and `/dash/index.pageContext.json`,
// whatever pattern the path uses. The router only reads the URL and method; each +middleware gets the original request.
// The path stays percent-encoded until the router decodes it once: `/literal%25` must not become `/literal%`.
function getRoutingRequest(request: Request, baseServer: string): Request {
  const url = new URL(request.url)
  const suffix = `/index${pageContextJsonFileExtension}`
  if (url.pathname.endsWith(suffix)) url.pathname = url.pathname.slice(0, -suffix.length) || '/'
  const { href } = parseUrl(url.href, baseServer)
  return new Request(new URL(href, url), { method: request.method, headers: request.headers })
}

function collectResponseHandler(
  middleware: EnhancedMiddleware,
  request: Request,
  responseHandlers: ResponseHandler[],
  fallThroughRoute: EnhancedMiddleware,
) {
  const options = {
    name: getUniversalProp(middleware, nameSymbol),
    order: getUniversalProp(middleware, orderSymbol),
    method: withHead(getUniversalProp(middleware, methodSymbol)),
    path: getUniversalProp(middleware, pathSymbol),
  }
  // The router runs only the one handler matching the URL: a handler that passes the request on continues with the fall-through
  if (isHandler(middleware)) {
    return enhance(async (_routingRequest: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
      const result = await getUniversal(middleware)(request, context, runtime)
      return result ?? getUniversal(fallThroughRoute)(request, context, runtime)
    }, options)
  }
  // Every other +middleware runs, limited to its path if it has one
  return enhance(async (_routingRequest: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
    const result = await getUniversal(middleware)(request, context, runtime)
    if (typeof result !== 'function') return result
    responseHandlers.push(result)
  }, options)
}

// Web servers answer HEAD like GET, so a GET-scoped +middleware also covers HEAD
function withHead(method: HttpMethod | HttpMethod[] | undefined) {
  const methods = [method ?? []].flat()
  return methods.includes('GET') && !methods.includes('HEAD') ? [...methods, 'HEAD' as const] : method
}
