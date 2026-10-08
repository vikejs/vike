export type { Server }

import type { IncomingMessage } from 'node:http'
import type { Duplex } from 'node:stream'
import type { Fetchable, ServerOptions } from '@universal-deploy/store'

/**
 * Server settings.
 *
 * https://vike.dev/server
 */
interface Server extends Fetchable {
  prod?: Omit<ServerOptions, 'fetch'> & { static?: boolean | string }
  /**
   * Handle HTTP upgrade requests (e.g. WebSocket connections), in development and in production.
   *
   * Same arguments as Node.js's `'upgrade'` event. (Vite's HMR requests are handled by Vite.)
   *
   * https://vike.dev/server#websockets
   */
  upgrade?: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
}
