export default universalVikeHandler

import type { RuntimeAdapterTarget } from '@universal-middleware/core'
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
  }
  const pageContext = await renderPageServer(pageContextInit)
  const response = pageContext.httpResponse
  const readable = response.getReadableWebStream()
  return new Response(readable, {
    status: response.statusCode,
    headers: response.headers,
  })
}
