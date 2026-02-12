/// <reference types="vite/client" />

import express from 'express'
import { renderPage } from 'vike/server'
import viteDevServer from 'vavite/vite-dev-server'

const app = express()

if (!viteDevServer) {
  // Serve static files in production
  app.use(express.static('dist/client'))
}

// Vike middleware. It should always be our last middleware (because it's a
// catch-all middleware superseding any middleware placed after it).
app.get('*', async (req, res, next) => {
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
    res.status(statusCode)
    // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/streaming
    res.send(body)
  }
})

export default app
