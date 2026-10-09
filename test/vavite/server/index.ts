/// <reference types="vite/client" />

import assert from 'node:assert'
import express from 'express'
import { apply, getContext } from '@universal-middleware/express'
import { getGlobalContext, renderPage } from 'vike/server'
import viteDevServer from 'vavite/vite-dev-server'

const app = express()

if (!viteDevServer) {
  // Serve static files in production
  app.use(express.static('dist/client'))
}

const globalContext = await getGlobalContext()
assert(!globalContext.isClientSide)
apply(
  app,
  globalContext.middlewares.filter((m) => !m.isHandler),
)

app.get('/api/context', (req, res) => res.json(getContext(req)))

// Vike middleware. It should always be our last middleware (because it's a
// catch-all middleware superseding any middleware placed after it).
app.get('/{*vikeCatchAll}', async (req, res, next) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl,
    headersOriginal: req.headers,
  }
  const pageContext = await renderPage(pageContextInit)
  if (pageContext.errorWhileRendering) {
    // Install error tracking here, see https://vike.dev/errors
  }
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return next()
  } else {
    const { body, statusCode, headers, earlyHints } = httpResponse
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(statusCode).send(body)
  }
})

export default app
