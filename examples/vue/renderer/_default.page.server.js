import { renderToString } from '@vue/server-renderer'
import { escapeInjections } from 'vite-plugin-ssr'
import { createApp } from './app'

export { render }
export { passToClient }

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)

  return escapeInjections`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${escapeInjections.dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
