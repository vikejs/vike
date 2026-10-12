export { getMiddlewares_globalContext }
export { getMiddlewares_config }
export { getMiddlewares_withErrorHandling }
export { scopeToPath }
export { vikePagesRoute }
export type { Middleware }

import {
  apply,
  enhance,
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
  type UniversalOptionsArg,
  type UniversalRouterInterface,
} from '@universal-middleware/core'
import { parseUrl } from '../../../utils/parseUrl.js'
import { handlePageContextRequestUrl } from '../renderPageServer/handlePageContextRequestUrl.js'
import { renderPageServer } from '../renderPageServer.js'
import { getGlobalContextServerInternal, initGlobalContext_renderPage } from '../globalContext.js'
import { getVikeConfigError } from '../../../shared-server-node/getVikeConfigError.js'
import { assert, assertWarning } from '../../../utils/assert.js'
import type { ConfigResolved } from '../../../types/Config/ConfigResolved.js'
import '../../assertEnvServer.js'

type Middleware = EnhancedMiddleware & {
  /** `true` for the middlewares that run after the server's own routes: the `+middleware` with a `path` and no `order` (or `order: 0`), and Vike's pages. */
  isHandler: boolean
}

// The requests Vike's pages answer
const vikePagesRoute = {
  name: 'vike',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  path: '/**',
} satisfies UniversalOptionsArg

// Vike's pages, after everything else
const renderPageServer_universalMiddleware: Middleware = Object.assign(
  enhance(renderPageServer_universal, vikePagesRoute),
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

// Every `+middleware` of the config
function getMiddlewares_config(config: ConfigResolved): EnhancedMiddleware[] {
  return (config.middleware ?? []).flat()
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
  if (isHandler(plusMiddleware)) {
    // A handler is a route of the server, which matches it: its path gets the Base URL. (`enhance()` clones it, so that marking it `isHandler` leaves the extension's export untouched.)
    const handler = enhance(
      plusMiddleware as UniversalMiddleware,
      path ? { path: baseServer.replace(/\/$/, '') + path } : {},
    )
    return Object.assign(handler, { isHandler: true })
  }
  const order = getUniversalProp(plusMiddleware, orderSymbol)
  const isMatch = path && getMatcher(path, getUniversalProp(plusMiddleware, methodSymbol), baseServer)
  const middleware = enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const { isPageContextJsonRequest, urlWithoutPageContextRequestSuffix } = handlePageContextRequestUrl(request.url)
      if (isMatch && !isMatch(urlWithoutPageContextRequestSuffix, request.method)) return
      const answer = await getUniversal(plusMiddleware as UniversalMiddleware)(request, context, runtime)
      return isPageContextJsonRequest ? toPageContextJsonAnswer(answer) : answer
    },
    { name: getUniversalProp(plusMiddleware, nameSymbol), ...(order !== undefined && { order }) },
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

// A +middleware's answer to a `.pageContext.json` request. Its own Response, or a response function's replacement of
// Vike's JSON, becomes a 404 without JSON: the client router then reloads the page, so that the page's own request shows
// the +middleware's answer (e.g. a 401, a redirect or a login page).
function toPageContextJsonAnswer(answer: Awaited<ReturnType<UniversalMiddleware>>) {
  const toReload = (response: Response) => {
    const headers = new Headers(response.headers)
    headers.delete('content-type')
    return new Response(response.body, { status: 404, headers })
  }
  // The +middleware answered instead of the page
  if (answer instanceof Response) return toReload(answer)
  if (typeof answer !== 'function') return answer
  return async (response: Response) => {
    const replaced = await answer(response)
    // Vike's JSON, possibly re-encoded, stays
    return (
      replaced && (replaced.headers.get('content-type')?.includes('application/json') ? replaced : toReload(replaced))
    )
  }
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

// The `path` and `method` check that `scopeToPath()` wraps a middleware with, applied to a page's URL without the Base URL
function getMatcher(
  path: string,
  method: HttpMethod | HttpMethod[] | undefined,
  baseServer: string,
): (url: string, requestMethod: string) => boolean {
  const matched = {}
  // A non-zero order: `apply()` scopes it to its path, rather than routing it as a handler
  const scoped = scopeToPath(enhance(() => matched, { path, method, order: 1 }))
  return (url, requestMethod) => {
    const { href, isBaseMissing } = parseUrl(url, baseServer)
    if (isBaseMissing) return false
    const result = scoped(new Request(href, { method: requestMethod }), {}, {} as RuntimeAdapterTarget<unknown>)
    // The check is synchronous: any other result (e.g. a Promise) would silently skip every middleware with a path
    assert(result === matched || result === undefined)
    return result === matched
  }
}

async function renderPageServer_universal(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<unknown>,
) {
  const pageContext = await renderPageServer(
    {
      // Unless the context has it, e.g. `$ vike dev` passes the URL's path
      urlOriginal: request.url,
      ...context,
      // Only a server's runtime: not the 'other' one Vike's own server creates, nor a Cloudflare worker's ExecutionContext
      ...(runtime.adapter && runtime.adapter !== 'other' && { runtime }),
      ...('req' in runtime && { req: runtime.req, res: runtime.res }),
      headersOriginal: request.headers,
    },
    false,
  )
  const response = pageContext.httpResponse
  return new Response(response.getReadableWebStream(), {
    status: response.statusCode,
    headers: response.headers,
  })
}
