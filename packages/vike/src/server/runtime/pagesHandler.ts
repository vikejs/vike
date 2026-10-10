export { pageMethods }
export { pagesHandler }
export { renderPageResponse }

import { enhance, type HttpMethod, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { renderPageServer } from './renderPageServer.js'
import '../assertEnvServer.js'

// The pages answer these methods
const pageMethods: HttpMethod[] = ['GET', 'HEAD', 'POST', 'PUT', 'OPTIONS', 'PATCH']

async function renderPageResponse<T extends string>(
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
  }
  const pageContext = await renderPageServer(pageContextInit)
  const response = pageContext.httpResponse
  const readable = response.getReadableWebStream()
  return new Response(readable, {
    status: response.statusCode,
    headers: response.headers,
  })
}

// Vike's catch-all, the last element of globalContext.middlewares. The +middleware that are handlers are elements of their own.
const pagesHandler = Object.assign(
  enhance(renderPageResponse, {
    name: 'vike',
    method: pageMethods,
    path: '/**',
    immutable: true,
  }),
  { isHandler: true },
)
