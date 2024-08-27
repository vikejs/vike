export { vike }

import type { Context, MiddlewareHandler } from 'hono'
import type { IncomingMessage } from 'http'
import { globalObject } from 'vike-node-dev/__internal'
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
function vike(options?: VikeOptions<Context>): MiddlewareHandler {
  let handler: ReturnType<typeof import('vike-node/__handler').createHandler<Context>> | undefined = undefined
  return async function middleware(ctx, next) {
    if (ctx.env.incoming) {
      const req = ctx.env.incoming as IncomingMessage
      globalObject.setupHMRProxy(req)
    }

    if (!handler) {
      const { createHandler } = await import('vike-node/__handler')
      handler = createHandler(options)
    }
    const response = await handler({
      request: ctx.req.raw,
      platformRequest: ctx
    })

    if (response) {
      return response
    }

    // If not handled by Vike, continue to next middleware
    await next()
  }
}
