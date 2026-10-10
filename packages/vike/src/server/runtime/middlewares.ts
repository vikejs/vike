export { getMiddlewares }
export { getAppMiddlewares }
export { renderPageUniversal }
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
  type UniversalRouterInterface,
} from '@universal-middleware/core'
import { parseUrl } from '../../utils/parseUrl.js'
import { handlePageContextRequestUrl } from './renderPageServer/handlePageContextRequestUrl.js'
import { renderPageServer } from './renderPageServer.js'
import { getGlobalContextServerInternal, initGlobalContext_renderPage } from './globalContext.js'
import { getVikeConfigError } from '../../shared-server-node/getVikeConfigError.js'
import { assert, assertWarning } from '../../utils/assert.js'
import '../assertEnvServer.js'

type Middleware = EnhancedMiddleware & {
  /** `true` for the middlewares that run after the server's own routes: the `+middleware` with a `path` and no `order` (or `order: 0`), and Vike's pages. */
  isHandler: boolean
}

// Vike's pages, after everything else
const renderPageHandler: Middleware = Object.assign(
  enhance(renderPageUniversal, {
    name: 'vike',
    method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
    path: '/**',
    immutable: true,
  }),
  { isHandler: true },
)

// `globalContext.middlewares`: every `+middleware`, then Vike's pages
function getMiddlewares(plusMiddlewares: EnhancedMiddleware[], baseServer: string): Middleware[] {
  return [...plusMiddlewares.map((plusMiddleware) => toMiddleware(plusMiddleware, baseServer)), renderPageHandler]
}

// The app's `globalContext.middlewares`. Upon an invalid config, only Vike's pages, which show the error.
const renderPageOnly = [renderPageHandler]
async function getAppMiddlewares(): Promise<Middleware[]> {
  // Before the await too, which doesn't resolve while the config is invalid
  if (getVikeConfigError()) return renderPageOnly
  try {
    await initGlobalContext_renderPage()
  } catch {
    return renderPageOnly
  }
  if (getVikeConfigError()) return renderPageOnly
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
  const isMatch = path && getMatcher(path, getUniversalProp(plusMiddleware, methodSymbol))
  const middleware = enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const { isPageContextJsonRequest, urlWithoutPageContextRequestSuffix } = handlePageContextRequestUrl(request.url)
      if (isMatch) {
        const { href, isBaseMissing } = parseUrl(urlWithoutPageContextRequestSuffix, baseServer)
        if (isBaseMissing || !isMatch(new Request(href, { method: request.method }))) return
      }
      const answer = await getUniversal(plusMiddleware as UniversalMiddleware)(request, context, runtime)
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

// The client router reloads the page upon a `.pageContext.json` answer that is a 404 without JSON, so that the page's own request shows the +middleware's answer (e.g. a 401, a redirect or a login page)
function toReload(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.delete('content-type')
  return new Response(response.body, { status: 404, headers })
}

// The `path` and `method` check that Universal Middleware's `apply()` wraps a middleware with
function getMatcher(path: string, method: HttpMethod | HttpMethod[] | undefined): (request: Request) => boolean {
  let scoped: UniversalMiddleware | undefined
  const router: UniversalRouterInterface = {
    use(middleware) {
      scoped = getUniversal(middleware as UniversalMiddleware)
      return this
    },
    route() {
      return this
    },
    applyCatchAll() {
      return this
    },
  }
  const matched = {}
  // A non-zero order: `apply()` scopes it to its path, rather than routing it as a handler
  apply(router, [enhance(() => matched, { path, method, order: 1 })])
  assert(scoped)
  return (request) => {
    const result = scoped!(request, {}, {} as RuntimeAdapterTarget<unknown>)
    // The check is synchronous: any other result (e.g. a Promise) would silently skip every +middleware with a path
    assert(result === matched || result === undefined)
    return result === matched
  }
}

async function renderPageUniversal(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<unknown>,
) {
  const pageContext = await renderPageServer({
    ...context,
    ...runtime,
    runtime,
    urlOriginal: request.url,
    headersOriginal: request.headers,
  })
  const response = pageContext.httpResponse
  return new Response(response.getReadableWebStream(), {
    status: response.statusCode,
    headers: response.headers,
  })
}
