import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import { createApp } from '../app'
import type { PageContext } from '../entity/types'
import type { PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient } from 'vite-plugin-ssr/types'

async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const { app, router } = createApp(pageContext)

  // set the router to the desired URL before rendering
  router.push(pageContext.urlOriginal)
  await router.isReady()

  const appHtml = await renderToString(app)

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}

export { render }