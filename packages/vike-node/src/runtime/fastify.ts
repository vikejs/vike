export { vike }

import type { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import { ServerResponse, type IncomingMessage, type OutgoingHttpHeader, type OutgoingHttpHeaders } from 'http'
import type { Socket } from 'net'
import { Duplex, PassThrough } from 'stream'
import { assert } from '../utils/assert.js'
import { createHandler } from './handler.js'
import type { VikeOptions } from './types.js'

function vike(options?: VikeOptions<FastifyRequest>): FastifyPluginCallback {
  const handler = createHandler(options)
  return function plugin(instance, _options, done) {
    instance.get('*', (req, reply) =>
      handler({
        req: req.raw,
        // FastifyServerResponse solves the following issue:
        // https://fastify.dev/docs/latest/Reference/Reply/#raw
        res: new FastifyServerResponse(req.raw, reply),
        platformRequest: req
      })
    )
    done()
  }
}

class FastifyServerResponse extends ServerResponse {
  private reply: FastifyReply
  constructor(incomingMessage: IncomingMessage, reply: FastifyReply) {
    super(incomingMessage)
    this.reply = reply
    this.assignSocket(new PassThrough() as Duplex as Socket)
    this.once('finish', () => {
      assert(this.socket)
      this.socket.end()
    })
    assert(this.socket)
    this.socket.on('drain', () => {
      this.emit('drain')
    })
  }

  sent = false
  writeHead(
    statusCode: number,
    statusMessage?: string | OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined,
    headers?: OutgoingHttpHeaders | OutgoingHttpHeader[] | undefined
  ) {
    // Don't write the actual headers to the response stream, instead we need to pass them to FastifyReply
    // (don't call super.writeHead, because that could send the headers to the response stream)
    this.statusCode = statusCode
    this.reply.code(statusCode)
    if (typeof statusMessage === 'object') {
      headers = statusMessage
      statusMessage = undefined
    }
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (value !== undefined) {
          this.setHeader(key, value)
        }
      })
    }

    Object.entries(this.getHeaders()).forEach(([key, value]) => {
      this.reply.header(key, value)
    })

    if (!this.sent) {
      this.sent = true
      this.reply.send(this.socket)
    }

    return this
  }
}
