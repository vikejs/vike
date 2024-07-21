export { vike }

import type { IncomingMessage, ServerResponse } from 'http'
import { createHandler } from './handler.js'
import type { NextFunction, VikeOptions } from './types.js'

function vike<PlatformRequest extends IncomingMessage, PlatformResponse extends ServerResponse>(
  options?: VikeOptions<PlatformRequest>
): (req: PlatformRequest, res: PlatformResponse, next?: NextFunction) => void {
  const handler = createHandler(options)
  return function middleware(req, res, next): void {
    handler({
      req,
      res,
      next,
      platformRequest: req
    })
  }
}
