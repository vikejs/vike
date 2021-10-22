import { createPageRenderer } from 'vite-plugin-ssr'
// `importBuild.js` enables Vercel to bundle our serverless functions, see https://vite-plugin-ssr.com/vercel and https://vite-plugin-ssr.com/importBuild.js
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
