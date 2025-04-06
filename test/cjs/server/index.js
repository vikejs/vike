// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

const express = require('express')
const compression = require('compression')
const { renderPage, createDevMiddleware } = require('vike/server')

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`

startServer()

async function startServer() {
  const app = express()

  app.use(compression())

  // Vite integration
  if (isProduction) {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    const sirv = require('sirv')
    app.use(sirv(`${root}/dist/client`))
  } else {
    const { devMiddleware } = await createDevMiddleware({ root })
    app.use(devMiddleware)
  }

  // ...
  // Other middlewares (e.g. some RPC middleware such as Telefunc)
  // ...

  // Vike middleware. It should always be our last middleware (because it's a
  // catch-all middleware superseding any middleware placed after it).
  app.get('/{*vikeCatchAll}', async (req, res) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    const { body, statusCode, headers, earlyHints } = httpResponse
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(statusCode)
    // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/streaming
    res.send(body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
