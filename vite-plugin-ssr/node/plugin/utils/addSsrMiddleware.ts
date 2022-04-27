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
      const userAgent = req.headers['user-agent']
      const pageContextInit = { url, userAgent }
      const pageContext = await renderPage(pageContextInit)
      if (!pageContext.httpResponse) return next()
      const { statusCode, contentType } = pageContext.httpResponse
      res.setHeader('Content-Type', contentType)
      res.statusCode = statusCode
      pageContext.httpResponse.pipe(res)
    })
  }
}
