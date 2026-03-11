import { Hono } from 'hono'
import { addVikeMiddleware } from '@vikejs/hono'

const app = new Hono()
addVikeMiddleware(app)

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

// https://vike.dev/server
export default {
  fetch: app.fetch,
  port,
}
