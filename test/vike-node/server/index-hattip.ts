import { createServer } from '@hattip/adapter-node'
import { createRouter } from '@hattip/router'
import { telefunc } from 'telefunc'
import vike from 'vike-node/hattip'
import { init } from '../database/todoItems'

startServer()

async function startServer() {
  await init()
  const app = createRouter()
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
  app.use('*', async (ctx) => {
    const res = await ctx.next()
    res.headers.append('x-test', 'test')
    return res
  })
  app.use(vike())
  const server = createServer(app.buildHandler())
  const port = process.env.PORT || 3000
  server.listen(port, () => console.log(`Server running at http://localhost:${port}`))
}
