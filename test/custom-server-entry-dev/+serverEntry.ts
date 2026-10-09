// https://vike.dev/serverEntry
// There isn't any +server.js => `$ vike dev` runs this file as well

import express from 'express'
import assert from 'node:assert'
import { fileURLToPath } from 'node:url'
import { createDevMiddleware, getGlobalContext, renderPage } from 'vike/server'
import { hello } from './server/hello'
import { getEvaluations } from './server/shared'

const app = express()

if (import.meta.env.DEV) {
  // Vite's development middleware (HMR, transpiling, static assets, ...)
  const { devMiddleware } = await createDevMiddleware()
  app.use(devMiddleware)
} else {
  app.use(express.static(fileURLToPath(new URL('../client', import.meta.url))))
}

// Applying the list by hand: `$ vike dev` restarts this file when the +middleware change
const globalContext = await getGlobalContext()
assert(!globalContext.isClientSide)
const middlewares = globalContext.middlewares.filter((m) => !m.isHandler)
app.get('/middlewares', (_req, res) => {
  res.send(String(middlewares.length))
})

app.get('/hello', (_req, res) => {
  res.send(hello)
})

app.get('/shared-module-evaluations', (_req, res) => {
  res.send(String(getEvaluations()))
})

// Vike middleware. It should always be our last middleware (because it's a catch-all
// middleware superseding any middleware placed after it).
app.get('/{*vikeCatchAll}', async (req, res) => {
  const pageContext = await renderPage({ urlOriginal: req.originalUrl, headersOriginal: req.headers })
  const { httpResponse } = pageContext
  httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
  res.status(httpResponse.statusCode)
  httpResponse.pipe(res)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
