import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { createVueApp } from './createVueApp'

export { render }
export { passToClient }

// See https://vike.dev/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const app = createVueApp(pageContext)
  const appHtml = await renderToString(app)

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
