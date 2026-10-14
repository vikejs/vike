export { vikeUniversalMiddleware }

import { enhance, getAdapterRuntime, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { getMiddlewaresPipe_handlers, getMiddlewaresPipe_nonHandlers } from './getMiddlewaresPipe.js'
import { routeCatchAll } from './core.js'
import '../../assertEnvServer.js'

// The Universal Middleware for Vike's built-in server.
// - The same two pipes that `vike(app)` applies, but without any user-land middlewares (there aren't any)
const vikeUniversalMiddleware = enhance(handler, routeCatchAll)
const pipeNonHandlers = getMiddlewaresPipe_nonHandlers([])
const pipeHandlers = getMiddlewaresPipe_handlers([])

async function handler(
  request: Request,
  context: Universal.Context = {},
  runtime: RuntimeAdapterTarget<unknown> = getAdapterRuntime('other', { params: undefined }),
) {
  // A copy: Universal Middleware's `pipe()` writes a returned context into it when a response function follows, and a Cloudflare worker's `env` (its context) is shared by all requests
  context = { ...context }
  const answer = await pipeNonHandlers(request, context, runtime)
  if (answer instanceof Response) return answer
  // The context the +middleware returned
  if (answer && typeof answer === 'object') context = answer
  const response = await pipeHandlers(request, context, runtime)
  return typeof answer === 'function' ? ((await answer(response)) ?? response) : response
}
