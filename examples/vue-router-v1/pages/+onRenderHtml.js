// https://vike.dev/onRenderHtml
export default onRenderHtml

import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { createApp } from './app'

async function onRenderHtml(pageContext) {
  const { Page } = pageContext
  const { app, router } = createApp({ Page })

  // set the router to the desired URL before rendering
  router.push(pageContext.urlPathname)
  await router.isReady()

  const appHtml = await renderToString(app)

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
