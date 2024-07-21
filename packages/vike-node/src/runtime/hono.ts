export { vike }
import type { HonoRequest, MiddlewareHandler } from 'hono'
import { IncomingMessage, ServerResponse } from 'http'
import { assert } from '../utils/assert.js'
import { createHandler } from './handler.js'
import type { VikeOptions } from './types.js'

function vike(options?: VikeOptions): MiddlewareHandler {
  const handler = createHandler<HonoRequest>(options)
  return async function middleware(ctx, next) {
    const reqSymbol = Object.getOwnPropertySymbols(ctx.req.raw).find((symbol) => symbol.description === 'incomingKey')
    assert(reqSymbol && reqSymbol in ctx.req.raw)
    const req = (ctx.req.raw as any)[reqSymbol] as IncomingMessage
    const res = (req.socket as any)._httpMessage as ServerResponse
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
