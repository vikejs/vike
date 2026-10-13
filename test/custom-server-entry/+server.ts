// https://vike.dev/server

import { Hono } from 'hono'
import { apply } from '@universal-middleware/hono'
import type { Server } from 'vike/types'
import { getGlobalContextAsync } from 'vike'
import assert from 'node:assert'

// Awaiting the global context at the top level mustn't deadlock
const globalContext = await getGlobalContextAsync(process.env.NODE_ENV === 'production')
assert(!globalContext.isClientSide)
const { middlewares } = globalContext

// https://vike.dev/middleware#manual-integration
const app = new Hono()
apply(
  app,
  middlewares.filter((m) => !m.isHandler),
)
app.get('/hello', (c) => c.text('Hello from +server.ts'))
app.get('/api/me', (c) => c.text('Me'))
apply(
  app,
  middlewares.filter((m) => m.isHandler),
)

export default {
  fetch: app.fetch,
} satisfies Server
