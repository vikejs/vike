import '../assertEnvServer.js'
import { getAdapterRuntime, type EnhancedMiddleware, type RuntimeAdapter } from '@universal-middleware/core'
import vikeHandler from './universal-middleware.js'
import { getUniversalMiddlewares } from './getUniversalMiddlewares.js'
import { runUniversalMiddlewares } from './runUniversalMiddlewares.js'

// Zero-config `fetch` handler: applies the app's `+middleware` (Universal Middlewares) to *all*
// requests, then renders the page.
async function fetch(request: Request, context?: Universal.Context, runtime?: RuntimeAdapter): Promise<Response> {
  const ctx = context ?? {}
  const rt = runtime ?? getAdapterRuntime('other', { params: undefined })

  let middlewares: EnhancedMiddleware[] = []
  try {
    middlewares = await getUniversalMiddlewares()
  } catch {
    // Vike config errors are surfaced (and logged) by the Vike handler below.
  }

  if (middlewares.length === 0) return vikeHandler(request, ctx, rt)
  // `vikeHandler` is the terminal handler, so a `Response` is always returned.
  return (await runUniversalMiddlewares(middlewares, request, ctx, rt, vikeHandler))!
}

export default {
  fetch,
}
