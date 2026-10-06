export { getUniversalMiddlewares }
export { universalMiddlewares }

import { getGlobalContextServerInternal } from './globalContext.js'
import { renderPageServerConfigError } from './renderPageServer.js'
import { addUrlForms } from './addUrlForms.js'
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
    // Fail closed: skipping the +middleware of an erroneous config would let requests through unguarded
    const pageContextConfigError = await renderPageServerConfigError({
      urlOriginal: request.url,
      headersOriginal: request.headers,
      _reqWeb: request,
    })
    if (pageContextConfigError) {
      const { httpResponse } = pageContextConfigError
      return new Response(httpResponse.getReadableWebStream(), {
        status: httpResponse.statusCode,
        headers: httpResponse.headers,
      })
    }
    const { globalContext } = await getGlobalContextServerInternal()
    const middlewares = (globalContext.config.middleware ?? [])
      .flat()
      .flatMap((middleware) => addUrlForms(middleware, globalContext.baseServer))
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
