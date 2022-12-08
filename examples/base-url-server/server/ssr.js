import { renderPage } from 'vite-plugin-ssr'
import { createExpressApp } from './createExpressApp.js'
import { baseServer } from '../base.js'

const { app, startApp } = createExpressApp({ base: baseServer, port: 3000 })

app.get('*', async (req, res, next) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) return next()
  const { body, statusCode, contentType } = httpResponse
  res.status(statusCode).type(contentType).send(body)
})

startApp()
console.log(`Server running at http://localhost:3000${baseServer}`)
