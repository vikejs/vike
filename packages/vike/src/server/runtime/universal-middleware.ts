import { enhance, getAdapterRuntime, getUniversal, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { middlewaresAfterRoutes, middlewaresBeforeRoutes } from './middlewareProxy.js'
import '../assertEnvServer.js'

// Vike's own server: `vike/fetch`, `vike(app)`, and `$ vike dev` and `$ vike preview` when the app has +middleware. It runs the two halves of
// `vike(app)` in a row.
async function universalVikeHandler(
  request: Request,
  // Missing upon `vike.fetch(request)`
  context: Universal.Context = {},
  runtime: RuntimeAdapterTarget<unknown> = getAdapterRuntime('other', { params: undefined }),
) {
  // A copy: the +middleware's context is merged into it, and a Cloudflare worker's `env` (its context) is shared by all requests
  context = { ...context }
  const answer = await getUniversal(middlewaresBeforeRoutes)(request, context, runtime)
  if (answer instanceof Response) return answer
  const response = (await getUniversal(middlewaresAfterRoutes)(request, context, runtime)) as Response
  return typeof answer === 'function' ? ((await answer(response)) ?? response) : response
}

const universalVikeHandlerEnhanced = enhance(universalVikeHandler, {
  name: 'vike',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  path: '/**',
  immutable: true,
})

export default universalVikeHandlerEnhanced
