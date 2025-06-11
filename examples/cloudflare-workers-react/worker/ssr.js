export { handleSsr }

import { renderPage } from 'vike/server'

async function handleSsr(url) {
  const pageContextInit = {
    urlOriginal: url,
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  return new Response(httpResponse.body, {
    headers: httpResponse.headers,
    status: httpResponse.statusCode,
  })
}
