export { getMiddlewares_globalContext }
export { getMiddlewares_withErrorHandling }
export { hasPlusMiddlewares }
export { vikePagesRoute }
export type { Middleware }

import {
  createMatcher,
  enhance,
  getUniversal,
  getUniversalProp,
  isHandler,
  methodSymbol,
  orderSymbol,
  pathSymbol,
  nameSymbol,
  type EnhancedMiddleware,
  type RuntimeAdapterTarget,
  type UniversalMiddleware,
  type UniversalOptionsArg,
} from '@universal-middleware/core'
import { parseUrl } from '../../../utils/parseUrl.js'
import { handlePageContextRequestUrl } from '../renderPageServer/handlePageContextRequestUrl.js'
import { renderPageServer } from '../renderPageServer.js'
import { getGlobalContextServerInternal, initGlobalContext_renderPage } from '../globalContext.js'
import { getVikeConfigError } from '../../../shared-server-node/getVikeConfigError.js'
import { assertWarning } from '../../../utils/assert.js'
import pc from '@brillout/picocolors'
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
const renderPageServer_universalMiddleware = enhance(renderPageServer_universal, vikePagesRoute)

// Upon an invalid config: Vike's pages answer every request with the error, so that the app's routes don't run without the +middleware
const middlewares_uponConfigError = [enhance(renderPageServer_universal, { name: 'vike' })].map(withIsHandler)

// `globalContext.middlewares`: every `+middleware`, then Vike's pages
function getMiddlewares_globalContext(globalContext: { config: ConfigResolved }, baseServer: string): Middleware[] {
  return [
    ...getMiddlewares_config(globalContext).map((plusMiddleware) => wrapWithVikeRouting(plusMiddleware, baseServer)),
    renderPageServer_universalMiddleware,
  ].map(withIsHandler)
}

// Marks a middleware the way Universal Middleware's own `apply()` classifies it
function withIsHandler(middleware: EnhancedMiddleware): Middleware {
  return Object.assign(middleware, { isHandler: isHandler(middleware) })
}

// List of +middleware
function getMiddlewares_config(globalContext: { config: ConfigResolved }): EnhancedMiddleware[] {
  return (globalContext.config.middleware ?? []).flat()
}
// Does a +middleware exist?
function hasPlusMiddlewares(globalContext: { config: ConfigResolved }) {
  return getMiddlewares_config(globalContext).length === 0
}

// `globalContext.middlewares`, or `middlewaresConfigError` upon an invalid config
async function getMiddlewares_withErrorHandling(): Promise<Middleware[]> {
  // Before the await too, which doesn't resolve while the config is invalid
  if (getVikeConfigError()) return middlewares_uponConfigError
  try {
    await initGlobalContext_renderPage()
  } catch {
    return middlewares_uponConfigError
  }
  if (getVikeConfigError()) return middlewares_uponConfigError
  const { globalContext } = await getGlobalContextServerInternal()
  return globalContext.middlewares
}

// A +middleware as an element of `globalContext.middlewares`. A `path` is matched against the page's URL, the way Vike routes pages: without the Base URL, and with a `.pageContext.json` request standing for its page.
function wrapWithVikeRouting(plusMiddleware: EnhancedMiddleware, baseServer: string): EnhancedMiddleware {
  const path = getUniversalProp(plusMiddleware, pathSymbol)
  if (path) assertPath(plusMiddleware, path, baseServer)
  if (isHandler(plusMiddleware)) {
    // A handler is a route of the server, which matches it: its path gets the Base URL. (`enhance()` clones it, so that marking it `isHandler` leaves the extension's export untouched.)
    return enhance(plusMiddleware as UniversalMiddleware, path ? { path: baseServer.replace(/\/$/, '') + path } : {})
  }
  const order = getUniversalProp(plusMiddleware, orderSymbol)
  const isMatch = path && createMatcher(path, getUniversalProp(plusMiddleware, methodSymbol))
  return enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const { isPageContextJsonRequest, urlWithoutPageContextRequestSuffix } = handlePageContextRequestUrl(request.url)
      if (isMatch) {
        const { href, isBaseMissing } = parseUrl(urlWithoutPageContextRequestSuffix, baseServer)
        if (isBaseMissing || !isMatch(new Request(href, { method: request.method }))) return
      }
      const answer = await getUniversal(plusMiddleware as UniversalMiddleware)(request, context, runtime)
      return isPageContextJsonRequest ? toPageContextJsonAnswer(answer) : answer
    },
    {
      name: getUniversalProp(plusMiddleware, nameSymbol),
      // Whatever its order, it doesn't run once a Response exists
      runs: 'until-response',
      ...(order !== undefined && { order }),
    },
  )
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

async function renderPageServer_universal(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<unknown>,
) {
  const pageContextInit = {
    urlOriginal: request.url, // let `context` override it, e.g. `$ vike dev` passes the URL's path
    runtime,
    req: 'req' in runtime ? runtime.req : null,
    res: 'res' in runtime ? runtime.res : null,
    headersOriginal: request.headers,
    ...context,
  }
  addUserAgent_deprecated(pageContextInit, request, runtime)
  const pageContext = await renderPageServer(pageContextInit, false)
  const response = pageContext.httpResponse
  return new Response(response.getReadableWebStream(), {
    status: response.statusCode,
    headers: response.headers,
  })
}

function addUserAgent_deprecated(pageContextInit: object, request: Request, runtime: RuntimeAdapterTarget<unknown>) {
  // `$ vike dev` and `$ vike preview`
  if (runtime.adapter === 'other' && 'req' in runtime) {
    Object.defineProperty(pageContextInit, 'userAgent', {
      get() {
        // TO-DO/next-major-release: assertUsage() instead of assertWarning()
        assertWarning(
          false,
          `${pc.cyan('pageContext.userAgent')} is deprecated: use ${pc.cyan(
            "pageContext.headers['user-agent']",
          )} instead.`,
          {
            showStackTrace: true,
            onlyOnce: true,
          },
        )
        return request.headers.get('user-agent') ?? undefined
      },
      enumerable: false,
    })
  }
}
