// https://vike.dev/onRenderHtml
export { onRenderHtml }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageLayout } from './PageLayout'

async function onRenderHtml(pageContext) {
  const { Page, pageProps } = pageContext
  const page = (
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  )
  const pageHtml = renderToString(page)

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
