import { createPageRenderer } from 'vite-plugin-ssr'
// `importBuild.js` enables us to bundle our worker code into a single file, see https://vite-plugin-ssr.com/cloudflare-workers and https://vite-plugin-ssr.com/importBuild.js
import '../dist/server/importBuild.js'

export { handleSsr }

const renderPage = createPageRenderer({ isProduction: true })

async function handleSsr(url) {
  const pageContextInit = { url }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return null
  } else {
    const { readable, writable } = new TransformStream()
    httpResponse.pipeToWebWritable(writable)
    return new Response(readable)
  }
}
