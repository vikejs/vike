export { vike }

import type { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { createHandler } from './handler.js'
import type { VikeOptions } from './types.js'
import { createServerResponse } from './utils.js'

function vike(options?: VikeOptions<FastifyRequest>): FastifyPluginCallback {
  const handler = createHandler(options)
  return function plugin(instance, _options, done) {
    instance.get('*', async (req, reply) => {
      await handler({
        req: req.raw,
        res: createServerResponse(req.raw, ({ readable, headers, statusCode }) => {
          reply.code(statusCode)
          reply.headers(headers)
          reply.send(readable)
        }),
        platformRequest: req,
        next() {
          reply.callNotFound()
        }
      })
    })

    done()
  }
}
