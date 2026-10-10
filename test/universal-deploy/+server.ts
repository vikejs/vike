import type { Server } from 'vike/types'
import vike, { toFetchHandler } from '@vikejs/express'
import express from 'express'
import { getGlobalContextAsync } from 'vike'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

async function serve() {
  const app = express()

  app.get('/express', (_req, res) => res.send('Running express server'))
  // Vite already ran its middlewares before +server.ts: running them again hangs the development server
  app.get('/dev-middleware', async (req, res, next) => {
    const globalContext = await getGlobalContextAsync(process.env.NODE_ENV === 'production')
    if (globalContext.isClientSide || !globalContext.devMiddleware) return next()
    globalContext.devMiddleware(req, res, next)
  })

  vike(app)

  return toFetchHandler(app)
}

export default {
  fetch: await serve(),
  prod: { port },
} satisfies Server
