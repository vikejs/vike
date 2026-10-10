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

// Listed before `authUser`, ordered after it: it reads the context `authUser` adds
const adminAuth = enhance(
  async (_request: Request, context: Universal.Context) =>
    context.isAuth ? undefined : new Response('Unauthorized', { status: 401 }),
  { name: 'adminAuth', method: 'GET', path: '/admin/**', order: MiddlewareOrder.AUTHORIZATION },
)
const authUser = enhance(async (request: Request) => (request.headers.has('x-auth') ? { isAuth: true } : undefined), {
  name: 'authUser',
  order: MiddlewareOrder.AUTHENTICATION,
})
// Ordered after `adminAuth`: the first Response answers
const lateAnswer = enhance(
  async (request: Request) => (request.headers.has('x-late') ? new Response('Too late') : undefined),
  { name: 'lateAnswer', method: 'GET', path: '/admin/**', order: MiddlewareOrder.RESPONSE_TRANSFORM },
)
// An auth +middleware that answers with JSON
const jsonAuth = enhance(
  async (request: Request) =>
    request.headers.has('x-auth') ? undefined : Response.json({ error: 'unauthorized' }, { status: 401 }),
  { name: 'jsonAuth', method: 'GET', path: '/json-admin', order: MiddlewareOrder.AUTHORIZATION },
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

// With an x-replace header, replaces the response to the /wrapped page, .pageContext.json included
const replaceResponse = enhance(
  async (request: Request) => (response: Response) =>
    request.headers.has('x-replace') ? new Response('Replaced', { status: 401 }) : response,
  { name: 'replaceResponse', method: 'GET', path: '/wrapped', order: MiddlewareOrder.HEADER_MANAGEMENT },
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
  authUser,
  lateAnswer,
  jsonAuth,
  guardedRedirect,
  portalLogin,
  settingsHeader,
  replaceResponse,
  orderZero,
]
