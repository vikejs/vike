// We use a Express.js server for development

import express from 'express'
import { renderPage, createDevMiddleware } from 'vike/server'
import fetch from 'node-fetch'
import compression from 'compression'

startServer()

async function startServer() {
  const app = express()

  // We don't need gzip compression for dev. We use compression just to show
  // that it's properly handled by Vike and react-streaming.
  app.use(compression())

  const { devMiddleware } = await createDevMiddleware({ root })
  app.use(devMiddleware)

  app.get('*', async (req, res) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      headersOriginal: req.headers,
      fetch
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(httpResponse.statusCode)
    httpResponse.pipe(res)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
