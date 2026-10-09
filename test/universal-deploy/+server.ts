import type { Server } from 'vike/types'
import { toFetchHandler } from '@vikejs/express'
import { apply } from '@universal-middleware/express'
import { getUniversalMiddlewares, universalHandler } from 'vike'
import express from 'express'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

async function serve() {
  const app = express()

  apply(app, await getUniversalMiddlewares())

  app.get('/express', (_req, res) => res.send('Running express server'))
  app.get('/overridden', (_req, res) => res.send('from route'))

  apply(app, [universalHandler])

  return toFetchHandler(app)
}

export default {
  fetch: await serve(),
  prod: { port },
} satisfies Server
