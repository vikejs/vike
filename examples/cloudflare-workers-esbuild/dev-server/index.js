// We use a normal Express server for development

const express = require('express')
const { renderPage } = require('vite-plugin-ssr')
const vite = require('vite')
const fetch = require('node-fetch')

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

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const userAgent = req.headers['user-agent']
    const pageContextInit = { url, fetch, userAgent }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    res.type(httpResponse.contentType).status(httpResponse.statusCode)
    httpResponse.pipeToNodeWritable(res)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
