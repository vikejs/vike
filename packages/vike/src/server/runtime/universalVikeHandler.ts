import { enhance, getAdapterRuntime, getUniversal, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { middlewaresProxy_handlers, middlewaresProxy_middlewares } from './middlewaresProxy.js'
import { getAppMiddlewares, renderPageUniversal } from './middlewares.js'
import '../assertEnvServer.js'

// Vike's own server: `vike/fetch`, `vike(app)`, and `$ vike dev` and `$ vike preview` when the app has +middleware. It runs the two halves of
// `vike(app)` in a row.
async function universalVikeHandler(
  request: Request,
  // Missing upon `vike.fetch(request)`
  context: Universal.Context = {},
  runtime: RuntimeAdapterTarget<unknown> = getAdapterRuntime('other', { params: undefined }),
) {
  const middlewares = await getAppMiddlewares()
  // Only Vike's pages are listed (no +middleware, or an invalid config): they answer, without the two halves
  if (middlewares.length === 1) return renderPageUniversal(request, context, runtime)
  // A copy: the +middleware's context is merged into it, and a Cloudflare worker's `env` (its context) is shared by all requests
  context = { ...context }
  const answer = await getUniversal(middlewaresProxy_middlewares)(request, context, runtime)
  if (answer instanceof Response) return answer
  const response = (await getUniversal(middlewaresProxy_handlers)(request, context, runtime)) as Response
  return typeof answer === 'function' ? ((await answer(response)) ?? response) : response
}

const universalVikeHandlerEnhanced = enhance(universalVikeHandler, {
  name: 'vike',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  path: '/**',
  immutable: true,
})

export default universalVikeHandlerEnhanced
