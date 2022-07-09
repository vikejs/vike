import { renderPage } from 'vite-plugin-ssr'

export { handleSsr }

async function handleSsr(url) {
  const pageContextInit = {
    url,
    fetch: (...args) => fetch(...args),
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return null
  } else {
    const { body, statusCode, contentType } = httpResponse
    return new Response(body, {
      headers: { 'content-type': contentType },
      status: statusCode,
    })
  }
}
