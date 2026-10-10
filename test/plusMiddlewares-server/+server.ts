// A server that applies the +middleware itself: https://vike.dev/middleware#manual-integration
// With MIDDLEWARES=halves, it applies the two halves that `vike(app)` applies instead.

import { Hono } from 'hono'
import { apply } from '@universal-middleware/hono'
import { getGlobalContext } from 'vike'
import { middlewaresProxy_handlers, middlewaresProxy_middlewares } from 'vike/__internal'
import vike from 'vike/fetch'
import type { Server } from 'vike/types'
import assert from 'node:assert'

const globalContext = await getGlobalContext()
assert(!globalContext.isClientSide)
const { middlewares } = globalContext
const halves = process.env.MIDDLEWARES === 'halves'

const app = new Hono()
apply(app, halves ? [middlewaresProxy_middlewares] : middlewares.filter((m) => !m.isHandler))
// The app's own routes
app.get('/api/me', (c) => c.text('Me'))
app.get('/overridden', (c) => c.text('Overridden by +server.ts'))
// `vike.fetch(request)` with the request alone, as /server documents
app.get('/vike-fetch', (c) => vike.fetch(new Request(new URL('/', c.req.url), { headers: c.req.raw.headers })))
// A context shared by all requests, like a Cloudflare worker's `env`
const sharedContext = {}
app.get('/shared-context', (c) =>
  vike.fetch(new Request(new URL('/', c.req.url), { headers: c.req.raw.headers }), sharedContext),
)
apply(app, halves ? [middlewaresProxy_handlers] : middlewares.filter((m) => m.isHandler))

export default {
  fetch: app.fetch,
} satisfies Server
