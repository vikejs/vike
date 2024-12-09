/// <reference lib="webworker" />
import { renderPage } from 'vike/server'
// TODO: stop using universal-middleware and directly integrate server middlewares instead. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import type { Get, UniversalHandler } from '@universal-middleware/core'

export const vikeHandler: Get<[], UniversalHandler> = () => async (request, context, runtime) => {
  const pageContextInit = { ...context, ...runtime, urlOriginal: request.url, headersOriginal: request.headers }
  const pageContext = await renderPage(pageContextInit)
  const response = pageContext.httpResponse

  const { readable, writable } = new TransformStream()
  response.pipe(writable)

  return new Response(readable, {
    status: response.statusCode,
    headers: response.headers
  })
}
