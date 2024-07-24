export { vike }

import type { IncomingMessage, ServerResponse } from 'http'
import { globalStore } from '../globalStore.js'
import { createHandler } from '../handler.js'
import type { NextFunction, VikeOptions } from '../types.js'

/**
 * Creates middleware for Express-like frameworks to handle Vike requests.
 *
 * @template PlatformRequest - The type of the request object, extending IncomingMessage.
 * @template PlatformResponse - The type of the response object, extending ServerResponse.
 *
 * @param {VikeOptions<PlatformRequest>} [options] - Configuration options for Vike.
 *
 * @returns {Array<(req: PlatformRequest, res: PlatformResponse, next?: NextFunction) => void>}
 * An array of middleware functions:
 * - The first element is the HMR proxy middleware.
 * - The second element is the main Vike request handler middleware.
 *
 * @example
 * ```js
 * import express from 'express'
 * import { vike } from 'vike-node/connect'
 *
 * const app = express()
 * app.use(vike())
 * ```
 */
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
