import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

import express from 'express'
import compression from 'compression'
import { UserConfig, createServer } from 'vite'
import { renderPage } from 'vite-plugin-ssr'
import _ from 'lodash'
import { format } from 'prettier'

import viteConfig from '../vite.config.js'

const prettierConfigFile = `${process.env.PROJECT_CWD || process.cwd()}/.prettierrc`
let prettierConfig = {}
if (existsSync(prettierConfigFile)) prettierConfig = JSON.parse(readFileSync(prettierConfigFile, 'utf-8'))

const port = (viteConfig as UserConfig).server?.port || (process.env.PORT ? +process.env.PORT : 3000)

const root = resolve(fileURLToPath(import.meta.url), '../..')

async function startServer() {
  const app = express()
  app.use(compression())

  const viteDevServer = await createServer(_.merge(viteConfig, { root, server: { middlewareMode: true } }))
  app.use(viteDevServer.middlewares)

  app.get('*', async (req, res, next) => {
    const pageContextInit = { urlOriginal: req.originalUrl }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType, earlyHints } = httpResponse
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    const updatedBody = format(body, { parser: 'html', ...prettierConfig })
    res.status(statusCode).type(contentType).send(updatedBody)
  })

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

startServer().then(null)
