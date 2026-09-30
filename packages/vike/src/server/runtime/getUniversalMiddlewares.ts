export { getUniversalMiddlewares }
export { universalMiddlewares }

import { getGlobalContextServerInternal, initGlobalContext_renderPage } from './globalContext.js'
import { getVikeConfigError } from '../../shared-server-node/getVikeConfigError.js'
import {
  apply,
  enhance,
  getAdapterRuntime,
  getUniversal,
  getUniversalProp,
  nameSymbol,
  orderSymbol,
  pathSymbol,
  universalSymbol,
  UniversalRouter,
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
 * Apply them before your server's other handlers, and Vike's handler last.
 *
 * @example
 * ```js
 * import vike, { apply } from '@vikejs/express'
 * import { getUniversalMiddlewares } from 'vike/getUniversalMiddlewares'
 *
 * apply(app, getUniversalMiddlewares())
 * app.get('/api/hello', (req, res) => res.send('Hello'))
 * vike(app)
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
  async (
    request: Request,
    context?: Universal.Context,
    runtime?: RuntimeAdapter,
  ): Promise<Response | ((response: Response) => Promise<Response>) | undefined> => {
    const middlewares = await getMiddlewares()
    if (middlewares.length === 0) return
    // Response handlers returned by +middleware apply to the final response, which may come after this middleware
    const responseHandlers: ResponseHandler[] = []
    const applyResponseHandlers = async (response: Response) => {
      for (const responseHandler of responseHandlers) response = (await responseHandler(response)) ?? response
      return response
    }
    const router = new UniversalRouter(true, false)
    // Universal Middleware throws `No Response found` if no handler matches
    const fallThrough = new Response(null)
    apply(router, [
      enhance(() => fallThrough, { name: 'vike:fall-through', method: httpMethods, path: '/**', immutable: true }),
      ...middlewares.map((middleware) => collectResponseHandler(middleware, responseHandlers)),
    ])
    const handler = router[universalSymbol] as UniversalHandler
    const response = await handler(request, context ?? {}, runtime ?? getAdapterRuntime('other', { params: undefined }))
    if (response !== fallThrough) return applyResponseHandlers(response)
    if (responseHandlers.length > 0) return applyResponseHandlers
  },
  { name: 'vike:middleware', immutable: true },
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
