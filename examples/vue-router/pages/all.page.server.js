import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'

export { render }

async function render({ Page, pageContext }) {
  const { app, router } = createApp({ Page })

  // set the router to the desired URL before rendering
  router.push(pageContext.urlFull)
  await router.isReady()

  const appHtml = await renderToString(app)

  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
