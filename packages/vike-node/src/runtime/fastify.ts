export { vike }

import type { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { createServerResponse } from './createServerResponse.js'
import { createHandler } from './handler.js'
import type { VikeOptions } from './types.js'

function vike(options?: VikeOptions<FastifyRequest>): FastifyPluginCallback {
  const handler = createHandler(options)
  return function plugin(instance, _options, done) {
    instance.get('*', async (req, reply) => {
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
