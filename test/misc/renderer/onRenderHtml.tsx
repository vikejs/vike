// https://vike.dev/onRenderHtml
export default onRenderHtml

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
// @ts-expect-error
import { PageLayout } from './PageLayout'
import { getTitle } from './getTitle'
import type { PageContextServer } from 'vike/types'

async function onRenderHtml(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext
  const title = getTitle(pageContext)
  const viewHtml = dangerouslySkipEscape(
    renderToString(
      <PageLayout>
        <Page {...pageProps} />
      </PageLayout>
    )
  )

  // TODO: should always be an array
  if (!Array.isArray(pageContext.config.Head)) pageContext.config.Head = [pageContext.config.Head]

  const head = dangerouslySkipEscape(pageContext.config.Head.map((Head) => renderToString(<Head />)).join(''))

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${head}
      </head>
      <body>
        <div id="page-view">${viewHtml}</div>
      </body>
    </html>`
}
