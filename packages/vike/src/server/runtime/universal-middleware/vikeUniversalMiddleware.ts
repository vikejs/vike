export { vikeUniversalMiddleware }

import { enhance, getAdapterRuntime, type RuntimeAdapterTarget } from '@universal-middleware/core'
import { middlewaresPipe_handlers, middlewaresPipe_nonHandlers } from './middlewaresPipe.js'
import { routeCatchAll } from './core.js'
import '../../assertEnvServer.js'

// For Vike's built-in server: the two pipes that `vike(app)` applies, without any user-land middlewares (there aren't any)
const vikeUniversalMiddleware = enhance(handler, routeCatchAll)
const pipeNonHandlers = middlewaresPipe_nonHandlers([])
const pipeHandlers = middlewaresPipe_handlers([])

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
