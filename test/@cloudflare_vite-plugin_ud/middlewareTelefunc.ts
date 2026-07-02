export { middlewareTelefunc }

import { type UniversalMiddleware, enhance } from '@universal-middleware/core'
import { serve } from 'telefunc'

const telefuncUniversalMiddleware: UniversalMiddleware = async (request, context, runtime) => {
  const httpResponse = await serve({
    request,
    context: {
      ...context,
      ...runtime,
    },
  })
  const { body, statusCode, headers } = httpResponse
  return new Response(body, {
    status: statusCode,
    headers,
  })
}

const middlewareTelefunc = enhance(telefuncUniversalMiddleware, {
  name: 'telefunc',
  method: 'POST',
  path: '/_telefunc',
})
