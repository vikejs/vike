import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'
import { Component, ContextProps } from './types'

export { passToClient }
export { render }

const passToClient = ['pageProps', 'docTitle', 'routeParams']

async function render({ Page, contextProps }: { Page: Component; contextProps: ContextProps }) {
  const app = createApp(Page, contextProps)
  const appHtml = await renderToString(app)

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${contextProps.docTitle || 'Demo'}</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
