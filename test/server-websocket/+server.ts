// https://vike.dev/server#websockets

import vike from 'vike/fetch'
import { plugin as ws } from 'crossws/server'
import type { Server } from 'vike/types'
import { websocket } from './server/websocket'

export default {
  fetch: (request) => vike.fetch(request),
  prod: {
    // Production (development: see vite.config.ts)
    plugins: [ws(websocket)],
  },
} satisfies Server
