import { enhance, MiddlewareOrder } from '@universal-middleware/core'
import { renderPage } from 'vike/server'

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

// Adds to the context too, between `user` and `auth`
const locale = enhance(() => ({ locale: 'en' }), { name: 'locale', order: MiddlewareOrder.AUTHENTICATION + 10 })

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

// A +middleware that renders the page itself (e.g. a server action)
const rendering = enhance(
  async (request: Request) => {
    if (!request.headers.has('x-render')) return
    const { httpResponse } = await renderPage({ urlOriginal: request.url })
    return new Response(httpResponse.body, { status: httpResponse.statusCode, headers: httpResponse.headers })
  },
  { name: 'rendering' },
)

export default [auth, user, locale, counter, hello, overridden, rendering]
