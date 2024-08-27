import express from 'express'
import { telefunc } from 'telefunc'
import { vike } from 'vike-node/connect'
import { Worker } from 'worker_threads'
import { init } from '../database/todoItems.js'
import { two } from './shared-chunk.js'

if (two() !== 2) {
  throw new Error()
}
startServer()
new Worker(new URL('./worker.mjs', import.meta.url))

async function startServer() {
  await init()
  const app = express()
  app.use(express.text()) // Parse & make HTTP request body available at `req.body`
  app.all('/_telefunc', async (req, res) => {
    const context = {}
    const httpResponse = await telefunc({ url: req.originalUrl, method: req.method, body: req.body, context })
    const { body, statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType).send(body)
  })
  app.use((req, res, next) => {
    res.set('x-test', 'test')
    next()
  })
  app.use(vike())
  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
