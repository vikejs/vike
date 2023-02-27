import { builder, Handler } from '@netlify/functions'
import { renderPage } from 'vite-plugin-ssr'

export const handler: Handler = builder(async (event) => {
  if (process.env.CONTEXT !== 'dev') {
    await import('../dist/server/importBuild.cjs')
  }

  const pageContext = await renderPage({ urlOriginal: event.rawUrl })

  if (!pageContext.httpResponse) {
    return { statusCode: 200 }
  }

  return {
    statusCode: pageContext.httpResponse.statusCode,
    headers: {
      'Content-Type': pageContext.httpResponse.contentType
    },
    body: pageContext.httpResponse.body
  }
})
