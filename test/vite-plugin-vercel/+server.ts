import vike from '@vikejs/hono'
import { Hono } from 'hono'

function serve() {
  const app = new Hono()

  vike(app)

  app.get('/hello', () => {
    return new Response('Hello')
  })

  return app.fetch
}

export default {
  fetch: serve(),
}
