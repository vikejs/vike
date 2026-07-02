export { addUniversalMiddlewares }

import type { ViteDevServer } from 'vite'
import { getAdapterRuntime, type EnhancedMiddleware } from '@universal-middleware/core'
import { createRequestAdapter } from '@universal-middleware/node/request'
import { sendResponse, setResponseHeaders } from '@universal-middleware/node/response'
import { getUniversalMiddlewares } from '../../../server/runtime/getUniversalMiddlewares.js'
import { runUniversalMiddlewares } from '../../../server/runtime/runUniversalMiddlewares.js'
import '../assertEnvVite.js'
type ConnectServer = ViteDevServer['middlewares']

const requestAdapter = createRequestAdapter()

// Applies the app's `+middleware` (Universal Middlewares) to *all* URLs reaching Vike's dev/preview
// server, before the SSR middleware. This matches production, where `+middleware` is applied
// independently of page rendering.
function addUniversalMiddlewares(middlewares: ConnectServer) {
  middlewares.use(async (req, res, next) => {
    if (res.headersSent) return next()

    let universalMiddlewares: EnhancedMiddleware[]
    try {
      universalMiddlewares = await getUniversalMiddlewares()
    } catch {
      // Vike config errors are surfaced by the SSR middleware (renderPage()).
      return next()
    }
    if (universalMiddlewares.length === 0) return next()

    const request = requestAdapter(req, res)
    const runtime = getAdapterRuntime('other', { params: undefined })
    let response: Response | null
    try {
      response = await runUniversalMiddlewares(universalMiddlewares, request, {}, runtime)
    } catch (err) {
      // Throwing in a Connect middleware shuts down the dev server.
      console.error(err)
      return next()
    }

    // No middleware handled the request: let the SSR middleware (and others) handle it.
    if (!response) return next()

    setResponseHeaders(response, res)
    await sendResponse(response, res)
  })
}
