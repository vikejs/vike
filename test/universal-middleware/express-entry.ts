import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { apply } from '@universal-middleware/express'
import express from 'express'
import { createDevMiddleware } from 'vike/server'
import vikeMiddleware from 'vike/universal-middleware'

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

  apply(app, [vikeMiddleware])

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })

  return app
}
