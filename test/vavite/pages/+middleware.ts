import { enhance } from '@universal-middleware/core'

const responseHeaderMiddleware = enhance(
  async () => (response: Response) => {
    response.headers.append('x-middleware', 'ran')
    return response
  },
  { name: 'responseHeaderMiddleware' },
)

const contextMiddleware = enhance(async () => ({ testMiddlewareContext: 'from +middleware' }), {
  name: 'contextMiddleware',
})

export default [responseHeaderMiddleware, contextMiddleware]
