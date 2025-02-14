import { renderPage } from './index.js'

export default async function universalVikeHandler(
  request: Request,
  context: Record<string, unknown>,
  runtime: Record<string, unknown>
) {
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
