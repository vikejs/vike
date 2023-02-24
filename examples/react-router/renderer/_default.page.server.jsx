import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'

export { render }
export { passToClient }

const passToClient = ['pageProps']

async function render(pageContext) {
  const { Page, pageProps, urlPathname } = pageContext
  const pageHtml = renderToString(
    <StaticRouter location={urlPathname}>
      <Page {...pageProps} />
    </StaticRouter>
  )
  return escapeInject`<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
