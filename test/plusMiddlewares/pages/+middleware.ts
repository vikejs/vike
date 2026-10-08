import { enhance, MiddlewareOrder, type UniversalMiddleware } from '@universal-middleware/core'
import { renderPage } from 'vike/server'

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

// Modifies the response of every request
const responseHeaderMiddleware = enhance(
  async (_request, _context, runtime) => (response: Response) => {
    response.headers.append('x-middleware', runtime.adapter)
    return response
  },
  { name: 'responseHeaderMiddleware' },
)

// Calls renderPage(), like vike-react-rsc's server actions
const renderPageMiddleware = enhance(
  async (request: Request) => {
    const { httpResponse } = await renderPage({ urlOriginal: '/', headersOriginal: request.headers })
    return new Response(httpResponse.getReadableWebStream(), {
      status: httpResponse.statusCode,
      headers: httpResponse.headers,
    })
  },
  { name: 'renderPageMiddleware', method: 'GET', path: '/render-page-middleware' },
)

// A guard on a page also covers the page's data, which the client fetches on navigation
const guardMiddleware = enhance(
  async (request: Request) => {
    return new Response('guard', { status: request.headers.has('x-authenticated') ? 200 : 401 })
  },
  { name: 'guardMiddleware', method: 'GET', path: '/dash' },
)

// Builds context for the pages
const contextMiddleware = enhance(async () => ({ fromMw: 'yes' }), { name: 'contextMiddleware' })

// Passes the request on to the next handler
const passThroughMiddleware = enhance(async () => undefined, {
  name: 'passThroughMiddleware',
  method: 'GET',
  path: '/',
})

const adminAuth = enhance(
  async (request: Request) =>
    request.headers.has('x-auth') ? undefined : new Response('Unauthorized', { status: 401 }),
  { name: 'adminAuth', method: 'GET', path: '/admin/**', order: MiddlewareOrder.AUTHORIZATION },
)
const settingsHeader = enhance(
  async () => (response: Response) => {
    response.headers.set('x-settings', 'yes')
    return response
  },
  { name: 'settingsHeader', method: 'GET', path: '/admin/settings', order: MiddlewareOrder.HEADER_MANAGEMENT },
)

const orderZero = enhance(async () => new Response('order zero'), {
  name: 'orderZero',
  method: 'GET',
  path: '/order-zero',
  order: 0,
})

export default [
  contextMiddleware,
  passThroughMiddleware,
  middleware,
  redirectMiddleware,
  responseHeaderMiddleware,
  renderPageMiddleware,
  guardMiddleware,
  adminAuth,
  settingsHeader,
  orderZero,
]
