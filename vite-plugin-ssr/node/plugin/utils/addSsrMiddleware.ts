export { addSsrMiddleware }

import { renderPage } from '../../renderPage'
import type { ViteDevServer } from 'vite'

type ConnectServer = ViteDevServer['middlewares']
function addSsrMiddleware(middlewares: ConnectServer) {
  return () => {
    middlewares.use(async (req, res, next) => {
      if (res.headersSent) return next()
      const url = req.originalUrl || req.url
      if (!url) return next()
      const pageContextInit = { url }
      const pageContext = await renderPage(pageContextInit)
      if (!pageContext.httpResponse) return next()
      const body = await pageContext.httpResponse.getBody()
      const { statusCode, contentType } = pageContext.httpResponse
      res.setHeader('Content-Type', contentType)
      res.statusCode = statusCode
      res.end(body)
    })
  }
}
