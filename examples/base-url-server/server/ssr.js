import { renderPage } from 'vike/server'
import { baseServer } from '../base.js'
import { createExpressApp } from './createExpressApp.js'

const { app, startApp } = createExpressApp({ base: baseServer, port: 3000 })

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

startApp()
console.log(`Server running at http://localhost:3000${baseServer}`)
