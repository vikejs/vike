import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { EnhancedMiddleware } from '@universal-middleware/core'
import { apply } from '@universal-middleware/express'
import express from 'express'
import { createDevMiddleware, getGlobalContextAsync } from 'vike/server'

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

  const middlewares = await getUniversalMiddlewares()
  // @ts-ignore Typescript seems to think that apply requires express 5
  apply(app, middlewares)

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })

  return app
}

async function getUniversalMiddlewares() {
  const isProduction = process.env.NODE_ENV === 'production'
  const globalContext = await getGlobalContextAsync(isProduction)
  const middlewares = (globalContext as any)._vikeConfig.global.config.middleware.flat(Infinity) as EnhancedMiddleware[]
  return middlewares
}
