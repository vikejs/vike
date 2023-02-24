export default onRenderHtml

import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { PageLayout } from './PageLayout'

async function onRenderHtml(pageContext) {
  const { Page } = pageContext
  const pageHtml = PageLayout(Page)
  return escapeInject`<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
