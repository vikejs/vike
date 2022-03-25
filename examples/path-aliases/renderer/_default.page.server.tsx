export { render }

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { PageLayout } from './PageLayout'
import type { PageContext } from '#root/types'

function render(pageContext: PageContext) {
  const { Page } = pageContext
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout>
      <Page />
    </PageLayout>,
  )
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
