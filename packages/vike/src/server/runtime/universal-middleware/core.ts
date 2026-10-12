export { getMiddlewares_globalContext }
export { getMiddlewares_withErrorHandling }
export { getRuntime_vikeServer }
export { renderPageServer_universal }
export { scopeToPath }
export type { Middleware }

import {
  apply,
  contextSymbol,
  enhance,
  getAdapterRuntime,
  getUniversal,
  getUniversalProp,
  isHandler,
  methodSymbol,
  orderSymbol,
  pathSymbol,
  nameSymbol,
  type EnhancedMiddleware,
  type HttpMethod,
  type RuntimeAdapterTarget,
  type UniversalMiddleware,
  type UniversalRouterInterface,
} from '@universal-middleware/core'
import { parseUrl } from '../../../utils/parseUrl.js'
import { handlePageContextRequestUrl } from '../renderPageServer/handlePageContextRequestUrl.js'
import { renderPageServer } from '../renderPageServer.js'
import { getGlobalContextServerInternal, initGlobalContext_renderPage } from '../globalContext.js'
import { getVikeConfigError } from '../../../shared-server-node/getVikeConfigError.js'
import { assert, assertWarning } from '../../../utils/assert.js'
import { getGlobalObject } from '../../../utils/getGlobalObject.js'
import '../../assertEnvServer.js'

const globalObject = getGlobalObject('universal-middleware/core.ts', {
  runtimesVikeServer: new WeakSet<RuntimeAdapterTarget<unknown>>(),
})

type Middleware = EnhancedMiddleware & {
  /** `true` for the middlewares that run after the server's own routes: the `+middleware` with a `path` and no `order` (or `order: 0`), and Vike's pages. */
  isHandler: boolean
}

// Vike's pages, after everything else
const renderPageServer_universalMiddleware: Middleware = Object.assign(
  enhance(renderPageServer_universal, {
    name: 'vike',
    method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
    path: '/**',
    immutable: true,
  }),
  { isHandler: true },
)

// Upon an invalid config: Vike's pages answer every request with the error, so that the app's routes don't run without the +middleware
const middlewaresConfigError: Middleware[] = [
  Object.assign(enhance(renderPageServer_universal, { name: 'vike' }), { isHandler: false }),
]

// `globalContext.middlewares`: every `+middleware`, then Vike's built-in middleware
function getMiddlewares_globalContext(plusMiddlewares: EnhancedMiddleware[], baseServer: string): Middleware[] {
  return [
    ...plusMiddlewares.map((plusMiddleware) => toMiddleware(plusMiddleware, baseServer)),
    renderPageServer_universalMiddleware,
  ]
}

// `globalContext.middlewares`, or `middlewaresConfigError` upon an invalid config
async function getMiddlewares_withErrorHandling(): Promise<Middleware[]> {
  // Before the await too, which doesn't resolve while the config is invalid
  if (getVikeConfigError()) return middlewaresConfigError
  try {
    await initGlobalContext_renderPage()
  } catch {
    return middlewaresConfigError
  }
  if (getVikeConfigError()) return middlewaresConfigError
  const { globalContext } = await getGlobalContextServerInternal()
  return globalContext.middlewares
}

