import { enhance, MiddlewareOrder, type UniversalMiddleware } from '@universal-middleware/core'

const someUniversalMiddleware: UniversalMiddleware = async () => {
  return new Response('OK')
}

const middleware = enhance(someUniversalMiddleware, {
  name: 'middleware',
  method: 'GET',
  path: '/middleware',
})

const redirectUniversalMiddleware: UniversalMiddleware = async () => {
  return new Response(null, { status: 303, headers: { Location: '/' } })
}

const redirectMiddleware = enhance(redirectUniversalMiddleware, {
  name: 'redirectMiddleware',
  method: 'GET',
  path: '/redirect-middleware',
})

const adminAuth = enhance(
  async (request: Request) =>
    request.headers.has('x-auth') ? undefined : new Response('Unauthorized', { status: 401 }),
  { name: 'adminAuth', method: 'GET', path: '/admin/**', order: MiddlewareOrder.AUTHORIZATION },
)
const dashAuth = enhance(
  async (request: Request) =>
    request.headers.has('x-auth') ? undefined : new Response('Unauthorized', { status: 401 }),
  { name: 'dashAuth', method: 'GET', path: '/dash', order: MiddlewareOrder.AUTHORIZATION },
)
const guardedRedirect = enhance(async () => new Response(null, { status: 302, headers: { Location: '/login' } }), {
  name: 'guardedRedirect',
  method: 'GET',
  path: '/guarded',
  order: MiddlewareOrder.AUTHORIZATION,
})
// Answers the page and its .pageContext.json with a login page, with status 200
const portalLogin = enhance(
  async () => new Response('<p>Log in to continue</p>', { headers: { 'content-type': 'text/html' } }),
  { name: 'portalLogin', method: 'GET', path: '/portal', order: MiddlewareOrder.AUTHENTICATION },
)
const settingsHeader = enhance(
  async () => (response: Response) => {
    response.headers.set('x-settings', 'yes')
    return response
  },
  { name: 'settingsHeader', method: 'GET', path: '/admin/settings', order: MiddlewareOrder.HEADER_MANAGEMENT },
)

// Adds a header to the response of a /wrapped page, or replaces it, `.pageContext.json` included
const wrapResponse = enhance(
  async (request: Request) => (response: Response) => {
    if (!new URL(request.url).pathname.startsWith('/wrapped')) return response
    if (request.headers.has('x-replace')) return new Response('Replaced', { status: 401 })
    response.headers.set('x-wrapped', 'yes')
    return response
  },
  { name: 'wrapResponse', order: MiddlewareOrder.HEADER_MANAGEMENT },
)

const orderZero = enhance(async () => new Response('order zero'), {
  name: 'orderZero',
  method: 'GET',
  path: '/order-zero',
  order: 0,
})

export default [
  middleware,
  redirectMiddleware,
  adminAuth,
  dashAuth,
  guardedRedirect,
  portalLogin,
  settingsHeader,
  wrapResponse,
  orderZero,
]
