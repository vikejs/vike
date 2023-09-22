export default onRenderHtml

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageLayout } from './PageLayout'

function onRenderHtml(pageContext) {
  const { Page, routeParams } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout>
      <Page routeParams={routeParams} />
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
