export { vike }

import type { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { createServerResponse } from '../adapters/createServerResponse.js'
import { createHandler } from '../handler.js'
import type { VikeOptions } from '../types.js'
import { globalStore } from '../globalStore.js'

/**
 * Creates a Fastify plugin to handle Vike requests and Hot Module Replacement (HMR).
 *
 * @param {VikeOptions<FastifyRequest>} [options] - Configuration options for Vike.
 *
 * @returns {FastifyPluginCallback} A Fastify plugin that handles all GET requests and processes them with Vike.
 *
 * @description
 * This function creates a Fastify plugin that integrates Vike's server-side rendering capabilities
 * and handles Hot Module Replacement (HMR) for development environments. The plugin:
 * 1. Checks for and handles HMR WebSocket upgrade requests.
 * 2. Processes regular requests using Vike's handler.
 * 3. If Vike doesn't handle the request, it calls Fastify's `reply.callNotFound()`.
 *
 * @example
 * ```js
 * import fastify from 'fastify'
 * import { vike } from 'vike-node/fastify'
 *
 * const app = fastify()
 * app.register(vike())
 * ```
 *
 */
function vike(options?: VikeOptions<FastifyRequest>): FastifyPluginCallback {
  const handler = createHandler(options)
  return function plugin(instance, _options, done) {
    instance.get('*', async (req, reply) => {
      const handled = globalStore.HMRProxy(req.raw, reply.raw)
      if (handled) {
        return
      }
      const { res, onReadable } = createServerResponse(req.raw)
      ;(async () => {
        const { readable, headers, statusCode } = await onReadable
        reply.code(statusCode)
        reply.headers(headers)
        reply.send(readable)
      })()
      await handler({
        req: req.raw,
        res,
        platformRequest: req,
        next() {
          reply.callNotFound()
        }
      })
    })

    done()
  }
}
