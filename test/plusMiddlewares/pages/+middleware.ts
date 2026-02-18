import { enhance, type UniversalMiddleware } from '@universal-middleware/core'

const someUniversalMiddleware: UniversalMiddleware = async () => {
  return new Response('OK')
}

const middleware = enhance(someUniversalMiddleware, {
  name: 'middleware',
  method: 'GET',
  path: '/middleware',
})

export default middleware
