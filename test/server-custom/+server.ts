// `server: { custom: true }` => this file is the server entry as-is (dist/server/index.mjs)
// https://vike.dev/server#custom-integration

import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderPage } from 'vike/server'

const app = express()

if (import.meta.env.PROD) {
  // In development, Vite serves the static assets
  app.use(express.static(fileURLToPath(new URL('../client', import.meta.url))))
}

app.get('/hello', (_req, res) => {
  res.send('Hello from Express')
})

// Vike middleware. It should always be our last middleware (because it's a
// catch-all middleware superseding any middleware placed after it).
app.get('/{*vikeCatchAll}', async (req, res, next) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl,
    headersOriginal: req.headers,
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) return next()
  httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
  res.status(httpResponse.statusCode)
  httpResponse.pipe(res)
})

if (import.meta.env.PROD) {
  // Used by test-preview.test.ts to check that pre-rendering doesn't execute this file
  fs.appendFileSync(path.join(process.cwd(), 'dist/server/executed.log'), 'executed\n')
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
}

// Side exports are preserved in dist/server/index.mjs
export const MY_SETTING = 'MY_SETTING'

// In development, Vike forwards requests to the default export
export default app
