export default onRenderHtml

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'

async function onRenderHtml(pageContext) {
  const { Page, pageProps } = pageContext
  const viewHtml = dangerouslySkipEscape(
    renderToString(
      <Layout>
        <Page {...pageProps} />
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
