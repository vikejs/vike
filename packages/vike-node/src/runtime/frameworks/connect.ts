export { vike }

import type { IncomingMessage, ServerResponse } from 'http'
import { createHandler } from '../handler.js'
import type { NextFunction, VikeOptions } from '../types.js'
import { globalStore } from '../globalStore.js'

/**
 * Creates middleware for Express-like frameworks to handle Vike requests.
 *
 * @template PlatformRequest - The type of the request object, extending IncomingMessage.
 * @template PlatformResponse - The type of the response object, extending ServerResponse.
 *
 * @param {VikeOptions<PlatformRequest>} [options] - Configuration options for Vike.
 *
 * @returns {(req: PlatformRequest, res: PlatformResponse, next?: NextFunction) => void}
 * A single middleware function that handles Vike requests. This function:
 * 1. Checks for and handles HMR WebSocket upgrade requests.
 * 2. Processes regular requests using Vike's handler.
 * 3. Calls the next middleware if the request is not handled by Vike.
 *
 * @example
 * ```js
 * import express from 'express'
 * import { vike } from 'vike-node/connect'
 *
 * const app = express()
 * app.use(vike())
 * ```
 *
 */
function vike<PlatformRequest extends IncomingMessage, PlatformResponse extends ServerResponse>(
  options?: VikeOptions<PlatformRequest>
): (req: PlatformRequest, res: PlatformResponse, next?: NextFunction) => void {
  const handler = createHandler(options)
  return (req, res, next) => {
    const handled = globalStore.HMRProxy(req, res)
    if (handled) {
      next?.()
      return
    }

    handler({
      req,
      res,
      next,
      platformRequest: req
    })
  }
}
