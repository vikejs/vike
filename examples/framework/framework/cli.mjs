#!/usr/bin/env node

import { createServer, build, preview } from 'vite'
import { rootFramework } from './utils.mjs'
import { existsSync } from 'fs'
import { createPageRenderer } from 'vite-plugin-ssr'
import { prerender } from 'vite-plugin-ssr/cli'

const configFile = `${rootFramework}/vite.config.js`
const rootUser = process.cwd()
if (!existsSync(`${rootUser}/package.json`)) {
  throw new Error("The `framework` CLI should be called from your project's root directory.")
}
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
    root: rootUser,
    plugins: [renderPlugin()],
    server: {
      port: 3000,
      host: true
    }
  })
  await server.listen()
  server.printUrls()
}

function renderPlugin() {
  return {
    name: 'framework:renderPlugin',
    configureServer(server) {
      const renderPage = createPageRenderer({ viteDevServer: server, root: rootUser, isProduction: false })
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
    }
  }
}

async function cmdBuild() {
  await build({
    configFile,
    root: rootUser
  })
  await build({
    configFile,
    root: rootUser,
    build: {
      ssr: true
    }
  })
  await prerender({})
}

async function cmdPreview() {
  if (!existsSync(`${rootUser}/dist/client/index.html`)) {
    throw new Error('Call `build` before calling `preview`.')
  }
  const previewServer = await preview({
    configFile,
    root: rootUser,
    build: {
      outDir: 'dist/client'
    },
    preview: {
      host: true,
      port: 3000
    }
  })
  previewServer.printUrls()
}
