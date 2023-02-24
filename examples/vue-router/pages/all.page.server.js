import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { createApp } from './app'

export { render }

async function render(pageContext) {
  const { Page } = pageContext
  const { app, router } = createApp({ Page })

  // set the router to the desired URL before rendering
  router.push(pageContext.urlPathname)
  await router.isReady()

  const appHtml = await renderToString(app)

  return escapeInject`<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
