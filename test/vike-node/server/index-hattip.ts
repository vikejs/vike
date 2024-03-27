import { telefunc } from 'telefunc'
import { vike } from 'vike-node/web'
import { init } from '../database/todoItems.js'
import { createServer } from '@hattip/adapter-node'
import { createRouter } from '@hattip/router'

startServer()

async function startServer() {
  await init()
  const app = createRouter()

  app.use('/_telefunc', async (ctx) => {
    const httpResponse = await telefunc({
      url: ctx.request.url,
      method: ctx.request.method,
      body: await ctx.request.text()
    })
    return new Response(httpResponse.body, {
      status: httpResponse.statusCode,
      headers: {
        'Content-Type': httpResponse.contentType
      }
    })
  })

  app.use('*', async (ctx) => {
    const res = await vike({
      url: ctx.request.url,
      headers: ctx.request.headers
    })
    if (!res) return new Response('Not Found', { status: 404 })
    return new Response(res.body, {
      status: res.status,
      headers: res.headers
    })
  })

  const server = createServer(app.buildHandler())
  const port = process.env.PORT || 3000
  server.listen(+port)
  console.log(`Server running at http://localhost:${port}`)
}
