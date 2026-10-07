export { getUniversalMiddlewares }
export { runUniversalMiddlewares }
export { runPlusMiddlewares }

import { getGlobalContextServerInternal } from './globalContext.js'
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
import { setPlusMiddlewareInstalled } from './assertPlusMiddlewareInstalled.js'
import '../assertEnvServer.js'

/**
 * Get the Universal Middlewares that apply your `+middleware` to all HTTP requests.
 *
 * Your server's `vike(app)` calls it for you. Call it yourself to control where `+middleware` run:
 * apply them before your server's other handlers, and Vike's handler last.
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
  return [universalMiddlewares]
}

const httpMethods: HttpMethod[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']
type ResponseHandler = (response: Response) => Awaitable<Response | undefined>

// Resolved upon each request: the Vike config imports +server, so awaiting the config while +server loads deadlocks
async function runUniversalMiddlewares(request: Request, context: Universal.Context, runtime: RuntimeAdapter) {
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
  const middlewares = (globalContext.config.middleware ?? []).flat()
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
  const applyResponseHandlers = async (response: Response) => {
    for (const responseHandler of responseHandlers) response = (await responseHandler(response)) ?? response
    return response
  }
  if (response !== fallThrough) return applyResponseHandlers(response)
  // The pipe's context stays local: hand the context built by the +middleware to the handlers after this middleware.
  // A middleware returns a context or a response handler, not both: with response handlers, mutate the context instead.
  if (responseHandlers.length === 0) return contextAtFallThrough
  Object.assign(context, contextAtFallThrough)
  return applyResponseHandlers
}

// The chain runs before Vike's pages in the same request
const universalMiddlewares = enhance(
  async (request: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
    setPlusMiddlewareInstalled()
    return runUniversalMiddlewares(request, context, runtime)
  },
  { name: 'vike:middleware' },
)

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
  // The router runs only the one route matching the URL: a route that passes the request on continues with the fall-through
  if (getUniversalProp(middleware, pathSymbol)) {
    return enhance(
      async (_routingRequest: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
        const result = await getUniversal(middleware)(request, context, runtime)
        return result ?? getUniversal(fallThroughRoute)(request, context, runtime)
      },
      {
        name: getUniversalProp(middleware, nameSymbol),
        order: getUniversalProp(middleware, orderSymbol),
        method: withHead(getUniversalProp(middleware, methodSymbol)),
        path: getUniversalProp(middleware, pathSymbol),
      },
    )
  }
  return enhance(
    async (_routingRequest: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
      const result = await getUniversal(middleware)(request, context, runtime)
      if (typeof result !== 'function') return result
      responseHandlers.push(result)
    },
    { name: getUniversalProp(middleware, nameSymbol), order: getUniversalProp(middleware, orderSymbol) },
  )
}

// Web servers answer HEAD like GET, so a GET-scoped +middleware also covers HEAD
function withHead(method: HttpMethod | HttpMethod[] | undefined) {
  const methods = [method ?? []].flat()
  return methods.includes('GET') && !methods.includes('HEAD') ? [...methods, 'HEAD' as const] : method
}
