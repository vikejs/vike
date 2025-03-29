import apollo from '@apollo/client'
import express from 'express'
import fetch from 'node-fetch'
import { createDevMiddleware, renderPage } from 'vike/server'
import { root } from './root.js'
const { ApolloClient, createHttpLink, InMemoryCache } = apollo
const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const { devMiddleware } = await createDevMiddleware({ root })
    app.use(devMiddleware)
  }

  app.get('/{*vike-catch-all}', async (req, res) => {
    const apolloClient = makeApolloClient()

    const pageContextInit = {
      urlOriginal: req.originalUrl,
      apolloClient
    }
    const pageContext = await renderPage(pageContextInit)

    const { httpResponse } = pageContext
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(httpResponse.statusCode)
    res.send(httpResponse.body)
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

function makeApolloClient() {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'https://countries.trevorblades.com',
      fetch
    }),
    cache: new InMemoryCache()
  })
  return apolloClient
}
