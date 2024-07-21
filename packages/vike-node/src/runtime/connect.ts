export { vike }

import type { IncomingMessage, ServerResponse } from 'http'
import { createHandler } from './handler.js'
import type { NextFunction, VikeOptions } from './types.js'

function vike<PlatformRequest extends IncomingMessage, PlatformResponse extends ServerResponse>(
  options?: VikeOptions<PlatformRequest>
): (req: PlatformRequest, res: PlatformResponse, next?: NextFunction) => void {
  const handler = createHandler(options)
  return async function middleware(req, res, next) {
    const handled = await handler({
      req,
      res,
      platformRequest: req
    })
    if (!handled && next) {
      next()
    }
  }
}
