import { enhance, type HttpMethod, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { renderPageServer } from './renderPageServer.js'
import { runHandlerMiddlewares } from './getUniversalMiddlewares.js'
import '../assertEnvServer.js'

// Servers install a handler only for the methods it declares, and a +middleware that is a handler can be on any method,
// so universalHandler declares them all. The pages answer the same methods as before.
const httpMethods: HttpMethod[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']
const pageMethods = ['GET', 'HEAD', 'POST', 'PUT', 'OPTIONS', 'PATCH']

async function universalVikeHandler<T extends string>(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<T>,
) {
  // The +middleware that are handlers run next to the pages, after the routes of the server; they can answer instead
  const handlerResponse = await runHandlerMiddlewares(request, context, runtime)
  if (handlerResponse) return handlerResponse
  // What a server answers for a method it has no route for
  if (!pageMethods.includes(request.method)) return new Response('Not Found', { status: 404 })
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
  method: httpMethods,
  path: '/**',
  immutable: true,
})

export default universalHandler
