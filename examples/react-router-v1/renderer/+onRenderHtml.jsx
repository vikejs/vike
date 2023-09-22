// https://vike.dev/onRenderHtml
export default onRenderHtml

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'

async function onRenderHtml(pageContext) {
  const { Page, pageProps, urlPathname } = pageContext
  const pageHtml = renderToString(
    <StaticRouter location={urlPathname}>
      <Page {...pageProps} />
    </StaticRouter>
  )
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
