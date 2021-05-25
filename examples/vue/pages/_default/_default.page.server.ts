import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'
import { Component, PageContext } from './types'

export { passToClient }
export { render }

const passToClient = ['pageProps', 'documentProps', 'routeParams']

async function render({ Page, pageContext }: { Page: Component; pageContext: PageContext }) {
  const app = createApp(Page, pageContext)
  const appHtml = await renderToString(app)

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${pageContext.documentProps?.title || 'Demo'}</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
