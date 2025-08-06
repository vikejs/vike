import { Hono } from 'hono'
import { apply } from 'vike-cloudflare/hono'
import { serve } from 'vike-cloudflare/hono/serve'

export default startServer()

function startServer() {
  const app = new Hono()
  apply(app)
  return serve(app, { port: 3000 })
}
