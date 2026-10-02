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

export default [middlewareTelefunc, responseHeaderMiddleware]
