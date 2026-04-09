export { middlewareTelefunc }

import { type UniversalMiddleware, enhance } from '@universal-middleware/core'
import { telefunc } from 'telefunc'

const telefuncUniversalMiddleware: UniversalMiddleware = async (request, context, runtime) => {
  const httpResponse = await telefunc({
    request,
    context: {
      ...context,
      ...runtime,
    },
  })
  const { body, statusCode, contentType } = httpResponse
  return new Response(body, {
    status: statusCode,
    headers: {
      'content-type': contentType,
    },
  })
}

const middlewareTelefunc = enhance(telefuncUniversalMiddleware, {
  name: 'telefunc',
  method: 'POST',
  path: '/_telefunc',
})
