export { getRoutingRequest }
export { withOriginalRequest }
export { assertMiddlewarePath }

import {
  contextSymbol,
  enhance,
  getUniversal,
  getUniversalProp,
  methodSymbol,
  nameSymbol,
  orderSymbol,
  pathSymbol,
  type EnhancedMiddleware,
  type RuntimeAdapter,
} from '@universal-middleware/core'
import { pageContextJsonFileExtension } from '../../shared-server-client/getPageContextRequestUrl.js'
import { assertWarning } from '../../utils/assert.js'
import { parseUrl } from '../../utils/parseUrl.js'
import '../assertEnvServer.js'

// A `path` is matched against the page's URL, the way Vike routes pages: without the Base URL, and with a
// `.pageContext.json` request standing for its page. So `/dash` also covers `/base/dash` and `/dash/index.pageContext.json`,
// whatever pattern the path uses. The router only reads the URL and method; each +middleware gets the original request.
// The path stays percent-encoded until the router decodes it once: `/literal%25` must not become `/literal%`.
function getRoutingRequest(request: Request, baseServer: string): Request {
  const url = new URL(request.url)
  const suffix = `/index${pageContextJsonFileExtension}`
  if (url.pathname.endsWith(suffix)) url.pathname = url.pathname.slice(0, -suffix.length) || '/'
  const { href } = parseUrl(url.href, baseServer)
  return new Request(href, { method: request.method, headers: request.headers })
}

// The router passes the routing request to what it runs: this passes the original request instead
function withOriginalRequest(middleware: EnhancedMiddleware, request: Request): EnhancedMiddleware {
  return enhance(
    (_routingRequest: Request, context: Universal.Context, runtime: RuntimeAdapter) =>
      getUniversal(middleware)(request, context, runtime),
    {
      name: getUniversalProp(middleware, nameSymbol),
      order: getUniversalProp(middleware, orderSymbol),
      method: getUniversalProp(middleware, methodSymbol),
      path: getUniversalProp(middleware, pathSymbol),
      context: getUniversalProp(middleware, contextSymbol),
    },
  )
}

// A path is relative to the Base URL: a path that starts with it is probably meant to be the page's full URL
function assertMiddlewarePath(middleware: EnhancedMiddleware, baseServer: string): void {
  const path = getUniversalProp(middleware, pathSymbol)
  const base = baseServer.replace(/\/$/, '')
  if (!base || !path || (path !== base && !path.startsWith(`${base}/`))) return
  const name = getUniversalProp(middleware, nameSymbol)
  assertWarning(
    false,
    `The +middleware ${name ? `${name} ` : ''}has the path ${path}, which starts with the Base URL ${baseServer}. A +middleware path is relative to the Base URL, use ${path.slice(base.length) || '/'} instead.`,
    { onlyOnce: `middleware-path:${name}:${path}` },
  )
}
