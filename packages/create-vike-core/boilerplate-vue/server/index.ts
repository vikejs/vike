import { Hono } from 'hono'
import { apply } from 'vike-server/hono'
import { serve } from 'vike-server/hono/serve'

export default startServer()

function startServer() {
  const app = new Hono()
  apply(app)
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
  return serve(app, { port })
}
