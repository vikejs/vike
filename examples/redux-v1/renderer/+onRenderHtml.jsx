export default onRenderHtml

import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'

async function onRenderHtml(pageContext) {
  const { pageHtml } = pageContext
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
