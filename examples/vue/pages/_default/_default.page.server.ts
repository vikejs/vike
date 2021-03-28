import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { getApp, PageProps } from './app'

export { render }

async function render({
  Page,
  pageProps
}: {
  Page: any
  pageProps: PageProps
}) {
  const app = getApp(Page, pageProps)
  const appHtml = await renderToString(app)

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${pageProps.docTitle || 'Demo'}</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
