import express from 'express'
import { renderPage } from 'vike/server'

const app = express()

app.get('/{*vike-catch-all}', async (req, res) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
  res.status(httpResponse.statusCode)
  httpResponse.pipe(res)
})

app.listen(3000)
console.log(`Server running at http://localhost:3000`)
