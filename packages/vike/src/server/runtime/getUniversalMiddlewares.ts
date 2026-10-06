export { getUniversalMiddlewares }
export { universalMiddlewares }

import { getGlobalContextServerInternal, initGlobalContext_renderPage } from './globalContext.js'
import { getVikeConfigError } from '../../shared-server-node/getVikeConfigError.js'
import {
  enhance,
  getUniversal,
  getUniversalProp,
  nameSymbol,
  orderSymbol,
  pathSymbol,
  pipeRoute,
  type Awaitable,
  type EnhancedMiddleware,
  type HttpMethod,
  type RuntimeAdapter,
  type UniversalHandler,
} from '@universal-middleware/core'
import '../assertEnvServer.js'

/**
 * Get the Universal Middlewares that apply your `+middleware` to all HTTP requests.
 *
 * Only needed without `+server`: Vike applies `+middleware` before the `+server` handler.
 * Apply them before your server's other handlers, and Vike's handler last.
 *
 * @example
 * ```js
 * import { apply } from '@universal-middleware/express'
 * import { getUniversalMiddlewares, universalHandler } from 'vike'
 *
 * apply(app, getUniversalMiddlewares())
 * app.get('/api/hello', (req, res) => res.send('Hello'))
 * apply(app, [universalHandler])
 * ```
 *
 * https://github.com/magne4000/universal-middleware
 */
function getUniversalMiddlewares(): EnhancedMiddleware[] {
  return [universalMiddlewares]
}

const httpMethods: HttpMethod[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']
type ResponseHandler = (response: Response) => Awaitable<Response | undefined>

// Resolved upon each request: the Vike config imports +server, so awaiting the config while +server loads deadlocks
const universalMiddlewares = enhance(
  async (request: Request, context: Universal.Context, runtime: RuntimeAdapter) => {
    const middlewares = await getMiddlewares()
    if (middlewares.length === 0) return
    const responseHandlers: ResponseHandler[] = []
    // Universal Middleware's pipe() throws `No Response found` if nothing returns a Response
    const fallThrough = new Response(null)
    let contextAtFallThrough: Universal.Context | undefined
    const handler = pipeRoute([
      enhance(
        (_request: Request, context: Universal.Context) => {
          contextAtFallThrough = context
          return fallThrough
        },
        { name: 'vike:fall-through', method: httpMethods, path: '/**' },
      ),
      ...middlewares.map((middleware) => collectResponseHandler(middleware, responseHandlers)),
    ]) as UniversalHandler
    const response = await handler(request, context, runtime)
    // Response handlers returned by +middleware apply to the final response, which may come after this middleware
    const applyResponseHandlers = async (response: Response) => {
      for (const responseHandler of responseHandlers) response = (await responseHandler(response)) ?? response
      return response
    }
    if (response !== fallThrough) return applyResponseHandlers(response)
    // The pipe's context stays local: hand the context built by the +middleware to the handlers after this middleware.
    // A middleware returns a context or a response handler, not both: with response handlers, mutate the context instead.
    if (responseHandlers.length === 0) return contextAtFallThrough
    Object.assign(context, contextAtFallThrough)
    return applyResponseHandlers
  },
  { name: 'vike:middleware' },
)

function collectResponseHandler(middleware: EnhancedMiddleware, responseHandlers: ResponseHandler[]) {
  if (getUniversalProp(middleware, pathSymbol)) return middleware
  return enhance(
    async (...args: Parameters<UniversalHandler>) => {
      const result = await getUniversal(middleware)(...args)
      if (typeof result !== 'function') return result
      responseHandlers.push(result)
    },
    { name: getUniversalProp(middleware, nameSymbol), order: getUniversalProp(middleware, orderSymbol) },
  )
}

// Empty if the Vike config or global context is erroneous: renderPage() then shows the error.
async function getMiddlewares(): Promise<EnhancedMiddleware[]> {
  if (getVikeConfigError()) return []
  try {
    await initGlobalContext_renderPage()
  } catch {
    return []
  }
  const { globalContext } = await getGlobalContextServerInternal()
  return (globalContext.config.middleware ?? []).flat()
}
