export { middlewareTelefunc }

import { telefunc } from 'telefunc'
import type { UniversalMiddleware } from '@universal-middleware/core'
import type { Middleware } from './Middleware'

const telefuncUniversalMiddleware: UniversalMiddleware = async (request, context, runtime) => {
  const url = request.url.toString()
  const urlParsed = new URL(url)

  if (urlParsed.pathname !== '/_telefunc') return

  const httpResponse = await telefunc({
    url,
    method: request.method,
    body: await request.text(),
    context: {
      ...context,
      ...runtime
    }
  })
  const { body, statusCode, contentType } = httpResponse
  return new Response(body, {
    status: statusCode,
    headers: {
      'content-type': contentType
    }
  })
}

const middlewareTelefunc: Middleware[] = [
  {
    name: 'telefunc',
    order: 'pre',
    value: telefuncUniversalMiddleware
  }
]
