import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createMiddleware } from '@universal-middleware/express'
import express from 'express'
import { getMiddlewares } from 'vike/__internal'
import type { Middleware } from './pages/Middleware'
import { createDevMiddleware } from 'vike/server'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = __dirname
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

export default (await startServer()) as unknown

async function startServer() {
  const app = express()

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const { devMiddleware } = await createDevMiddleware({ root })
    app.use(devMiddleware)
  }

  const middlewares = (await getMiddlewares()) as Middleware[]
  middlewares.sort((m1, m2) => getOrder(m1.order) - getOrder(m2.order))
  middlewares.forEach((middlewareSpec) => {
    const middleware = middlewareSpec.value
    app.all('*', createMiddleware(() => middleware)())
  })

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })

  return app
}

function getOrder(order: Middleware['order']): number {
  if (order === 'post') return 100
  if (order === 'pre') return -100
  return order
}
