// https://vike.dev/server

import { Hono } from 'hono'
import vike from '@vikejs/hono'
import { WebSocketServer } from 'ws'
import type { Server } from 'vike/types'

const app = new Hono()
vike(app)

const wss = new WebSocketServer({ noServer: true })
wss.on('connection', (ws) => {
  ws.on('message', (data) => ws.send(`echo: ${data}`))
})

export default {
  fetch: app.fetch,
  // https://vike.dev/server#websockets
  upgrade(req, socket, head) {
    if (req.url !== '/ws') return
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req))
  },
} satisfies Server
