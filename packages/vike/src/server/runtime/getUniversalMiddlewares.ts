export { getUniversalMiddlewares }

import { getGlobalContextServerInternal, initGlobalContext_renderPage } from './globalContext.js'
import type { EnhancedMiddleware } from '@universal-middleware/core'
import '../assertEnvServer.js'

/**
 * Get the list of Universal Middlewares defined by your app via the `+middleware` setting.
 *
 * Apply them to your server in order to run your `+middleware` for *all* HTTP requests (instead of
 * only the requests that render a page).
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
