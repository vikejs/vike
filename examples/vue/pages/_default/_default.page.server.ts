import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { getApp } from './app'

export { passToClient }
export { render }

const passToClient = ['pageProps', 'docTitle']

async function render({
  Page,
  contextProps
}: {
  Page: any
  contextProps: { docTitle: string; pageProps: Record<string, unknown> }
}) {
  const app = getApp(Page, contextProps.pageProps)
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
