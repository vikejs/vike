import { enhance, type UniversalMiddleware } from '@universal-middleware/core'

const someUniversalMiddleware: UniversalMiddleware = async () => {
  return new Response('OK')
}

const middleware = enhance(someUniversalMiddleware, {
  name: 'middleware',
  method: 'GET',
  path: '/middleware',
})

// A +middleware returning a redirect (3xx) Response.
// Using a capital-L `Location` header on purpose: the Web `Headers` object lower-cases it to
// `location`, which used to crash Vike's request logger (`assert(headerRedirect)`). See:
// https://github.com/vikejs/vike/issues/3357
const redirectUniversalMiddleware: UniversalMiddleware = async () => {
  return new Response(null, { status: 303, headers: { Location: '/' } })
}

const redirectMiddleware = enhance(redirectUniversalMiddleware, {
  name: 'redirectMiddleware',
  method: 'GET',
  path: '/redirect-middleware',
})

export default [middleware, redirectMiddleware]
