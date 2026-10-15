// https://vike.dev/serverEntry#example-websockets
// There isn't any +server.js => `$ vike dev` runs this file as well

import { createServer } from 'node:http'
import { getRequestListener } from '@hono/node-server'
import { Hono } from 'hono'
import vike from '@vikejs/hono'
import sirv from 'sirv'
import { WebSocketServer } from 'ws'
import { getGlobalContext } from 'vike'

const app = new Hono()
vike(app)

// Vite's development middleware, or the static assets (dist/client/) in production
const { devMiddleware } = await getGlobalContext()
const assets = devMiddleware ?? sirv(`${import.meta.dirname}/../client`)

// Node.js's HTTP server, using Hono for everything else
const listener = getRequestListener(app.fetch)
const server = createServer((req, res) => assets(req, res, () => listener(req, res)))
// Not in the docs example: the test waits for this log
server.listen(3000, () => console.log('Server running at http://localhost:3000'))

// WebSockets — the same code in development and production
const wss = new WebSocketServer({ server, path: '/ws' })
wss.on('connection', (ws) => {
  ws.on('message', (message) => ws.send(`echo: ${message}`))
})
