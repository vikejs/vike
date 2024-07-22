export { vike }

import type { RequestHandler } from '@hattip/compose'
import type { IncomingMessage, ServerResponse } from 'http'
import { createHandler } from './handler.js'
import type { VikeOptions } from './types.js'
import { connectToWeb } from './web.js'

/**
 * Creates a Vike middleware for HatTip
 * @param options - Configuration options for Vike
 * @returns A HatTip RequestHandler
 */
function vike(options?: VikeOptions): RequestHandler {
  const handler = createHandler<Request>(options)
  return async function middleware(ctx) {
    if (ctx.url.pathname === '/__vite_hmr' && ctx.request.headers.get('connection') === 'Upgrade') {
      // Handle Vite HMR websocket proxy
      const { request, response } = ctx.platform as { request: IncomingMessage; response: ServerResponse }
      const handled = await handler({
        req: request,
        res: response,
        platformRequest: ctx.request
      })
      if (handled) {
        response.setHeader = (() => {}) as any
        return new Response()
      }
    } else {
      // Handle regular requests
      const response = await connectToWeb((req, res, next) =>
        handler({
          req,
          res,
          next,
          platformRequest: ctx.request
        })
      )(ctx.request)

      return response
    }
  }
}
