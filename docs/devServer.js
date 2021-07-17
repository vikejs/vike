const express = require('express')
const { createPageRender } = require('vite-plugin-ssr')
const vite = require('vite')

const root = __dirname
const isProduction = false

startServer()

async function startServer() {
  const app = express()

  const viteDevServer = await vite.createServer({
    root,
    server: { middlewareMode: true }
  })
  app.use(viteDevServer.middlewares)

  const renderPage = createPageRender({ viteDevServer, isProduction, root })
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContext = { url }
    const result = await renderPage(pageContext)
    if (result.nothingRendered) return next()
    res.status(result.statusCode).send(result.renderResult)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
