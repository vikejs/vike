import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { telefunc } from 'telefunc'
import vike from 'vike-node/hono'
import { init } from '../database/todoItems'

startServer()

async function startServer() {
  await init()
  const app = new Hono()
  const port = process.env.PORT || 3000
  app.post('/_telefunc', async (ctx) => {
    const context = {}
    const httpResponse = await telefunc({
      url: ctx.req.url,
      method: ctx.req.method,
      body: await ctx.req.text(),
      context
    })
    const { body, statusCode, contentType } = httpResponse
    return new Response(body, { headers: { 'content-type': contentType }, status: statusCode })
  })

  app.use('*', async (ctx, next) => {
    await next()
    ctx.header('x-test', 'test')
  })

  app.use(vike())

  serve(
    {
      fetch: app.fetch,
      port: +port,
      // Needed for Bun
      overrideGlobalObjects: false
    },
    () => console.log(`Server running at http://localhost:${port}`)
  )
}
