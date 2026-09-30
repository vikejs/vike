import { enhance, type UniversalMiddleware } from '@universal-middleware/core'
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
  async () => (response: Response) => {
    response.headers.append('x-middleware', 'ran')
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

export default [middleware, redirectMiddleware, responseHeaderMiddleware, renderPageMiddleware]
