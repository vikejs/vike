export { vikeUniversalMiddleware }

import { enhance, getAdapterRuntime, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { applyNonHandlers, middlewaresProxy_handlers } from './middlewaresProxy.js'
import { getMiddlewares_withErrorHandling, renderPageServer_universal } from './core.js'
import '../../assertEnvServer.js'

// Vike's own server (`vike/fetch`, `$ vike dev` and `$ vike preview`): the two halves that `vike(app)` applies, in a row
async function handler(
  request: Request,
  // Missing upon `vike.fetch(request)`
  context: Universal.Context = {},
  runtime: RuntimeAdapterTarget<unknown> = getAdapterRuntime('other', { params: undefined }),
) {
  const middlewares = await getMiddlewares_withErrorHandling()
  // Only Vike's pages are listed (no +middleware, or an invalid config): they answer, without the two halves
  if (middlewares.length === 1) return renderPageServer_universal(request, context, runtime)
  // A copy: the +middleware's context is merged into it, and a Cloudflare worker's `env` (its context) is shared by all requests
  context = { ...context }
  // Vike's own server has no user-land universal middlewares
  const answer = await applyNonHandlers(middlewares, request, context, runtime, [])
  if (answer instanceof Response) return answer
  const response = await middlewaresProxy_handlers(request, context, runtime)
  return typeof answer === 'function' ? ((await answer(response)) ?? response) : response
}

const vikeUniversalMiddleware = enhance(handler, {
  name: 'vike',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  path: '/**',
  immutable: true,
})
