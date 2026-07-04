import type { Server } from 'vike/types'
import vike, { toFetchHandler } from '@vikejs/express'
import { universalMiddleware } from 'vike/getUniversalMiddlewares'
import express from 'express'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

async function serve() {
  const app = express()

  app.get('/express', (_req, res) => res.send('Running express server'))

  // Applies the app's +middleware (Universal Middlewares), e.g. the Telefunc middleware, to all URLs.
  vike(app, [universalMiddleware])

  return toFetchHandler(app)
}

export default {
  fetch: await serve(),
  prod: { port },
} satisfies Server
