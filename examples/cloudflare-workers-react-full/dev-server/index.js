// We use a Express.js server for development

const express = require('express')
const { renderPage } = require('vite-plugin-ssr')
const vite = require('vite')
const fetch = require('node-fetch')
const compression = require('compression')

Error.stackTraceLimit = Infinity;

startServer()

async function startServer() {
  const app = express()

  // We don't need gzip compression for dev. We use compression just to show
  // that it's properly handled by vite-plugin-ssr and react-streaming.
  app.use(compression())

  const viteDevMiddleware = (
    await vite.createServer({
      server: { middlewareMode: true }
    })
  ).middlewares
  app.use(viteDevMiddleware)

  app.get('*', async (req, res, next) => {
    const userAgent = req.headers['user-agent']
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      fetch,
      userAgent
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    res.type(httpResponse.contentType).status(httpResponse.statusCode)
    const { write, flush } = res
    res.write = function(chunk, ...args) {
      console.log(new Error().stack);
      console.log('\x1b[1m%s\x1b[0m', "write", String(chunk), ...args)
      return write.call(res, chunk, ...args)
    };
    res.flush = function(...args) {
      console.log(new Error().stack);
      console.log('\x1b[1m%s\x1b[0m', "flush", ...args)
      return flush.apply(res, args)
    };
    httpResponse.pipe(res)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
