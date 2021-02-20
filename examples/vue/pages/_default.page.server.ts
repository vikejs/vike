import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { getApp, InitialProps } from './_app'

export { render }

async function render(Page: any, initialProps: InitialProps) {
  const app = getApp(Page, initialProps)
  const appHtml = await renderToString(app)

  const title = initialProps.title || 'Demo: vite-plugin-ssr'

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${html.sanitize(title)}</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
