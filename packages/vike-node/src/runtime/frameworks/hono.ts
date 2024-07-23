export { vike }

import type { HonoRequest, MiddlewareHandler } from 'hono'
import type { IncomingMessage, ServerResponse } from 'http'
import { connectToWeb } from '../adapters/connectToWeb.js'
import { globalStore } from '../globalStore.js'
import { createHandler } from '../handler.js'
import type { VikeOptions } from '../types.js'

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
    const handled = globalStore.HMRProxy(req, res)

    if (handled) {
      res.writeHead = () => res
      return new Response()
    }

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

    // If not handled by Vike, continue to next middleware
    await next()
  }
}
