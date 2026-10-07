import { enhance, type UniversalMiddleware } from '@universal-middleware/core'

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

// Two +middleware with a `path` that both match /admin/settings: both run, and the page still renders
const adminAuth = enhance(
  async (request: Request) =>
    request.headers.has('x-auth') ? undefined : new Response('Unauthorized', { status: 401 }),
  { name: 'adminAuth', method: 'GET', path: '/admin/**' },
)
const settingsHeader = enhance(
  async () => (response: Response) => {
    response.headers.set('x-settings', 'yes')
    return response
  },
  { name: 'settingsHeader', method: 'GET', path: '/admin/settings' },
)

// `order: 0` makes a +middleware with a `path` a route in Universal Middleware: it still answers its path
const orderZero = enhance(async () => new Response('order zero'), {
  name: 'orderZero',
  method: 'GET',
  path: '/order-zero',
  order: 0,
})

export default [middleware, redirectMiddleware, adminAuth, settingsHeader, orderZero]
