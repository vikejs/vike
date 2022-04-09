#!/usr/bin/env node

import { createServer, build, preview } from 'vite'
import { rootFramework, rootApp } from './utils.mjs'
import { existsSync } from 'fs'
import { renderPage } from 'vite-plugin-ssr'

const configFile = `${rootFramework}/vite.config.ts`
const command = process.argv[2]
if (!command) {
  throw new Error('Missing command.')
}

if (command === 'dev') {
  await cmdDev()
} else if (command === 'build') {
  await cmdBuild()
} else if (command === 'preview') {
  await cmdPreview()
} else {
  throw new Error(`Unkown command: \`${command}\`.`)
}

async function cmdDev() {
  const server = await createServer({
    configFile,
    plugins: [renderPlugin()],
    server: {
      port: 3000,
      host: true,
    },
  })
  await server.listen()
  server.printUrls()
}

function renderPlugin() {
  return {
    name: 'framework:renderPlugin',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = req.originalUrl
          const pageContextInit = { url }
          const pageContext = await renderPage(pageContextInit)
          const { httpResponse } = pageContext
          if (!httpResponse) return next()
          const { body, statusCode, contentType } = httpResponse
          res.statusCode = statusCode
          res.setHeader('Content-Type', contentType).end(body)
        })
      }
    },
  }
}

async function cmdBuild() {
  await build({ configFile })
}

async function cmdPreview() {
  if (!existsSync(`${rootApp}/dist/client/index.html`)) {
    throw new Error('Call `build` before calling `preview`.')
  }
  const previewServer = await preview({
    configFile,
    build: {
      outDir: 'dist/client',
    },
    preview: {
      host: true,
      port: 3000,
    },
  })
  previewServer.printUrls()
}
