import { renderPage } from 'vite-plugin-ssr/server'

export { handleSsr }

async function handleSsr(url) {
  const pageContextInit = {
    urlOriginal: url
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return null
  } else {
    const { readable, writable } = new TransformStream()
    httpResponse.pipe(writable)
    return new Response(readable)
  }
}
