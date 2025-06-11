import { renderPage } from './index.js'

export default async function universalVikeHandler(
  request: Request,
  context: Record<string, unknown>,
  runtime: Record<string, unknown>,
) {
  const pageContextInit = {
    ...context,
    ...runtime,
    runtime,
    urlOriginal: request.url,
    headersOriginal: request.headers,
  }
  const pageContext = await renderPage(pageContextInit)
  const response = pageContext.httpResponse
  const readable = response.getReadableWebStream()
  return new Response(readable, {
    status: response.statusCode,
    headers: response.headers,
  })
}
