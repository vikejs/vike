import { createPageRenderer } from 'vite-plugin-ssr'

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
