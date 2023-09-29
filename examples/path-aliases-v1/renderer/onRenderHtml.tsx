// https://vike.dev/onRenderHtml
export default onRenderHtml

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageLayout } from './PageLayout'
import { ReactComponent } from '#root/types'
import type { PageContextServer } from 'vike/types'

function onRenderHtml(pageContext: PageContextServer) {
  const Page = pageContext.Page as ReactComponent
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout>
      <Page />
    </PageLayout>
  )
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
