// A server that applies the +middleware itself: https://vike.dev/middleware#manual-integration

import { Hono } from 'hono'
import { apply } from '@universal-middleware/hono'
import { getGlobalContext } from 'vike'
import type { Server } from 'vike/types'
import assert from 'node:assert'

const globalContext = await getGlobalContext()
assert(!globalContext.isClientSide)
const { middlewares } = globalContext

const app = new Hono()
apply(
  app,
  middlewares.filter((m) => !m.isHandler),
)
// The app's own routes
app.get('/api/me', (c) => c.text('Me'))
app.get('/overridden', (c) => c.text('Overridden by +server.ts'))
apply(
  app,
  middlewares.filter((m) => m.isHandler),
)

export default {
  fetch: app.fetch,
} satisfies Server
