import { renderPage } from 'vike/server'
import { baseServer } from '../base.js'
import { createExpressApp } from './createExpressApp.js'

const { app, startApp } = createExpressApp({ base: baseServer, port: 3000 })

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

startApp()
console.log(`Server running at http://localhost:3000${baseServer}`)
