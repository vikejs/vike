// We use a normal Express server for development

import express from 'express'
import { createPageRenderer } from 'vite-plugin-ssr'
import vite from 'vite'
import fetch from 'node-fetch'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`

startServer()

async function startServer() {
  const app = express()

  let viteDevServer
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: 'ssr' },
    })
    app.use(viteDevServer.middlewares)
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root })
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContextInit = {
      url,
      fetch,
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType).send(body)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
