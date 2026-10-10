// https://vike.dev/server

import { Hono } from 'hono'
import vike from '@vikejs/hono'
import type { Server } from 'vike/types'
import { getGlobalContextAsync } from 'vike'
import vikeFetch from 'vike/fetch'

// Awaiting the global context at the top level mustn't deadlock
await getGlobalContextAsync(process.env.NODE_ENV === 'production')

const app = new Hono()
app.get('/hello', (c) => c.text('Hello from +server.ts'))
// `vike.fetch()` with a method that Vike's pages don't list (the app has no +middleware)
app.on('PROPFIND', '/', (c) => vikeFetch.fetch(c.req.raw))
vike(app)

export default {
  fetch: app.fetch,
} satisfies Server
