import { Hono } from 'hono'
import { apply } from 'vike-cloudflare/hono'
import { serve } from 'vike-cloudflare/hono/serve'

function startServer() {
  console.log(`process.env.NODE_ENV === ${JSON.stringify(process.env.NODE_ENV)}`)
  const app = new Hono()
  // @ts-ignore
  apply(app)
  // @ts-ignore
  return serve(app, { port: 3000 })
}

export default startServer()
