export { vike }

import type { HonoRequest, MiddlewareHandler } from 'hono'
import { IncomingMessage, ServerResponse } from 'http'
import { createHandler } from './handler.js'
import type { VikeOptions } from './types.js'

function vike(options?: VikeOptions): MiddlewareHandler {
  const handler = createHandler<HonoRequest>(options)
  return async function middleware(ctx, next) {
    const req = ctx.env.incoming as IncomingMessage
    const res = ctx.env.outgoing as ServerResponse
    const handled = await handler({
      req,
      res,
      platformRequest: ctx.req
    })
    if (handled) {
      res.writeHead = (() => {}) as any
      res.write = (() => {}) as any
      return new Response()
    } else {
      await next()
    }
  }
}
