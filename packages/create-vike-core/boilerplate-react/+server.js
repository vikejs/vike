import { Hono } from 'hono'
import vike from 'vike/universal-middleware'
import { apply } from '@universal-middleware/hono'

const app = new Hono()
apply(app, [vike])

// FIXME does not seem to be loaded
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

// https://vike.dev/server
export default {
  fetch: app.fetch,
  port,
}
