import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'
import { PageContext } from './types'
import { getPageTitle } from "./getPageTitle";

export { passToClient }
export { render }

const passToClient = ['pageProps', 'documentProps', 'routeParams']

async function render(pageContext: PageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)

  const title = getPageTitle(pageContext)

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
