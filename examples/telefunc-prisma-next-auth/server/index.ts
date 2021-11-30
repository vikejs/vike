import express from 'express'
import { createPageRenderer } from 'vite-plugin-ssr'
import { config } from 'dotenv'
import * as vite from 'vite'
import NextAuth from './auth'
import Providers from 'next-auth/providers'
import { createTelefuncCaller, provideContext } from 'telefunc'
import $fetch from 'node-fetch'
import { getSession } from 'next-auth/client'

// @ts-ignore
globalThis.fetch = $fetch

// load .env file
config()

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`

startServer()

async function startServer() {
  const app = express()

  let viteDevServer: vite.ViteDevServer | undefined = undefined

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: 'ssr' },
    })
    app.use(viteDevServer.middlewares)
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root })
  const callTelefunc = await createTelefuncCaller({ viteDevServer, isProduction, root })

  app.use(express.text())

  app.use(
    NextAuth({
      providers: [
        Providers.GitHub({
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
      ],
    }),
  )

  app.all('/_telefunc', async (req, res, next) => {
    const session = await getSession({ req })

    provideContext({
      session,
    })

    const { originalUrl: url, method, body } = req

    const result = await callTelefunc({ url, method, body })
    if (!result) return next()
    res.status(result.statusCode).type(result.contentType).send(result.body)
  })

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const session = await getSession({ req })

    const pageContextInit = {
      url,
      session,
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { bodyNodeStream: stream, statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType)
    stream.pipe(res)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
