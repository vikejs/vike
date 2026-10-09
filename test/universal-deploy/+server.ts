import type { Server } from 'vike/types'
import { toFetchHandler } from '@vikejs/express'
import { apply } from '@universal-middleware/express'
import { getGlobalContext } from 'vike/server'
import express from 'express'
import assert from 'node:assert'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

async function serve() {
  const app = express()

  const globalContext = await getGlobalContext()
  assert(!globalContext.isClientSide)
  const { middlewares } = globalContext

  apply(
    app,
    middlewares.filter((m) => !m.isHandler),
  )

  app.get('/express', (_req, res) => res.send('Running express server'))
  app.get('/overridden', (_req, res) => res.send('from route'))

  apply(
    app,
    middlewares.filter((m) => m.isHandler),
  )

  return toFetchHandler(app)
}

export default {
  fetch: await serve(),
  prod: { port },
} satisfies Server
