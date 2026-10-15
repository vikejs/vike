// https://vike.dev/server#websockets

import { plugin as ws } from 'crossws/server'
import type { Server } from 'vike/types'
import { websocket } from './server/websocket'

// Unlike the docs example, there isn't any `fetch` => Vike's built-in server handles the requests
export default {
  prod: {
    // Production (development: see vite.config.ts)
    plugins: [ws(websocket)],
  },
} satisfies Server
