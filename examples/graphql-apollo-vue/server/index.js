const express = require('express')
const compression = require('compression')
const { renderPage } = require('vite-plugin-ssr')

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`
const fetch = require('cross-fetch')
const { ApolloClient, createHttpLink, InMemoryCache } = require('@apollo/client')
startServer()

async function startServer() {
  const app = express()

  app.use(compression())

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const vite = require('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const apolloClient = makeApolloClient()
    const pageContextInit = {
      url,
      apolloClient,
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType).send(body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

function makeApolloClient() {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'https://rickandmortyapi.com/graphql',
      fetch,
    }),
    cache: new InMemoryCache(),
  })
  return apolloClient
}
