import express from 'express'
import { renderPage } from 'vite-plugin-ssr'

const app = express()

app.get('*', async (req, res, next) => {
  const url = req.originalUrl
  const pageContext = await renderPage({ url })
  const { httpResponse } = pageContext
  if (!httpResponse) return next()
  const { body, statusCode, contentType } = httpResponse
  res.status(statusCode).type(contentType).send(body)
})

app.listen(3000)
console.log(`Server running at http://localhost:3000`)
