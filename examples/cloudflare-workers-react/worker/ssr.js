export { handleSsr }

import { renderPage } from 'vite-plugin-ssr'

async function handleSsr(url) {
  const pageContextInit = { url }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return null
  } else {
    const { body, statusCode, contentType } = httpResponse
    return new Response(body, {
      headers: { 'content-type': contentType },
      status: statusCode
    })
  }
}
