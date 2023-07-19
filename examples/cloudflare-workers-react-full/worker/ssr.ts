import { renderPage } from 'vite-plugin-ssr/server'

export { handleSsr }

async function handleSsr(url: string, userAgent: string) {
  const pageContextInit = {
    urlOriginal: url,
    fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
    userAgent
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return null
  } else {
    const { statusCode: status, headers } = httpResponse
    const stream = httpResponse.getReadableWebStream()
    return new Response(stream, { headers, status })
  }
}
