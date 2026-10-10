export { addMiddlewares }
export { runUniversalMiddlewares }
export { runPlusMiddlewares }
export { httpMethods }
export { plusMiddlewareProxy }
export type { PlusMiddleware }

import {
  getGlobalContextServerInternal,
  getGlobalContextServerInternalOptional,
  type GlobalContextServerInternal,
} from './globalContext.js'
import { renderPageServerConfigError } from './renderPageServer.js'
import { warnAndNormalizeMiddlewarePath } from './warnAndNormalizeMiddlewarePath.js'
import { assertMiddlewarePath, getRoutingRequest } from './getRoutingRequest.js'
import { handlePageContextRequestUrl } from './renderPageServer/handlePageContextRequestUrl.js'
import {
  contextSymbol,
  enhance,
  getUniversal,
  getUniversalProp,
  isHandler,
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
  const result = await runPhase(request, context, runtime, 'others')
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
  const result = await runPhase(request, context, runtime, 'handlers', assertPlusMiddlewareInstalled)
  if (result instanceof Response) return result
  if (typeof result !== 'function') Object.assign(context, result)
}

async function getFinalResponse(request: Request, responseHandlers: ResponseHandler[], response: Response) {
  for (const responseHandler of responseHandlers) response = (await responseHandler(response)) ?? response
  // The client router reloads the page upon a `.pageContext.json` answer that is a 404 without JSON, so that a +middleware's own answer (e.g. a 401 or a redirect) is shown by the page's HTML request
  if (
    handlePageContextRequestUrl(request.url).isPageContextJsonRequest &&
    !response.headers.get('content-type')?.includes('application/json')
  ) {
    response = new Response(response.body, { status: 404, headers: response.headers })
  }
  return response
}

// Resolved upon each request: vike(app) is synchronous, it can't await the config while +server loads (a +server that awaits it at its top level,
// such as `await getGlobalContext()` does, can, but only with a valid config: while it is erroneous at startup, that call keeps waiting),
// and a +middleware added in development takes effect without a restart
function runPhase(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapter,
  phase: Phase,
  check?: (globalContext: GlobalContextServerInternal) => void,
) {
  // In production the config doesn't change once loaded: a phase without +middleware has nothing to run or check
  const globalContextLoaded = getGlobalContextServerInternalOptional()
  if (globalContextLoaded?._isProduction && getPhase(globalContextLoaded, phase).length === 0) return
  return runWithGlobalContext(request, check, (globalContext) =>
    runPlusMiddlewares(getPhase(globalContext, phase), globalContext.baseServer, request, context, runtime),
  )
}

type Phase = 'others' | 'handlers'
function getPhase(globalContext: GlobalContextServerInternal, phase: Phase) {
  return getPhases(globalContext.config.middleware ?? noMiddleware)[phase]
}

// The same lists for the same config, so that their routers are reused. The config is new after a change in development.
const noMiddleware: EnhancedMiddleware[] = []
const phases = new WeakMap<object, { handlers: EnhancedMiddleware[]; others: EnhancedMiddleware[] }>()
function getPhases(middleware: (EnhancedMiddleware | EnhancedMiddleware[])[]) {
  let lists = phases.get(middleware)
  if (!lists) {
    const all = middleware.flat()
    lists = { handlers: all.filter(isHandler), others: all.filter((m) => !isHandler(m)) }
    phases.set(middleware, lists)
  }
  return lists
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
  if (plusMiddlewares.length === 0) return
  const handler = getRouter(plusMiddlewares, baseServer)
  const routingRequest = getRoutingRequest(request, baseServer)
  const run: Run = { request, responseHandlers: [], only }
  runs.set(routingRequest, run)
  const response = await handler(routingRequest, context, runtime)
  const { responseHandlers, contextAtFallThrough } = run
  // Response handlers returned by +middleware apply to the final response, which may come after this middleware
  if (response !== fallThrough) return getFinalResponse(request, responseHandlers, response)
  // The pipe's context stays local: hand the context built by the +middleware to the handlers after this middleware.
  // A middleware returns a context or a response handler, not both: with response handlers, mutate the context instead.
  if (responseHandlers.length === 0) return contextAtFallThrough
  Object.assign(context, contextAtFallThrough)
  return (response: Response) => getFinalResponse(request, responseHandlers, response)
}

// What a router's routes need from the request they run for, by its routing request: the router is shared by every request
type Run = {
  request: Request
  responseHandlers: ResponseHandler[]
  only: EnhancedMiddleware | undefined
  contextAtFallThrough?: Universal.Context
}
const runs = new WeakMap<Request, Run>()

// Universal Middleware's pipe() throws `No Response found` if nothing returns a Response
const fallThrough = new Response(null)
const fallThroughRoute = enhance(
  (routingRequest: Request, context: Universal.Context) => {
    runs.get(routingRequest)!.contextAtFallThrough = context
    return fallThrough
  },
  { name: 'vike:fall-through', method: httpMethods, path: '/**' },
)

const routers = new WeakMap<EnhancedMiddleware[], UniversalHandler>()
function getRouter(plusMiddlewares: EnhancedMiddleware[], baseServer: string) {
  let router = routers.get(plusMiddlewares)
  if (!router) {
    router = pipeRoute([
      fallThroughRoute,
      ...plusMiddlewares.map((plusMiddleware) => {
        const middleware = warnAndNormalizeMiddlewarePath(plusMiddleware)
        assertMiddlewarePath(middleware, baseServer)
        return collectResponseHandler(middleware, plusMiddleware)
      }),
    ]) as UniversalHandler
    routers.set(plusMiddlewares, router)
  }
  return router
}

// One +middleware of the list. It matches its own path (without the `path` and `method` of the server's router, which
// would see the raw URL) and runs on the same code as the proxy below.
function toUniversalMiddleware(middleware: EnhancedMiddleware): PlusMiddleware {
  const name = getUniversalProp(middleware, nameSymbol)
  const order = getUniversalProp(middleware, orderSymbol)
  const list = [middleware]
  return Object.assign(
    enhance(
      (request: Request, context: Universal.Context, runtime: RuntimeAdapter) =>
        runWithGlobalContext(request, undefined, ({ baseServer }) =>
          runPlusMiddlewares(list, baseServer, request, context, runtime),
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
      return runPhase(request, context, runtime, 'others')
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

function collectResponseHandler(middleware: EnhancedMiddleware, plusMiddleware: EnhancedMiddleware) {
  const options = {
    name: getUniversalProp(middleware, nameSymbol),
    order: getUniversalProp(middleware, orderSymbol),
    method: withHead(getUniversalProp(middleware, methodSymbol)),
    path: getUniversalProp(middleware, pathSymbol),
    context: getUniversalProp(middleware, contextSymbol),
  }
  // The router runs only the one handler matching the URL: a handler that passes the request on continues with the fall-through
  if (isHandler(middleware)) {
    return enhance(async (routingRequest: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
      const { request, only } = runs.get(routingRequest)!
      const result =
        only === undefined || only === plusMiddleware
          ? await getUniversal(middleware)(request, context, runtime)
          : undefined
      return result ?? getUniversal(fallThroughRoute)(routingRequest, context)
    }, options)
  }
  // Every other +middleware runs, limited to its path if it has one
  return enhance(async (routingRequest: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
    const { request, responseHandlers } = runs.get(routingRequest)!
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
