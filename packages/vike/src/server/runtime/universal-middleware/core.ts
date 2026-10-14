export { getMiddlewares_globalContext }
export { getMiddlewares_withErrorHandling }
export { hasPlusMiddlewares }
export { routeCatchAll }
export { mergeContext }
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
  runsSymbol,
  type EnhancedMiddleware,
  type RuntimeAdapterTarget,
  type UniversalMiddleware,
  type UniversalOptionsArg,
} from '@universal-middleware/core'
import { parseUrl } from '../../../utils/parseUrl.js'
import { prependBase } from '../../../utils/parseUrl-extras.js'
import { handlePageContextRequestUrl } from '../renderPageServer/handlePageContextRequestUrl.js'
import { renderPageServer } from '../renderPageServer.js'
import { getGlobalContextServerInternal, initGlobalContext_renderPage } from '../globalContext.js'
import { getVikeConfigError } from '../../../shared-server-node/getVikeConfigError.js'
import { assertWarning } from '../../../utils/assert.js'
import pc from '@brillout/picocolors'
import type { ConfigResolved } from '../../../types/Config/ConfigResolved.js'
import '../../assertEnvServer.js'

type Middleware = EnhancedMiddleware & { isHandler: boolean }

const routeCatchAll = {
  name: 'vike',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  path: '/**',
} as const satisfies UniversalOptionsArg

// Vike's pages
const renderPageServer_universalMiddleware = enhance(renderPageServer_universal, routeCatchAll)

// `globalContext.middlewares` — every `+middleware` and Vike's handler that renders pages
function getMiddlewares_globalContext(globalContext: { config: ConfigResolved }, baseServer: string): Middleware[] {
  return [
    ...getMiddlewares_config(globalContext).map((plusMiddleware) =>
      wrapWithVikeNormalizedURL(plusMiddleware, baseServer),
    ),
    renderPageServer_universalMiddleware,
  ].map(withIsHandler)
}

// Retruns globalContext.middlewares, or middlewares_fallbackUponConfigError upon an invalid config
async function getMiddlewares_withErrorHandling(): Promise<Middleware[]> {
  if (getVikeConfigError()) return middlewares_errorHandling
  try {
    await initGlobalContext_renderPage()
  } catch {
    return middlewares_errorHandling
  }
  if (getVikeConfigError()) return middlewares_errorHandling
  const { globalContext } = await getGlobalContextServerInternal()
  return globalContext.middlewares
}
// Upon an invalid config: answer every request with the error
const middlewares_errorHandling = [enhance(renderPageServer_universal, { name: 'vike:error-handling' })].map(
  withIsHandler,
)

async function renderPageServer_universal(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<unknown>,
) {
  const pageContextInit = {
    urlOriginal: request.url, // Let `context` override it, e.g. `$ vike dev` passes the URL's path
    runtime,
    req: 'req' in runtime ? runtime.req : null,
    res: 'res' in runtime ? runtime.res : null,
    headersOriginal: request.headers,
    ...context,
  }
  addUserAgent_deprecated(pageContextInit, request, runtime)
  const pageContext = await renderPageServer(pageContextInit, false)
  const { httpResponse } = pageContext
  return new Response(httpResponse.getReadableWebStream(), {
    status: httpResponse.statusCode,
    headers: httpResponse.headers,
  })
}

// List of +middleware
function getMiddlewares_config(globalContext: { config: ConfigResolved }): EnhancedMiddleware[] {
  return (globalContext.config.middleware ?? []).flat()
}
// Does a +middleware exist?
function hasPlusMiddlewares(globalContext: { config: ConfigResolved }) {
  return getMiddlewares_config(globalContext).length > 0
}

// Handle:
// - Base URL
// - JSON URL `.pageContext.json`
function wrapWithVikeNormalizedURL(plusMiddleware: EnhancedMiddleware, baseServer: string): EnhancedMiddleware {
  const { path, method, ...options } = getOptions(plusMiddleware)
  if (path) assertPath(options.name, path, baseServer)
  if (isHandler(plusMiddleware)) {
    // A handler is a route of the server, which matches it: its path gets the Base URL. (`enhance()` clones it, so that marking it `isHandler` leaves the extension's export untouched.)
    return enhance(
      plusMiddleware as UniversalMiddleware,
      path ? { path: prependBase(path.startsWith('/') ? path : `/${path}`, baseServer) } : {},
    )
  }
  const isMatch = path && createMatcher(path, method)
  const plusMiddlewareMerged = mergeContext(plusMiddleware)
  return enhance(
    async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
      const { isPageContextJsonRequest, urlWithoutPageContextRequestSuffix } = handlePageContextRequestUrl(request.url)
      if (isMatch) {
        const { href, isBaseMissing } = parseUrl(urlWithoutPageContextRequestSuffix, baseServer)
        if (isBaseMissing || !isMatch(new Request(href, { method: request.method }))) return
      }
      const answer = await getUniversal(plusMiddlewareMerged)(request, context, runtime)
      return isPageContextJsonRequest ? toPageContextJsonAnswer(answer) : answer
    },
    {
      ...options,
      // Whatever its order, it doesn't run once a Response exists
      runs: 'until-response',
    },
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
    // Vike's JSON, possibly re-encoded, keeps its status and its JSON Content-Type
    const isVikeJson =
      replaced?.status === response.status && replaced.headers.get('content-type')?.includes('application/json')
    return replaced && (isVikeJson ? replaced : toReload(replaced))
  }
}
// Warns about a path that starts with the Base URL
function assertPath(name: string | undefined, path: string, baseServer: string): void {
  const base = baseServer.replace(/\/$/, '')
  if (!base || (path !== base && !path.startsWith(`${base}/`))) return
  assertWarning(
    false,
    `The +middleware ${name ? `${name} ` : ''}has the path ${path}, which starts with the Base URL ${baseServer}. A +middleware path is relative to the Base URL, use ${path.slice(base.length) || '/'} instead.`,
    { onlyOnce: `middleware-path:${name}:${path}` },
  )
}

// Universal Middleware replaces the context with the one a middleware returns: Vike merges it into a new object, as a
// +middleware or a user-land universal middleware returns only what it adds, and an adapter may reuse the context
function mergeContext(middleware: EnhancedMiddleware): UniversalMiddleware {
  return enhance(async (request: Request, context: Universal.Context, runtime: RuntimeAdapterTarget<unknown>) => {
    const result = await getUniversal(middleware as UniversalMiddleware)(request, context, runtime)
    if (!result || result instanceof Response || typeof result === 'function') return result
    return { ...context, ...result }
  }, getOptions(middleware))
}

// The options `enhance()` gave a middleware, also when an adapter wraps it, without the unset ones: Universal Middleware sorts an `order` set to `undefined` as `NaN`
function getOptions(middleware: EnhancedMiddleware): UniversalOptionsArg {
  const options: UniversalOptionsArg = {
    name: getUniversalProp(middleware, nameSymbol),
    path: getUniversalProp(middleware, pathSymbol),
    method: getUniversalProp(middleware, methodSymbol),
    order: getUniversalProp(middleware, orderSymbol),
    runs: getUniversalProp(middleware, runsSymbol),
  }
  return Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined))
}

function withIsHandler(middleware: EnhancedMiddleware): Middleware {
  return Object.assign(middleware, { isHandler: isHandler(middleware) })
}

function addUserAgent_deprecated(pageContextInit: object, request: Request, runtime: RuntimeAdapterTarget<unknown>) {
  // Backwards compatibility for `$ vike dev` and `$ vike preview`
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
