export { runUniversalMiddlewares }

import {
  apply,
  enhance,
  universalSymbol,
  UniversalRouter,
  type EnhancedMiddleware,
  type HttpMethod,
  type RuntimeAdapter,
  type UniversalHandler,
} from '@universal-middleware/core'
import '../assertEnvServer.js'

// All HTTP methods, so that the fall-through sentinel matches every request.
// (Universal Middleware's `pipe()` throws `No Response found` when no terminal handler is reached.)
const httpMethods: HttpMethod[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']

/**
 * Run Universal Middlewares (`+middleware`) against a request, decoupled from page rendering.
 *
 * - If a middleware returns a `Response`, it's returned (short-circuit).
 * - Otherwise:
 *   - With `terminalHandler`, its `Response` is returned.
 *   - Without `terminalHandler`, `null` is returned and the caller should fall through to the next handler.
 */
async function runUniversalMiddlewares(
  middlewares: EnhancedMiddleware[],
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapter,
  terminalHandler?: EnhancedMiddleware,
): Promise<Response | null> {
  const router = new UniversalRouter(true, false)
  // Sentinel terminal handler representing "no middleware handled this request" (i.e. fall through).
  const fallThrough = new Response(null)
  const terminal =
    terminalHandler ??
    enhance(() => fallThrough, {
      name: 'vike:fall-through',
      method: httpMethods,
      path: '/**',
      immutable: true,
    })
  apply(router, [terminal, ...middlewares])
  const handler = router[universalSymbol] as UniversalHandler
  const response = await handler(request, context, runtime)
  if (!terminalHandler && response === fallThrough) return null
  return response
}
