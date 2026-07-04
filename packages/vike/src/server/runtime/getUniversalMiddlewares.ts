export { getUniversalMiddlewares }
export { universalMiddleware }

import { getGlobalContextServerInternal, initGlobalContext_renderPage } from './globalContext.js'
import { runUniversalMiddlewares } from './runUniversalMiddlewares.js'
import { enhance, type EnhancedMiddleware } from '@universal-middleware/core'
import '../assertEnvServer.js'

/**
 * Get the list of Universal Middlewares defined by your app via the `+middleware` setting.
 *
 * Apply them to your server in order to run your `+middleware` for *all* HTTP requests (instead of
 * only the requests that render a page).
 *
 * For most servers, prefer the ready-to-use {@link universalMiddleware} which resolves the list
 * lazily (upon the first request). Resolving it eagerly (`await getUniversalMiddlewares()` at
 * startup) deadlocks Vike's development server, which awaits your server entry to finish loading.
 *
 * @example
 * ```js
 * import { apply } from '@universal-middleware/express'
 * import { getUniversalMiddlewares } from 'vike/getUniversalMiddlewares'
 * import vikeHandler from 'vike/universal-middleware'
 *
 * apply(app, [...(await getUniversalMiddlewares()), vikeHandler])
 * ```
 *
 * https://github.com/magne4000/universal-middleware
 */
async function getUniversalMiddlewares(): Promise<EnhancedMiddleware[]> {
  await initGlobalContext_renderPage()
  const { globalContext } = await getGlobalContextServerInternal()
  return (globalContext.config.middleware ?? []).flat()
}

/**
 * A ready-to-use Universal Middleware that applies your app's `+middleware` to *all* HTTP requests.
 *
 * Register it before Vike's render handler. If one of your `+middleware` returns a `Response`, it
 * short-circuits; otherwise the request falls through to the next handler.
 *
 * Your `+middleware` are resolved *lazily* (upon the first request): unlike
 * {@link getUniversalMiddlewares}, this can safely be registered at server startup, including in
 * Vike's development server.
 *
 * @example
 * ```js
 * import { apply } from '@universal-middleware/express'
 * import { universalMiddleware } from 'vike/getUniversalMiddlewares'
 * import vikeHandler from 'vike/universal-middleware'
 *
 * apply(app, [universalMiddleware, vikeHandler])
 * ```
 *
 * https://github.com/magne4000/universal-middleware
 */
const universalMiddleware: EnhancedMiddleware = enhance(
  async (request, context, runtime) => {
    const middlewares = await getUniversalMiddlewares()
    if (middlewares.length === 0) return
    const response = await runUniversalMiddlewares(middlewares, request, context, runtime)
    // A `Response` short-circuits; `null` means no `+middleware` handled the request (fall through).
    return response ?? undefined
  },
  { name: 'vike:universal-middleware', immutable: true },
)
