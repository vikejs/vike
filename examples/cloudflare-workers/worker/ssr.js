import { createPageRenderer } from 'vite-plugin-ssr'
// `importBuild.js` enables us to bundle our worker code into a single file, see https://vite-plugin-ssr.com/cloudflare-workers and https://vite-plugin-ssr.com/importBuild.js
import '../dist/server/importBuild.js'

export { handleSsr }

const renderPage = createPageRenderer({ isProduction: true })

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
