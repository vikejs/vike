import { apply } from '@universal-middleware/express'
import express from 'express'
import vikeMiddleware from 'vike/universal-middleware'
import { toFetchHandler } from 'srvx/node'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

async function serve() {
  const app = express()
  apply(app, [vikeMiddleware])

  return toFetchHandler(app)
}

export default {
  fetch: await serve(),
  port,
}
