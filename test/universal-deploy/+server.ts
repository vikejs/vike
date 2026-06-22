import type { Server } from 'vike/types'
import vike, { toFetchHandler } from '@vikejs/express'
import express from 'express'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

async function serve() {
  const app = express()

  app.get('/express', (_req, res) => res.send('Running express server'))

  vike(app)

  // `toFetchHandler()` (i.e. `connectToWeb()`) resolves to `undefined` when no middleware
  // handles the request. Vike's catch-all always responds, but we add a fallback to satisfy
  // the `Server['fetch']` type which requires a `Response` to always be returned.
  const handler = toFetchHandler(app)
  return async (request: Request): Promise<Response> => (await handler(request)) ?? new Response(null, { status: 404 })
}

export default {
  fetch: await serve(),
  prod: { port },
} satisfies Server
