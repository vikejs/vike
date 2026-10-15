// https://vike.dev/serverEntry#example-websockets
// There isn't any +server.js => `$ vike dev` runs this file as well

import express from 'express'
import vike from '@vikejs/express'
import { WebSocketServer } from 'ws'
import { getGlobalContext } from 'vike'

const app = express()

// Vite's development middleware, or the static assets (dist/client/) in production
const { devMiddleware } = await getGlobalContext()
app.use(devMiddleware ?? express.static(`${import.meta.dirname}/../client`))

vike(app)

// Not in the docs example: the test waits for this log
const server = app.listen(3000, () => console.log('Server running at http://localhost:3000'))

// WebSockets — the same code in development and production
const wss = new WebSocketServer({ server, path: '/ws' })
wss.on('connection', (ws) => {
  ws.on('message', (message) => ws.send(`echo: ${message}`))
})
