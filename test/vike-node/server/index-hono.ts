import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import vikeNode from 'vike-node/hono'

startServer()

async function startServer() {
  const app = new Hono()
  const port = process.env.PORT || 3000

  app.use(vikeNode())

  serve({
    fetch: app.fetch,
    port: +port
  })

  console.log(`Server running at http://localhost:${port}`)
}
