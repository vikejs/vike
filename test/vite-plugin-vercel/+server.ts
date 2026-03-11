import { addVikeMiddleware } from '@vikejs/hono'
import { Hono } from 'hono'

function serve() {
  const app = new Hono()

  app.get('/hello', () => {
    return new Response('Hello')
  })

  addVikeMiddleware(app)

  return app.fetch
}

export default {
  fetch: serve(),
}
