import { renderToString } from '@vue/server-renderer'
import { html } from 'vite-plugin-ssr'
import { createApp } from './app'
import { ContextProps, VueComponent } from './types'
import logoUrl from './logo.svg'

export { render }
export { passToClient }

// We use `contextProps.pageProps` to hold the props of the root component.
// We pass `contextProps.pageProps` to the browser for `hydrate()` in `_default.page.client.ts`.
const passToClient = ['pageProps']

async function render({ Page, contextProps }: { Page: VueComponent; contextProps: ContextProps }) {
  const app = createApp(Page, contextProps.pageProps)
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
