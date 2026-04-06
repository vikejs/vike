import { Hono } from 'hono'
import vike from '@vikejs/hono'
import { Server } from 'vike/types'

const app = new Hono()
vike(app)

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

// https://vike.dev/server
export default {
  fetch: app.fetch,
  prod: { port },
} satisfies Server
