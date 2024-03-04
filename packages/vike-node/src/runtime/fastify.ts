export { vike }

import type { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { createHandler } from './handler.js'
import type { VikeOptions } from './types.js'

function vike(options?: VikeOptions<FastifyRequest>): FastifyPluginCallback {
  const handler = createHandler(options)
  return function plugin(instance, _options, done) {
    instance.get('*', (req, reply) =>
      handler({
        req: req.raw,
        res: reply.raw,
        platformRequest: req
      })
    )
    done()
  }
}
