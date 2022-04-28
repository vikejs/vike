import { renderPage } from 'vite-plugin-ssr'

export { handleSsr }

async function handleSsr(url: string, userAgent: string) {
  const pageContextInit = {
    url,
    fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
    userAgent,
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return null
  } else {
    const { statusCode, contentType } = httpResponse
    const stream = httpResponse.getWebStream()
    return new Response(stream, {
      headers: { 'content-type': contentType },
      status: statusCode,
    })
  }
}
