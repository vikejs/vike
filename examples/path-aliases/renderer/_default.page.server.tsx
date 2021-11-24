import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { PageContext } from './types'

export { render }

function render(pageContext: PageContext) {
  const { Page } = pageContext
  const pageViewHtml = ReactDOMServer.renderToString(<Page />)
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageViewHtml)}</div>
      </body>
    </html>`
}
