import { renderPage } from 'vite-plugin-ssr/server'
import express from 'express'

const app = express()

app.use(express.static(`${process.cwd()}/dist/client/`))

app.get('*', async (req, res, next) => {
  const pageContext = await renderPage({ urlOriginal: req.originalUrl })
  const { httpResponse } = pageContext
  if (!httpResponse) return next()
  const { body, statusCode, contentType } = httpResponse
  res.status(statusCode).type(contentType)
  res.send(body)
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
