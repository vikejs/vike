import type { Server } from 'vike/types'
import vike, { toFetchHandler } from '@vikejs/express'
import express from 'express'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

async function serve() {
  const app = express()

  app.get('/express', (_req, res) => res.send('Running express server'))

  vike(app)

  return toFetchHandler(app)
}

export default {
  fetch: await serve(),
  prod: { port },
} satisfies Server
