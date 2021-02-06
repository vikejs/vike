import express from 'express'
import { render } from 'vite-plugin-ssr'
import * as vite from 'vite'

Error.stackTraceLimit = Infinity

startServer()

async function startServer() {
  const app = express()

  const viteServer = await vite.createServer({
    server: {
      middlewareMode: true
    }
  })
  hotfix__expose_server(viteServer)
  app.use(viteServer.middlewares)

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const html = await render(url)
    if (!html) {
      next()
      return
    }
    res.send(html)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

function hotfix__expose_server(viteServer: vite.ViteDevServer) {
  global.viteServer = viteServer
}
declare global {
  namespace NodeJS {
    interface Global {
      viteServer: vite.ViteDevServer
    }
  }
}