// A +middleware as an element of `globalContext.middlewares`. A `path` is matched against the page's URL, the way Vike routes pages: without the Base URL, and with a `.pageContext.json` request standing for its page.
function toMiddleware(plusMiddleware: EnhancedMiddleware, baseServer: string): Middleware {
  const path = getUniversalProp(plusMiddleware, pathSymbol)
  if (path) assertPath(plusMiddleware, path, baseServer)
  const name = getUniversalProp(plusMiddleware, nameSymbol)
  const method = getUniversalProp(plusMiddleware, methodSymbol)
  const order = getUniversalProp(plusMiddleware, orderSymbol)
  // The +middleware gets a marked copy of the runtime: its own renderPage() call renders if it passes the runtime on
  const plusMiddlewareMarked = (
    request: Request,
    context: Universal.Context,
    runtime: RuntimeAdapterTarget<unknown>,
  ) => {
    const runtimeMarked = { ...runtime, _isFromMiddlewares: true }
    return getUniversal(plusMiddleware as UniversalMiddleware)(request, context, runtimeMarked)
  }
  if (isHandler(plusMiddleware)) {
    // A handler is a route of the server, which matches it: its path gets the Base URL
    const handler = enhance(plusMiddlewareMarked, {
      name,
      method,
      path: path && baseServer.replace(/\/$/, '') + path,
      context: getUniversalProp(plusMiddleware, contextSymbol),
      ...(order !== undefined && { order }),
    })
    return Object.assign(handler, { isHandler: true })
  }
  const isMatch = path && getMatcher(path, method)
  const middleware = enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const { isPageContextJsonRequest, urlWithoutPageContextRequestSuffix } = handlePageContextRequestUrl(request.url)
      if (isMatch) {
        const { href, isBaseMissing } = parseUrl(urlWithoutPageContextRequestSuffix, baseServer)
        if (isBaseMissing || !isMatch(new Request(href, { method: request.method }))) return
      }
      const answer = await plusMiddlewareMarked(request, context, runtime)
      if (!isPageContextJsonRequest) return answer
      // The +middleware answered instead of the page
      if (answer instanceof Response) return toReload(answer)
      if (typeof answer !== 'function') return answer
      return async (response: Response) => {
        const replaced = await answer(response)
        // Vike's JSON, possibly re-encoded, stays
        return (
          replaced &&
          (replaced.headers.get('content-type')?.includes('application/json') ? replaced : toReload(replaced))
        )
      }
    },
    { name, ...(order !== undefined && { order }) },
  )
  return Object.assign(middleware, { isHandler: false })
}

// Warns about a path that starts with the Base URL: a `path` is relative to it
function assertPath(plusMiddleware: EnhancedMiddleware, path: string, baseServer: string): void {
  const base = baseServer.replace(/\/$/, '')
  if (!base || (path !== base && !path.startsWith(`${base}/`))) return
  const name = getUniversalProp(plusMiddleware, nameSymbol)
  assertWarning(
    false,
    `The +middleware ${name ? `${name} ` : ''}has the path ${path}, which starts with the Base URL ${baseServer}. A +middleware path is relative to the Base URL, use ${path.slice(base.length) || '/'} instead.`,
    { onlyOnce: `middleware-path:${name}:${path}` },
  )
}

// The client router reloads the page upon a `.pageContext.json` answer that is a 404 without JSON, so that the page's own request shows the +middleware's answer (e.g. a 401, a redirect or a login page)
function toReload(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.delete('content-type')
  return new Response(response.body, { status: 404, headers })
}

// Universal Middleware's `apply()` scopes a middleware that isn't a handler to its `path` and `method`: a router that only
// records it gives that scoped middleware back
function scopeToPath(middleware: UniversalMiddleware): UniversalMiddleware {
  let scoped: UniversalMiddleware | undefined
  const router: UniversalRouterInterface = {
    use(m) {
      scoped = getUniversal(m as UniversalMiddleware)
      return this
    },
    route() {
      return this
    },
    applyCatchAll() {
      return this
    },
  }
  apply(router, [middleware])
  assert(scoped)
  return scoped
}

// The `path` and `method` check that `scopeToPath()` wraps a middleware with
function getMatcher(path: string, method: HttpMethod | HttpMethod[] | undefined): (request: Request) => boolean {
  const matched = {}
  // A non-zero order: `apply()` scopes it to its path, rather than routing it as a handler
  const scoped = scopeToPath(enhance(() => matched, { path, method, order: 1 }))
  return (request) => {
    const result = scoped(request, {}, {} as RuntimeAdapterTarget<unknown>)
    // The check is synchronous: any other result (e.g. a Promise) would silently skip every middleware with a path
    assert(result === matched || result === undefined)
    return result === matched
  }
}

// The runtime that Vike's own server creates for the +middleware, one per request: the router writes its match into `runtime.params`
function getRuntime_vikeServer(): RuntimeAdapterTarget<unknown> {
  const runtime = getAdapterRuntime('other', { params: undefined })
  globalObject.runtimesVikeServer.add(runtime)
  return runtime
}

async function renderPageServer_universal(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<unknown>,
) {
  const pageContext = await renderPageServer({
    // Unless the context has it, e.g. `$ vike dev` passes the URL's path
    urlOriginal: request.url,
    ...context,
    // Not the runtime that Vike's own server creates: it isn't a server's, and its `params` is the router's match of `/**`
    ...(!globalObject.runtimesVikeServer.has(runtime) && { ...runtime, runtime }),
    headersOriginal: request.headers,
    _isFromMiddlewares: true,
  })
  const response = pageContext.httpResponse
  return new Response(response.getReadableWebStream(), {
    status: response.statusCode,
    headers: response.headers,
  })
}
