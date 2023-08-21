export default onRenderHtml

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import { PageLayout } from './PageLayout'
import type { PageContextServer } from './types'

function onRenderHtml(pageContext: PageContextServer) {
  const { Page } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout pageContext={pageContext}>
      <Page />
    </PageLayout>
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
