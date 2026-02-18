import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { apply } from '@universal-middleware/express'
import express from 'express'
import vikeMiddleware from 'vike/universal-middleware'
import { toFetchHandler } from 'srvx/node'
import { createDevMiddleware } from 'vike'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

console.log('EXPRESS ENTRY')
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = __dirname

async function serve() {
  const app = express()

  // if (process.env.NODE_ENV === 'production') {
  //   app.use(express.static(`${root}/dist/client`))
  // } else {
  //   const { devMiddleware } = await createDevMiddleware({ root })
  //   app.use(devMiddleware)
  // }

  apply(app, [vikeMiddleware])

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })

  return toFetchHandler(app)
}

export default {
  fetch: await serve(),
}
