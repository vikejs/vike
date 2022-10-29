import compress from '@fastify/compress'
import middie from '@fastify/middie'
import fastify from 'fastify'
import vite from 'vite'
import { renderPage } from 'vite-plugin-ssr'

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`

startServer()

async function startServer() {
  const app = fastify()

  await app.register(middie)
  await app.register(compress)

  if (isProduction) {
    const sirv = require('sirv')
    app.use(sirv(`${root}/dist/client`))
  } else {
    const viteServer = await vite.createServer({
      root,
      server: { middlewareMode: true }
    })
    await app.use(viteServer.middlewares)
  }

  app.get('*', async (req, reply) => {
    const pageContextInit = {
      urlOriginal: req.url
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext

    if (!httpResponse) {
      return reply.code(404).type('text/html').send('Not Found')
    }

    const { body, statusCode, contentType } = httpResponse

    return reply.status(statusCode).type(contentType).send(body)
  })

  const port: number = process.env.PORT ? +process.env.PORT : 3000

  app.listen({ port })

  console.log(`Server running at http://localhost:${port}`)
}
