// https://vike.dev/server

import { Hono } from 'hono'
import vike from '@vikejs/hono'
import type { Server } from 'vike/types'

const app = new Hono()
app.get('/hello', (c) => c.text('Hello from +server.ts'))
vike(app)

export default {
  fetch: app.fetch,
} satisfies Server
