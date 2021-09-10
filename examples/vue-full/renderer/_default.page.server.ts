import { renderToString } from '@vue/server-renderer'
import { escapeInjections, dangerouslySkipEscape } from 'vite-plugin-ssr'
import { createApp } from './app'
import { getPageTitle } from './getPageTitle'
import type { PageContext } from './types'
import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'

export { passToClient }
export { render }

const passToClient = ['pageProps', 'documentProps', 'urlPathname']

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)

  const title = getPageTitle(pageContext)

  return escapeInjections`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
