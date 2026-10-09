export { addMiddlewares }
export { runUniversalMiddlewares }
export { runHandlerMiddlewares }
export { runPlusMiddlewares }
export { httpMethods }
export { isHandler }
export { plusMiddlewareProxy }
export type { PlusMiddleware }

import { getGlobalContextServerInternal, type GlobalContextServerInternal } from './globalContext.js'
import { renderPageServerConfigError } from './renderPageServer.js'
import { warnAndNormalizeMiddlewarePath } from './warnAndNormalizeMiddlewarePath.js'
import { pageContextJsonFileExtension } from '../../shared-server-client/getPageContextRequestUrl.js'
import { parseUrl } from '../../utils/parseUrl.js'
import {
  contextSymbol,
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
import { setPlusMiddlewareFetched } from './plusMiddlewareChange.js'
import { pageMethods, pagesHandler, renderPageResponse } from './pagesHandler.js'
import '../assertEnvServer.js'

// What `globalContext.middlewares` holds: a Universal Middleware, marked `isHandler` for `apply()` callers to tell the two phases apart
type PlusMiddleware = EnhancedMiddleware & { isHandler: boolean }

// Defines `globalContext.middlewares`: created and marked as fetched upon the first access, which is when a server that
// applies the list itself holds it, and has to be re-run if the +middleware change in development. (`vike(app)` looks them up upon each request.)
function addMiddlewares<T extends object>(
  globalContext: T,
  config: { middleware?: (EnhancedMiddleware | EnhancedMiddleware[])[] },
) {
  let middlewares: PlusMiddleware[] | undefined
  Object.defineProperty(globalContext, 'middlewares', {
    get() {
      const plusMiddlewares = (config.middleware ?? []).flat()
      setPlusMiddlewareFetched(plusMiddlewares)
      // The list is applied: the +middleware that are handlers need nothing else
      setPlusMiddlewareInstalled()
      return (middlewares ??= createMiddlewares(plusMiddlewares))
    },
    // Not enumerable: copying the global context mustn't count as applying the list
    enumerable: false,
    configurable: true,
  })
  return globalContext as T & { middlewares: PlusMiddleware[] }
}

// The +middleware that aren't handlers, by order, then the ones that are, then Vike's pages. Handlers don't carry their `path`
// and `method`: a server's router would see the raw URL, and would run only one handler that matches, whereas each answers or passes
// the request on to the next, then to the pages.
function createMiddlewares(plusMiddlewares: EnhancedMiddleware[]): PlusMiddleware[] {
  const handlers = plusMiddlewares.filter(isHandler)
  const others = plusMiddlewares.filter((middleware) => !isHandler(middleware))
  // Universal Middleware's apply() sorts the same way
  others.sort((a, b) => getUniversalProp(a, orderSymbol, 0) - getUniversalProp(b, orderSymbol, 0))
  return [
    ...others.map(toUniversalMiddleware),
    ...handlers.map((handler) => toUniversalHandler(handler, handlers)),
    pagesHandler,
  ]
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

// What the handler of plusMiddlewareProxy runs before the pages: the +middleware that are handlers. A Response is the answer; otherwise the
// context they build is added to `context`, for the pages.
async function runHandlerMiddlewares(request: Request, context: Universal.Context, runtime: RuntimeAdapter) {
  // Applying only the handlers would silently skip the +middleware that aren't handlers
  const result = await runPhase(request, context, runtime, true, assertPlusMiddlewareInstalled)
  if (result instanceof Response) return result
  if (typeof result !== 'function') Object.assign(context, result)
}

async function applyResponseHandlers(responseHandlers: ResponseHandler[], response: Response) {
  for (const responseHandler of responseHandlers) response = (await responseHandler(response)) ?? response
  return response
}

// Resolved upon each request: vike(app) is synchronous, it can't await the config while +server loads (a +server that awaits it at its top level,
// such as `await getGlobalContext()` does, can, but only with a valid config: while it is erroneous at startup, that call keeps waiting),
// and a +middleware added in development takes effect without a restart
function runPhase(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapter,
  handlers: boolean,
  check?: (globalContext: GlobalContextServerInternal) => void,
) {
  return runWithGlobalContext(request, check, (globalContext) => {
    const middlewares = (globalContext.config.middleware ?? []).flat().filter((m) => isHandler(m) === handlers)
    return runPlusMiddlewares(middlewares, globalContext.baseServer, request, context, runtime)
  })
}

async function runWithGlobalContext(
  request: Request,
  check: ((globalContext: GlobalContextServerInternal) => void) | undefined,
  run: (globalContext: GlobalContextServerInternal) => ReturnType<typeof runPlusMiddlewares>,
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
  return run(globalContext)
}

async function runPlusMiddlewares(
  plusMiddlewares: EnhancedMiddleware[],
  baseServer: string,
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapter,
  // Only this one of `plusMiddlewares` runs, but the router still picks the most specific handler among all
  only?: EnhancedMiddleware,
) {
  const middlewares = plusMiddlewares.map(warnAndNormalizeMiddlewarePath)
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
    ...middlewares.map((middleware, i) =>
      collectResponseHandler(
        middleware,
        request,
        responseHandlers,
        fallThroughRoute,
        plusMiddlewares[i] === only || only === undefined,
      ),
    ),
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

// One +middleware of the list. It matches its own path (without the `path` and `method` of the server's router, which
// would see the raw URL) and runs on the same code as the proxy below.
function toUniversalMiddleware(middleware: EnhancedMiddleware): PlusMiddleware {
  const name = getUniversalProp(middleware, nameSymbol)
  const order = getUniversalProp(middleware, orderSymbol)
  return Object.assign(
    enhance(
      (request: Request, context: Universal.Context, runtime: RuntimeAdapter) =>
        runWithGlobalContext(request, undefined, ({ baseServer }) =>
          runPlusMiddlewares([middleware], baseServer, request, context, runtime),
        ),
      // Not `{ name, order }`: enhance() keeps an `order: undefined` key, and getUniversalProp(m, orderSymbol, 0) then returns undefined instead of 0
      { ...(name !== undefined && { name }), ...(order !== undefined && { order }) },
    ),
    { isHandler: false },
  )
}

// A +middleware that is a handler. Without `path`, `method` and `order`, a server installs it as a middleware, after the routes registered
// before it. It runs only if it is the handler for the URL, like in a router, and otherwise passes the request on.
function toUniversalHandler(middleware: EnhancedMiddleware, handlers: EnhancedMiddleware[]): PlusMiddleware {
  const name = getUniversalProp(middleware, nameSymbol)
  return Object.assign(
    enhance(
      (request: Request, context: Universal.Context, runtime: RuntimeAdapter) =>
        runWithGlobalContext(request, undefined, ({ baseServer }) =>
          runPlusMiddlewares(handlers, baseServer, request, context, runtime, middleware),
        ),
      name !== undefined ? { name } : {},
    ),
    { isHandler: true },
  )
}

// What the adapters' vike(app) applies, looked up upon each request, so that a +middleware added, removed or edited in
// development takes effect without a restart. The +middleware that aren't handlers run as one chain, before the app's routes. The handlers run with the
// pages, after the routes.
const beforeRoutes = Object.assign(
  enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
      setPlusMiddlewareInstalled()
      return runPhase(request, context, runtime, false)
    },
    { name: 'vike:middleware' },
  ),
  { isHandler: false },
)
// Every method, since a +middleware that is a handler can be on any
const withPages = Object.assign(
  enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
      // The +middleware that are handlers run next to the pages, after the routes of the server; they can answer instead
      const handlerResponse = await runHandlerMiddlewares(request, context, runtime)
      if (handlerResponse) return handlerResponse
      // What a server answers for a method it has no route for
      if (!pageMethods.includes(request.method as HttpMethod)) return new Response('Not Found', { status: 404 })
      return renderPageResponse(request, context, runtime)
    },
    { name: 'vike', method: httpMethods, path: '/**', immutable: true },
  ),
  { isHandler: true },
)
const plusMiddlewareProxy = [beforeRoutes, withPages] as const

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
  runs: boolean,
) {
  const options = {
    name: getUniversalProp(middleware, nameSymbol),
    order: getUniversalProp(middleware, orderSymbol),
    method: withHead(getUniversalProp(middleware, methodSymbol)),
    path: getUniversalProp(middleware, pathSymbol),
    context: getUniversalProp(middleware, contextSymbol),
  }
  // The router runs only the one handler matching the URL: a handler that passes the request on continues with the fall-through
  if (isHandler(middleware)) {
    return enhance(async (_routingRequest: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
      const result = runs ? await getUniversal(middleware)(request, context, runtime) : undefined
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
