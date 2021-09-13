import { createPageRenderer } from 'vite-plugin-ssr'
// We load `importBuild.js` so that the worker code can be bundled into a single file
import '../dist/server/importBuild.js'

const renderPage = createPageRenderer({ isProduction: true })

export default async (req, res) => {
  const { url } = req
  const pageContextInit = { url }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    res.status(200).send('')
  } else {
    const { body, statusCode } = httpResponse
    res.status(statusCode).setHeader('content-type', 'text/html').send(body)
  }
}
