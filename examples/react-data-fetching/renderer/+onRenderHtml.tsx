// https://vike.dev/onRenderHtml
export { onRenderHtml }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { PageShell } from './PageShell'
import { getPageTitle } from './getPageTitle'
import type { OnRenderHtmlAsync } from 'vike/types'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext

  const viewHtml = dangerouslySkipEscape(
    renderToString(
      <PageShell pageContext={pageContext}>
        <Page />
      </PageShell>
    )
  )

  const title = getPageTitle(pageContext)

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
