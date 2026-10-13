// A server that applies the +middleware itself: https://vike.dev/middleware#manual-integration
// With MIDDLEWARES=halves, it applies the two halves that `vike(app, middlewaresUserLand)` applies instead.

import { Hono } from 'hono'
import { enhance, MiddlewareOrder } from '@universal-middleware/core'
import { apply } from '@universal-middleware/hono'
import { getGlobalContext } from 'vike'
import { getMiddlewaresPipe_handlers, getMiddlewaresPipe_nonHandlers } from 'vike/__internal'
import { renderPage } from 'vike/server'
import vike from 'vike/fetch'
import type { Server } from 'vike/types'
import assert from 'node:assert'

const globalContext = await getGlobalContext()
assert(!globalContext.isClientSide)
const { middlewares } = globalContext
const halves = process.env.MIDDLEWARES === 'halves'

// Sets a header on the response
const setHeader = (name: string, value: string) => (response: Response) => {
  response.headers.set(name, value)
  return response
}
// The user-land universal middlewares, as in `vike(app, middlewaresUserLand)`: `userSeen` runs between the `user` and
// `auth` +middleware, and `late`'s Response comes after `auth`'s
const middlewaresUserLand = [
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
  // A handler: it runs after the app's own routes, which can override it
  enhance(() => new Response('Hello from a user-land handler'), {
    name: 'userLandHandler',
    path: '/user-land/**',
    method: 'GET',
  }),
]

const app = new Hono()
apply(app, halves ? [getMiddlewaresPipe_nonHandlers(middlewaresUserLand)] : middlewares.filter((m) => !m.isHandler))
// The app's own routes
app.get('/api/me', (c) => c.text('Me'))
app.get('/overridden', (c) => c.text('Overridden by +server.ts'))
app.get('/user-land/overridden', (c) => c.text('Overridden by +server.ts'))
// The request for the page /
const toIndex = (request: Request) => new Request(new URL('/', request.url), { headers: request.headers })
// `vike.fetch(request)` with the request alone, as /server documents
app.get('/vike-fetch', (c) => vike.fetch(toIndex(c.req.raw)))
// A context shared by all requests, like a Cloudflare worker's `env`
const sharedContext = {}
app.get('/shared-context', (c) => vike.fetch(toIndex(c.req.raw), sharedContext))
// The app's own renderPage() call: Vike can't tell whether the +middleware ran, so it answers with a 500
app.get('/render-page', async (c) => {
  const { httpResponse } = await renderPage({ urlOriginal: new URL('/', c.req.url).href })
  return new Response(httpResponse.body, { status: httpResponse.statusCode, headers: httpResponse.headers })
})
apply(app, halves ? [getMiddlewaresPipe_handlers(middlewaresUserLand)] : middlewares.filter((m) => m.isHandler))

export default {
  fetch: app.fetch,
} satisfies Server
