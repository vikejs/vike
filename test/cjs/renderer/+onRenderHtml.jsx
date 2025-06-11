// https://vike.dev/onRenderHtml
export { onRenderHtml }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'

async function onRenderHtml(pageContext) {
  const { Page } = pageContext
  const viewHtml = dangerouslySkipEscape(
    renderToString(
      <Layout>
        <Page />
      </Layout>,
    ),
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${viewHtml}</div>
      </body>
    </html>`
}
