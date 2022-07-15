// We use a Express.js server for development

const express = require('express')
const { renderPage } = require('vite-plugin-ssr')
const vite = require('vite')
const fetch = require('node-fetch')

startServer()

async function startServer() {
  const app = express()

  const viteDevMiddleware = (
    await vite.createServer({
      server: { middlewareMode: 'ssr' },
    })
  ).middlewares
  app.use(viteDevMiddleware)

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const userAgent = req.headers['user-agent']
    const pageContextInit = { url, fetch, userAgent }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    res.type(httpResponse.contentType).status(httpResponse.statusCode)
    httpResponse.pipe(res)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
