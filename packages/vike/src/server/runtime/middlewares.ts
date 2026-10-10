export { getMiddlewares }
export { getAppMiddlewares }
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
import '../assertEnvServer.js'

type Middleware = EnhancedMiddleware & {
  /** `true` for the middlewares that run after the server's own routes: the `+middleware` with a `path` and no `order` (or `order: 0`), and Vike's pages. */
  isHandler: boolean
}

// Vike's pages, after everything else
const renderPageHandler: Middleware = Object.assign(
  enhance(renderPageUniversal, {
    name: 'vike',
    method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
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
  // `enhance()` clones the +middleware, so that marking it `isHandler` leaves the extension's export untouched
  if (isHandler(plusMiddleware)) {
    // A handler is a route of the server, which matches it: its path gets the Base URL
    const handler = enhance(
      plusMiddleware as UniversalMiddleware,
      path ? { path: baseServer.replace(/\/$/, '') + path } : {},
    )
    return Object.assign(handler, { isHandler: true })
  }
  if (!path) return Object.assign(enhance(plusMiddleware as UniversalMiddleware, {}), { isHandler: false })
  const order = getUniversalProp(plusMiddleware, orderSymbol)
  const isMatch = getMatcher(path, getUniversalProp(plusMiddleware, methodSymbol), order)
  const middleware = enhance(
    (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const pageRequest = getPageRequest(request, baseServer)
      if (!pageRequest || !isMatch(pageRequest)) return
      return getUniversal(plusMiddleware as UniversalMiddleware)(request, context, runtime)
    },
    { name: getUniversalProp(plusMiddleware, nameSymbol), order },
  )
  return Object.assign(middleware, { isHandler: false })
}

// The page's URL, as a request the matcher can read. `null` if the URL is outside the Base URL.
function getPageRequest(request: Request, baseServer: string): Request | null {
  const { urlWithoutPageContextRequestSuffix } = handlePageContextRequestUrl(request.url)
  const { href, isBaseMissing } = parseUrl(urlWithoutPageContextRequestSuffix, baseServer)
  if (isBaseMissing) return null
  return new Request(href, { method: request.method })
}

// The `path` and `method` check that Universal Middleware's `apply()` wraps a middleware with
function getMatcher(
  path: string,
  method: HttpMethod | HttpMethod[] | undefined,
  order: number | undefined,
): (request: Request) => boolean {
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
  apply(router, [enhance(() => matched, { path, method, order })])
  return (request) => scoped!(request, {}, {} as RuntimeAdapterTarget<unknown>) === matched
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
