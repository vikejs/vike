import { renderPage } from 'vike/server'

export { handleSsr }

async function handleSsr(url: string, headers: Headers) {
  const pageContextInit = {
    urlOriginal: url,
    headersOriginal: headers,
    fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  const stream = httpResponse.getReadableWebStream()
  return new Response(stream, {
    headers: httpResponse.headers,
    status: httpResponse.statusCode,
  })
}
