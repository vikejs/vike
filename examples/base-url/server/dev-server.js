import express from 'express'
import vite from 'vite'
import { createPageRenderer } from 'vite-plugin-ssr'
import { createExpressApp } from './createExpressApp.js'
import { base } from './base.js'
import { root } from './root.js'

const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const { app, startApp } = createExpressApp({ base })

  let viteDevServer
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: 'ssr' },
    })
    app.use(viteDevServer.middlewares)
  }

  const renderPage = createPageRenderer({
    base,
    viteDevServer,
    isProduction,
    root,
  })
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContextInit = {
      url,
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType).send(body)
  })

  startApp()
}
