import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'
import logoUrl from './logo.svg'

export { render }
export { passToClient }

// See https://github.com/brillout/vite-plugin-ssr#data-fetching
const passToClient = ['pageProps', 'routeParams']

async function render({ Page, contextProps }) {
  const app = createApp(Page, contextProps)
  const appHtml = await renderToString(app)
  const title = 'My Vite SSR app'
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
