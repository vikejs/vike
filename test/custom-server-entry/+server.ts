// https://vike.dev/server

import { Hono } from 'hono'
import vike from '@vikejs/hono'
import type { Server } from 'vike/types'
import { getGlobalContextAsync } from 'vike'

// Awaiting the global context at the top level mustn't deadlock
await getGlobalContextAsync(process.env.NODE_ENV === 'production')

const app = new Hono()
app.get('/hello', (c) => c.text('Hello from +server.ts'))
app.get('/dev-middleware', async (c) => {
  const globalContext = await getGlobalContextAsync(process.env.NODE_ENV === 'production')
  return c.text(!globalContext.isClientSide && globalContext.devMiddleware ? 'set' : 'null')
})
vike(app)

export default {
  fetch: app.fetch,
} satisfies Server
