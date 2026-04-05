import vike from '@vikejs/hono'
import { Hono } from 'hono'

function serve() {
  const app = new Hono()

  app.get('/hello', () => {
    return new Response('Hello')
  })

  vike(app)

  return app.fetch
}

export default {
  fetch: serve(),
}
