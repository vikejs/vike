import { enhance, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { renderPageServer } from './renderPageServer.js'
import '../assertEnvServer.js'

async function universalVikeHandler<T extends string>(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<T>,
) {
  const pageContextInit = {
    ...context,
    ...runtime,
    runtime,
    urlOriginal: request.url,
    headersOriginal: request.headers,
    _reqWeb: request,
  }
  const pageContext = await renderPageServer(pageContextInit)
  const response = pageContext.httpResponse
  const readable = response.getReadableWebStream()
  return new Response(readable, {
    status: response.statusCode,
    headers: response.headers,
  })
}

const universalVikeHandlerEnhanced = enhance(universalVikeHandler, {
  name: 'vike',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  path: '/**',
  immutable: true,
})

export default universalVikeHandlerEnhanced
