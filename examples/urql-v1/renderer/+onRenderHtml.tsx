// https://vike.dev/onRenderHtml
export default onRenderHtml

import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import type { PageContext } from './types'
import type { PageContextBuiltInServer } from 'vike/types'

async function onRenderHtml(pageContext: PageContextBuiltInServer & PageContext) {
  const { pageHtml } = pageContext

  // See https://vike.dev/head
  const { documentProps } = pageContext
  const title = (documentProps && documentProps.title) || 'Vite SSR app'
  const desc = (documentProps && documentProps.description) || 'App using Vite + Vike'

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}
