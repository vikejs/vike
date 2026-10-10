import { enhance, MiddlewareOrder } from '@universal-middleware/core'

// Middlewares: they run before the app's own routes. `auth`, listed first, runs after `user` (by `order`) and reads the context it adds.
const auth = enhance(
  (_request: Request, context: Universal.Context) =>
    context.user ? undefined : new Response('Unauthorized', { status: 401 }),
  { name: 'auth', path: '/api/**', order: MiddlewareOrder.AUTHORIZATION },
)
const user = enhance(
  (request: Request) => (request.headers.has('x-user') ? { user: request.headers.get('x-user') } : undefined),
  {
    name: 'user',
    order: MiddlewareOrder.AUTHENTICATION,
  },
)

// Counts how often +middleware run for a request
const counter = enhance(
  () => (response: Response) => {
    response.headers.append('x-middleware', 'counter')
    return response
  },
  { name: 'counter', order: MiddlewareOrder.CUSTOM_PRE_PROCESSING },
)

// Handlers: they run after the app's own routes, which can override them
const hello = enhance(() => new Response('Hello from +middleware'), { name: 'hello', path: '/hello', method: 'GET' })
const overridden = enhance(() => new Response('Answered by +middleware'), {
  name: 'overridden',
  path: '/overridden',
  method: 'GET',
})

export default [auth, user, counter, hello, overridden]
