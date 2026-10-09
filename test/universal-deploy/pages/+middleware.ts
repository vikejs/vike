import { enhance } from '@universal-middleware/core'
import { middlewareTelefunc } from './middlewareTelefunc'

// Modifies the response of every request, including the ones +server.ts answers itself
const responseHeaderMiddleware = enhance(
  async (_request, _context, runtime) => (response: Response) => {
    response.headers.append('x-middleware', runtime.adapter)
    return response
  },
  { name: 'responseHeaderMiddleware' },
)

// Handlers (a path and no order): they run after the routes of +server.ts, which can override them
const handlerMiddleware = enhance(async () => new Response('from +middleware'), {
  name: 'handlerMiddleware',
  method: 'GET',
  path: '/handler',
})
const overriddenMiddleware = enhance(async () => new Response('from +middleware'), {
  name: 'overriddenMiddleware',
  method: 'GET',
  path: '/overridden',
})

export default [middlewareTelefunc, responseHeaderMiddleware, handlerMiddleware, overriddenMiddleware]
