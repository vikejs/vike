import { enhance, MiddlewareOrder } from '@universal-middleware/core'

// Middlewares: they run before the app's own routes. `auth`, listed first, runs after `user` (by `order`) and reads the context it adds.
const auth = enhance(
  (_request: Request, context: Universal.Context) =>
    context.user ? undefined : new Response('Unauthorized', { status: 401 }),
  { name: 'auth', path: '/api/**', order: MiddlewareOrder.AUTHORIZATION },
)
const user = enhance(
  (request: Request) => (request.headers.has('x-user') ? { user: request.headers.get('x-user') } : undefined),
  { name: 'user', order: MiddlewareOrder.AUTHENTICATION },
)
// A response function: it makes Universal Middleware's pipe() write the context `user` returns into the context it's given
const header = enhance(
  () => (response: Response) => {
    response.headers.set('x-middleware', 'yes')
    return response
  },
  { name: 'header', order: MiddlewareOrder.HEADER_MANAGEMENT },
)

// Handlers: they run after the app's own routes, which can override them
const fromMiddleware = enhance(
  (_request: Request, context: Universal.Context) =>
    new Response(`Hello from +middleware${context.user ? ` for ${context.user}` : ''}`),
  {
    name: 'fromMiddleware',
    path: '/from-middleware',
    method: 'GET',
  },
)
const overridden = enhance(() => new Response('Answered by +middleware'), {
  name: 'overridden',
  path: '/hello',
  method: 'GET',
})

export default [auth, user, header, fromMiddleware, overridden]
