import express from 'express'
import { renderPage } from 'vike/server'

const app = express()

app.get('/{*vikeCatchAll}', async (req, res, next) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return next()
  } else {
    const { body, statusCode, headers } = httpResponse
    headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(statusCode).send(body)
  }
})

app.listen(3000)
console.log(`Server running at http://localhost:3000`)
