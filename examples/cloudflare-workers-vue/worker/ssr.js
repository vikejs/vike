import { renderPage } from 'vike/server'

export { handleSsr }

async function handleSsr(url) {
  const pageContextInit = {
    urlOriginal: url,
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  const { readable, writable } = new TransformStream()
  httpResponse.pipe(writable)
  return new Response(readable)
}
