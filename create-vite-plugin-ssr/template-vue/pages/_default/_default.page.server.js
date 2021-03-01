import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'
import logoUrl from './logo.svg'

export { render }

async function render({ Page, pageProps }) {
  const app = createApp({ Page, pageProps })
  const appHtml = await renderToString(app)
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
