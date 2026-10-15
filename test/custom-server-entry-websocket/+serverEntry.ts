// https://vike.dev/serverEntry#example-websockets
// There isn't any +server.js => `$ vike dev` runs this file as well

import { serve } from 'crossws/server'
import { getGlobalContext } from 'vike'
import { Hono } from 'hono'
import vike from '@vikejs/hono'
import { fetchNodeHandler } from 'srvx/node'
import { staticMiddleware } from 'srvx/static'
import assert from 'node:assert'
import type { IncomingMessage, ServerResponse } from 'node:http'

const globalContext = await getGlobalContext()

const app = new Hono()
vike(app)

// crossws's serve() is srvx's serve() with WebSocket support
serve({
  port: 3000,
  websocket: {
    upgrade(request) {
      // Only accept WebSocket connections to /ws
      if (new URL(request.url).pathname !== '/ws') throw new Response('Not Found', { status: 404 })
    },
    message(peer, message) {
      peer.send(`echo: ${message.text()}`)
    },
  },
  // Serve the static assets (dist/client/)
  middleware: import.meta.env.DEV ? [] : [staticMiddleware({ dir: `${import.meta.dirname}/../client` })],
  async fetch(request) {
    if (import.meta.env.DEV) {
      // Vite's development middleware, see https://vike.dev/serverEntry#example-bun
      const { devMiddleware } = globalContext
      assert(devMiddleware)
      let handled = true
      const response = await fetchNodeHandler(
        (req: IncomingMessage, res: ServerResponse, next?: () => void) =>
          devMiddleware(req, res, () => {
            handled = false
            next?.()
          }),
        request,
      )
      if (handled) return response
    }
    return app.fetch(request)
  },
  // Not in the docs example: like @universal-deploy/node (srvx logs to stderr upon graceful shutdown)
  gracefulShutdown: false,
})
