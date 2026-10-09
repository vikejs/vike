import { enhance, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { renderPageServer } from './renderPageServer.js'
import { runHandlerMiddlewares } from './getUniversalMiddlewares.js'
import '../assertEnvServer.js'

async function universalVikeHandler<T extends string>(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<T>,
) {
  // The +middleware that are handlers run next to the pages, after the routes of the server; they can answer instead
  const handlerResponse = await runHandlerMiddlewares(request, context, runtime)
  if (handlerResponse) return handlerResponse
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

const universalHandler = enhance(universalVikeHandler, {
  name: 'vike',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  path: '/**',
  immutable: true,
})

export default universalHandler
