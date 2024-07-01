/// <reference lib="webworker" />
import { renderPage } from 'vike/server'
// import { Writable } from 'node:stream';

export async function vikeHandler<Context extends Record<string | number | symbol, unknown>>(
  request: Request,
  context?: Context
): Promise<Response> {
  const pageContextInit = { ...context, urlOriginal: request.url, headersOriginal: request.headers }
  const pageContext = await renderPage(pageContextInit)
  const response = pageContext.httpResponse

  const { readable, writable } = new TransformStream()

  // response?.pipe(Writable.fromWeb(writable));
  response?.pipe(writable)

  return new Response(readable, {
    status: response?.statusCode,
    headers: response?.headers
  })
}
