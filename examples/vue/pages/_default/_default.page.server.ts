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

  const title = pageProps.title || 'Demo: vite-plugin-ssr'

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${html.dangerouslySetHtml(appHtml)}</div>
      </body>
    </html>`
}
