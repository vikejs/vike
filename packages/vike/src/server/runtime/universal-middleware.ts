import { enhance, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { renderPageServer } from './renderPageServer.js'
import '../assertEnvServer.js'

async function universalVikeHandler<T extends string>(
  request: Request,
  context: Universal.Context,
  runtime: RuntimeAdapterTarget<T>,
) {
  // Set pageContext.req and pageContext.res as aliases of pageContext.runtime.req and pageContext.runtime.res.
  // https://vike.dev/pageContext#req
  // The aliases don't override custom pageContext properties defined by the user:
  //  - pageContext.req / pageContext.res defined by another universal middleware (via `context`) take precedence: `...context` is spread after `...reqResAlias`.
  //  - pageContext.req / pageContext.res defined by +onCreatePageContext take precedence as well: +onCreatePageContext is executed later.
  // We don't spread the whole `runtime` object (`...runtime`) to avoid polluting pageContext with all the runtime adapter's properties.
  const reqResAlias: { req?: unknown; res?: unknown } = {}
  if ('req' in runtime) reqResAlias.req = (runtime as { req: unknown }).req
  if ('res' in runtime) reqResAlias.res = (runtime as { res: unknown }).res

  const pageContextInit = {
    ...reqResAlias,
    ...context,
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
