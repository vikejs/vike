export { middlewareVike }

import { type UniversalMiddleware, enhance } from '@universal-middleware/core'
import { renderPage } from 'vike/server'

const vikeUniversalMiddleware: UniversalMiddleware = async (request, context, runtime) => {
  const pageContextInit = { ...context, ...runtime, urlOriginal: request.url, headersOriginal: request.headers }
  const pageContext = await renderPage(pageContextInit)
  const response = pageContext.httpResponse

  const { readable, writable } = new TransformStream()
  response.pipe(writable)

  return new Response(readable, {
    status: response.statusCode,
    headers: response.headers
  })
}

const middlewareVike = enhance(vikeUniversalMiddleware, {
  name: 'vike',
  method: 'GET',
  path: '/**'
})
