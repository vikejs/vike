export { vike }

import { eventHandler, EventHandler } from 'h3'
import type { IncomingMessage } from 'node:http'
import { globalObject } from 'vike-node-dev/__internal'
import { createHandler } from '../handler-node-only.js'
import type { VikeOptions } from '../types.js'

/**
 * Creates an h3 event handler to process Vike requests.
 *
 * @param {VikeOptions<IncomingMessage>} [options] - Configuration options for Vike.
 *
 * @returns {EventHandler} An h3 event handler that processes requests with Vike.
 *
 * @description
 * This function creates an h3 event handler that integrates Vike's server-side rendering capabilities.
 * The handler:
 * 1. Checks for and handles HMR WebSocket upgrade requests.
 * 2. Processes regular requests using Vike's handler.
 *
 * @example
 * ```js
 * import { createApp } from 'h3'
 * import { vike } from 'vike-node/h3'
 *
 * const app = createApp()
 * app.use(vike())
 *
 * ```
 *
 * @remarks
 * - This handler directly uses Node.js' IncomingMessage and ServerResponse objects from the h3 event.
 *
 */
function vike(options?: VikeOptions<IncomingMessage>): EventHandler {
  const handler = createHandler(options)
  return eventHandler(async (event) => {
    const {
      node: { req, res }
    } = event

    globalObject.setupHMRProxy(req)
    await handler({
      req,
      res,
      platformRequest: req
    })
  })
}
