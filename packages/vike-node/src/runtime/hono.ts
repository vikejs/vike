export { vike }

import type { HonoRequest, MiddlewareHandler } from 'hono'
import type { IncomingMessage, ServerResponse } from 'http'
import { createHandler } from './handler.js'
import type { VikeOptions } from './types.js'
import { connectToWeb } from './web.js'
import { VITE_HMR_PATH } from '../constants.js'

/**
 * Creates a Vike middleware for Hono
 * @param options Vike options
 * @returns A Hono middleware handler
 */
function vike(options?: VikeOptions): MiddlewareHandler {
  const handler = createHandler<HonoRequest>(options)
  return async function middleware(ctx, next) {
    const req = ctx.env.incoming as IncomingMessage
    const res = ctx.env.outgoing as ServerResponse

    if (ctx.req.path === VITE_HMR_PATH) {
      // Handle Vite HMR websocket proxy
      const handled = await handler({
        req,
        res,
        platformRequest: ctx.req
      })
      if (handled) {
        res.writeHead = () => res
        return new Response()
      }
    } else {
      // Handle regular requests
      const response = await connectToWeb((req, res, next) =>
        handler({
          req,
          res,
          next,
          platformRequest: ctx.req
        })
      )(ctx.req.raw)

      if (response) {
        return response
      }
    }

    // If not handled by Vike, continue to next middleware
    await next()
  }
}
