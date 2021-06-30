import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'

export { render }
export { passToClient }

// See https://github.com/brillout/vite-plugin-ssr#data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)

  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${html.dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
