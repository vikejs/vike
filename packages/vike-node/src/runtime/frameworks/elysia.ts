export { vike }

import { type Context, Elysia, NotFoundError } from 'elysia'
import { createHandler } from '../handler-web-and-node.js'
import type { VikeOptions } from '../types.js'

/**
 * Creates an Elysia plugin to handle Vike requests.
 *
 * @param {VikeOptions<Context>} [options] - Configuration options for Vike.
 *
 * @returns {Elysia} An Elysia plugin that handles all GET requests and processes them with Vike.
 *
 * @description
 * The plugin:
 * 1. Sets up a catch-all GET route handler that processes requests using Vike's handler.
 * 2. Throws a NotFoundError if Vike doesn't handle the request, allowing Elysia to manage 404 responses.
 *
 * @example
 * ```js
 * import { Elysia } from 'elysia'
 * import { vike } from 'vike-node/elysia'
 *
 * const app = new Elysia()
 * app.use(vike())
 * app.listen(3000)
 * ```
 *
 * @throws {NotFoundError} Thrown when Vike doesn't handle the request, allowing Elysia to manage 404 responses.
 */
function vike(options?: VikeOptions<Context>): Elysia {
  const handler = createHandler(options)
  return new Elysia({
    name: 'vike-node:elysia'
  }).get('*', async (ctx) => {
    const response = await handler({ request: ctx.request, platformRequest: ctx })

    if (response) {
      return response
    }

    throw new NotFoundError()
  })
}
