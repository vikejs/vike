export { vike }

import type { RequestHandler } from '@hattip/compose'
import type { IncomingMessage, ServerResponse } from 'http'
import { createHandler } from './handler.js'
import type { VikeOptions } from './types.js'
import { connectToWeb } from './web.js'
import { VITE_HMR_PATH } from '../constants.js'

/**
 * Creates a Vike middleware for HatTip
 * @param options - Configuration options for Vike
 * @returns A HatTip RequestHandler
 */
function vike(options?: VikeOptions): RequestHandler {
  const handler = createHandler<Request>(options)
  return async function middleware(ctx) {
    if (ctx.url.pathname === VITE_HMR_PATH) {
      // Handle Vite HMR websocket proxy
      const { request, response } = ctx.platform as { request: IncomingMessage; response: ServerResponse }
      const handled = await handler({
        req: request,
        res: response,
        platformRequest: ctx.request
      })
      if (handled) {
        response.setHeader = () => response
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
