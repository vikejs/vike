import { createPageRender } from 'vite-plugin-ssr'
// We load `importBuild.js` so that the worker code can be bundled into a single file
import '../dist/server/importBuild.js'

const renderPage = createPageRender({ isProduction: true })

export default async (req, res) => {
  const { url } = req
  const pageContext = { url }
  const result = await renderPage(pageContext)
  if (result.nothingRendered) {
    res.status(200).send('')
  } else {
    res.status(result.statusCode).setHeader('content-type', 'text/html').send(result.renderResult)
  }
}
