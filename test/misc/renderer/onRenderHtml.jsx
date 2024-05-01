// https://vike.dev/onRenderHtml
export default onRenderHtml

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageLayout } from './PageLayout'
import { getTitle } from './getTitle'

async function onRenderHtml(pageContext) {
  const { Page, pageProps } = pageContext
  const title = getTitle(pageContext)
  const viewHtml = dangerouslySkipEscape(
    renderToString(
      <PageLayout>
        <Page {...pageProps} />
      </PageLayout>
    )
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${viewHtml}</div>
      </body>
    </html>`
}
