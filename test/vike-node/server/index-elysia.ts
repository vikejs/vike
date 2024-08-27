import { Elysia } from 'elysia'
import { telefunc } from 'telefunc'
import vike from 'vike-node/elysia'
import { init } from '../database/todoItems'

startServer()

async function startServer() {
  await init()
  const app = new Elysia()

  const port = process.env.PORT || 3000
  app.post('/_telefunc', async (ctx) => {
    const context = {}
    const httpResponse = await telefunc({
      url: ctx.request.url,
      method: ctx.request.method,
      body: await ctx.request.text(),
      context
    })
    const { body, statusCode, contentType } = httpResponse
    return new Response(body, { headers: { 'content-type': contentType }, status: statusCode })
  })

  app.onAfterHandle((ctx) => {
    ctx.set.headers['x-test'] = 'test'
  })

  app.use(vike())
  app.listen(+port, () => console.log(`Server running at http://localhost:${port}`))
}
