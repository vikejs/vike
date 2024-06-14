// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Layout } from './Layout'

async function onRenderHtml(pageContext) {
  const { Page } = pageContext
  const pageHtml = Layout(Page)
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
