import express from 'express'
import { apply } from 'vike-server/express'
import { serve } from 'vike-server/express/serve'

function startServer() {
  const app = express()
  apply(app)
  const port = process.env.PORT || 3000
  return serve(app, { port })
}

export default startServer()
