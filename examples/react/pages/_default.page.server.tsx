import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { PageLayout } from '../components/PageLayout/PageLayout'
import { html } from 'vite-plugin-ssr'

export { render }

function render({
  Page,
  pageProps,
  contextProps
}: {
  Page: (pageProps: any) => JSX.Element
  pageProps: any
  contextProps: { title?: string }
}) {
  const pageContent = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )

  const title = contextProps.title || 'Demo: vite-plugin-ssr'

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${html.sanitize(title)}</title>
      </head>
      <body>
        <div id="page-content">${html.dangerouslySetHtml(pageContent)}</div>
      </body>
    </html>`
}
