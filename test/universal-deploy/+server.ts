import { addVikeMiddleware } from '@vikejs/express'
import express from 'express'
import { toFetchHandler } from 'srvx/node'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

async function serve() {
  const app = express()

  app.get('/express', (_req, res) => res.send('Running express server'))

  addVikeMiddleware(app)

  return toFetchHandler(app)
}

export default {
  fetch: await serve(),
  port,
}
