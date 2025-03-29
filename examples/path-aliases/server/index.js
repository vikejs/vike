// Note that Node.js directly executes this file; Vite doesn't process this file.
// We use `package.json#imports` to define path aliases for Node.js files that are
// not processed by Vite, such as this one.
import { msg } from '#root/server/msg'

import express from 'express'
import { createDevMiddleware, renderPage } from 'vike/server'
import { root } from './root.js'

console.log(msg)

const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const { devMiddleware } = await createDevMiddleware({ root })
    app.use(devMiddleware)
  }

  app.get('/{*page}', async (req, res) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(httpResponse.statusCode)
    httpResponse.pipe(res)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
