import { telefunc } from 'telefunc'
import { vike } from 'vike-node/web'
import { init } from '../database/todoItems.js'
import { createAdaptorServer } from '@hono/node-server'
import { Hono } from 'hono'

startServer()

async function startServer() {
  await init()
  const app = new Hono()

  app.use('/_telefunc', async (ctx) => {
    const httpResponse = await telefunc({
      url: ctx.req.url,
      method: ctx.req.method,
      body: await ctx.req.text()
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
      url: ctx.req.url,
      headers: ctx.req.header()
    })
    if (!res) return new Response('Not Found', { status: 404 })
    return new Response(res.body, {
      status: res.status,
      headers: res.headers
    })
  })

  const server = createAdaptorServer(app)
  const port = process.env.PORT || 3000
  server.listen(+port)
  console.log(`Server running at http://localhost:${port}`)
}
