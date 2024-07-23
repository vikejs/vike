export { vike }

import type { IncomingMessage, ServerResponse } from 'http'
import { globalStore } from '../globalStore.js'
import { createHandler } from '../handler.js'
import type { NextFunction, VikeOptions } from '../types.js'

function vike<PlatformRequest extends IncomingMessage, PlatformResponse extends ServerResponse>(
  options?: VikeOptions<PlatformRequest>
): ((req: PlatformRequest, res: PlatformResponse, next?: NextFunction) => void)[] {
  const handler = createHandler(options)
  return [
    globalStore.HMRProxy,
    (req, res, next) => {
      handler({
        req,
        res,
        next,
        platformRequest: req
      })
    }
  ]
}
