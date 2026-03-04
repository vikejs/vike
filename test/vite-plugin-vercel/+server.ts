import { apply } from '@universal-middleware/hono'
import { Hono } from 'hono'
import vikeMiddleware from 'vike/universal-middleware'

function serve() {
  const app = new Hono()

  app.get('/hello', () => {
    return new Response('Hello')
  })

  apply(app, [vikeMiddleware])

  return app.fetch
}

export default {
  fetch: serve(),
}
