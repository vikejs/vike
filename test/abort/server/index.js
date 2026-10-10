import express from 'express'
import { createDevMiddleware, getGlobalContextAsync, renderPage } from 'vike/server'
import { root } from './root.js'
const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()

  let devMiddleware = null
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    devMiddleware = (await createDevMiddleware({ root })).devMiddleware
    app.use(devMiddleware)
  }

  app.get('/dev-middleware', async (_req, res) => {
    const globalContext = await getGlobalContextAsync(isProduction)
    res.send(globalContext.devMiddleware ? String(globalContext.devMiddleware === devMiddleware) : 'null')
  })

  app.get('/{*vikeCatchAll}', async (req, res) => {
    const pageContextInit = {
      urlOriginal: req.url,
      // Trigger pageContext.json request
      someFakeData: 1234,
    }
    const pageContext = await renderPage(pageContextInit)

    const { httpResponse } = pageContext
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(httpResponse.statusCode)
    res.send(httpResponse.body)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
