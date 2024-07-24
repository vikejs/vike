export { vike }

import type { HonoRequest, MiddlewareHandler } from 'hono'
import type { IncomingMessage, ServerResponse } from 'http'
import { connectToWeb } from '../adapters/connectToWeb.js'
import { globalStore } from '../globalStore.js'
import { createHandler } from '../handler.js'
import type { VikeOptions } from '../types.js'

/**
 * Creates a Hono middleware to handle Vike requests and HMR (Hot Module Replacement).
 *
 * @param {VikeOptions} [options] - Configuration options for Vike.
 *
 * @returns {MiddlewareHandler} A Hono middleware function that processes requests with Vike.
 *
 * @description
 * This function creates a Hono middleware that integrates Vike's server-side rendering capabilities
 * and handles Hot Module Replacement (HMR) for development environments. The middleware:
 *
 * 1. Checks for and handles HMR WebSocket upgrade requests.
 * 2. Processes regular requests using Vike's handler.
 * 3. Adapts Node.js-style request handling to work with Web standard Response objects.
 * 4. Allows pass-through to next middleware if Vike doesn't handle the request.
 *
 * @example
 * ```js
 * import { Hono } from 'hono'
 * import { vike } from 'vike-node/hono'
 *
 * const app = new Hono()
 * app.use('*', vike())
 * ```
 *
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
