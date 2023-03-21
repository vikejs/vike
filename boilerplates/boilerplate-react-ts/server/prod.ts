import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import express from 'express'
import compression from 'compression'
import { renderPage } from 'vite-plugin-ssr'
import { minify } from 'html-minifier'
import sirv from 'sirv'

const port = process.env.CLIENT_PORT ? +process.env.CLIENT_PORT : 3000

const clientDir = resolve(fileURLToPath(import.meta.url), '../../client')

async function startServer() {
  const app = express()
  app.use(compression())

  app.use(sirv(clientDir))

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType, earlyHints } = httpResponse
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    const updatedBody = minify(body, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    })
    res.status(statusCode).type(contentType).send(updatedBody)
  })

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().then(null)
}
