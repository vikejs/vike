// https://vike.dev/onRenderHtml
export { onRenderHtml }

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageLayout } from './PageLayout'
import type { PageContextServer } from '#root/types'
import type { OnRenderHtmlSync } from 'vike/types'

const onRenderHtml: OnRenderHtmlSync = (pageContext: PageContextServer): ReturnType<OnRenderHtmlSync> => {
  const { Page } = pageContext
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
