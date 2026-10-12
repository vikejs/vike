export { vikeUniversalMiddleware }

import { enhance, getAdapterRuntime, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { middlewaresProxy_handlers, middlewaresProxy_nonHandlers } from './middlewaresProxy.js'
import '../../assertEnvServer.js'

// Vike's own server has no user-land universal middlewares
const nonHandlers = middlewaresProxy_nonHandlers([])
const handlersAndPages = middlewaresProxy_handlers([])

// Vike's own server (`vike/fetch`, `$ vike dev` and `$ vike preview`): the two halves that `vike(app)` applies, in a row
async function handler(
  request: Request,
  // Missing upon `vike.fetch(request)`
  context: Universal.Context = {},
  runtime: RuntimeAdapterTarget<unknown> = getAdapterRuntime('other', { params: undefined }),
) {
  // A copy: the +middleware's context is merged into it, and a Cloudflare worker's `env` (its context) is shared by all requests
  context = { ...context }
  const answer = await nonHandlers(request, context, runtime)
  if (answer instanceof Response) return answer
  const response = await handlersAndPages(request, context, runtime)
  return typeof answer === 'function' ? ((await answer(response)) ?? response) : response
}

const vikeUniversalMiddleware = enhance(handler, {
  name: 'vike',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
  path: '/**',
  immutable: true,
})
