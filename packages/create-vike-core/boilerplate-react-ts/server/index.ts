import express from 'express'
import { apply } from 'vike-server/express'
import { serve } from 'vike-server/express/serve'

export default startServer()

async function startServer() {
  const app = express()
  apply(app)
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
  return serve(app, { port })
}
