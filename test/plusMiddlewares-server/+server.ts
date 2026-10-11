// A server that applies the +middleware itself: https://vike.dev/middleware#manual-integration
// With MIDDLEWARES=halves, it applies the two halves that `vike(app, appMiddlewares)` applies instead.
// With MIDDLEWARES=none, it applies no +middleware and calls renderPage() itself.

import { Hono } from 'hono'
import { enhance, MiddlewareOrder } from '@universal-middleware/core'
import { apply } from '@universal-middleware/hono'
import { getGlobalContext } from 'vike'
import { middlewaresProxy_handlers, middlewaresProxy_middlewares } from 'vike/__internal'
import vike from 'vike/fetch'
import { renderPage } from 'vike/server'
import type { Server } from 'vike/types'
import assert from 'node:assert'

const globalContext = await getGlobalContext()
assert(!globalContext.isClientSide)
const { middlewares } = globalContext
const mode = process.env.MIDDLEWARES
const halves = mode === 'halves'

// Sets a header on the response
const setHeader = (name: string, value: string) => (response: Response) => {
  response.headers.set(name, value)
  return response
}
// The app's middlewares, as in `vike(app, appMiddlewares)`: `userSeen` runs between the `user` and `auth` +middleware, and
// `late`'s Response comes after `auth`'s
const appMiddlewares = [
  enhance(() => setHeader('x-app', 'yes'), { name: 'appHeader' }),
  enhance(() => setHeader('x-api', 'yes'), {
    name: 'apiHeader',
    path: '/api/**',
    order: MiddlewareOrder.HEADER_MANAGEMENT,
  }),
  enhance((_request: Request, context: Universal.Context) => setHeader('x-user-seen', String(context.user)), {
    name: 'userSeen',
    order: MiddlewareOrder.AUTHENTICATION + 50,
  }),
  enhance((request: Request) => (request.headers.has('x-late') ? new Response('Late') : undefined), {
    name: 'late',
    order: MiddlewareOrder.RESPONSE_TRANSFORM,
  }),
]

const app = new Hono()
if (mode !== 'none') {
  apply(app, halves ? middlewaresProxy_middlewares(appMiddlewares) : middlewares.filter((m) => !m.isHandler))
}
// The app's own routes
app.get('/api/me', (c) => c.text('Me'))
app.get('/overridden', (c) => c.text('Overridden by +server.ts'))
// The request for the page /
const toIndex = (request: Request) => new Request(new URL('/', request.url), { headers: request.headers })
// `vike.fetch(request)` with the request alone, as /server documents
app.get('/vike-fetch', (c) => vike.fetch(toIndex(c.req.raw)))
// A context shared by all requests, like a Cloudflare worker's `env`
const sharedContext = {}
app.get('/shared-context', (c) => vike.fetch(toIndex(c.req.raw), sharedContext))
app.get('/render-page', async (c) => {
  const { httpResponse } = await renderPage({ urlOriginal: '/', headersOriginal: c.req.raw.headers })
  return c.html(httpResponse.body)
})
if (mode !== 'none') apply(app, halves ? [middlewaresProxy_handlers] : middlewares.filter((m) => m.isHandler))

export default {
  fetch: app.fetch,
} satisfies Server
