export { handleSsr }

import { renderPage } from 'vike/server'

async function handleSsr(url: URL) {
  const pageContextInit = {
    urlOriginal: url.href,
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  return new Response(httpResponse.body, {
    headers: httpResponse.headers,
    status: httpResponse.statusCode,
  })
}
