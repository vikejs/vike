import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createHandler, createMiddleware } from '@universal-middleware/express'
import express from 'express'
import { vikeHandler } from './server/vike-handler'

const __filename = globalThis.__filename ?? fileURLToPath(import.meta.url)
const __dirname = globalThis.__dirname ?? dirname(__filename)
const root = __dirname
const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000
const hmrPort = process.env.HMR_PORT ? Number.parseInt(process.env.HMR_PORT, 10) : 24678

export default await startServer()

async function startServer() {
  const app = express()

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(`${root}/dist/client`))
  } else {
    // Instantiate Vite's development server and integrate its middleware to our server.
    // ! We should instantiate it *only* in development. (It isn't needed in production
    // and would unnecessarily bloat our server in production.)
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true, hmr: { port: hmrPort } }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get(
    '/hello',
    createMiddleware(() => () => {
      console.log('HELLO')
      return new Response('Hello')
    })()
  )

  /**
   * Vike route
   *
   * @link {@see https://vike.dev}
   **/
  app.all(['/', '/about', '/star-wars'], createHandler(() => vikeHandler)())

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })

  return app
}
