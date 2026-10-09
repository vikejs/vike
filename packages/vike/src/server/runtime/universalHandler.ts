export { pageMethods }

import { enhance, type HttpMethod, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { renderPageServer } from './renderPageServer.js'
import { httpMethods, runHandlerMiddlewares } from './getUniversalMiddlewares.js'
import '../assertEnvServer.js'

// The pages answer these methods; universalHandler declares them all (httpMethods) so that a +middleware handler can be on any
const pageMethods: HttpMethod[] = ['GET', 'HEAD', 'POST', 'PUT', 'OPTIONS', 'PATCH']

async function universalVikeHandler<T extends string>(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<T>,
) {
  // The +middleware that are handlers run next to the pages, after the routes of the server; they can answer instead
  const handlerResponse = await runHandlerMiddlewares(request, context, runtime)
  if (handlerResponse) return handlerResponse
  // What a server answers for a method it has no route for
  if (!pageMethods.includes(request.method as HttpMethod)) return new Response('Not Found', { status: 404 })
  const pageContextInit = {
    ...context,
    ...runtime,
    runtime,
    urlOriginal: request.url,
    headersOriginal: request.headers,
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
  method: httpMethods,
  path: '/**',
  immutable: true,
})

export default universalHandler
