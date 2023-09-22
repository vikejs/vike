// https://vike.dev/onRenderHtml
export default onRenderHtml

import { generateHydrationScript, renderToStream } from 'solid-js/web'
import { PageLayout } from './PageLayout'
import { escapeInject, dangerouslySkipEscape, stampPipe } from 'vike/server'
import { PageContext } from './types'
import logoUrl from './logo.svg'

function onRenderHtml(pageContext: PageContext) {
  const { pipe } = renderToStream(() => <PageLayout pageContext={pageContext} />)
  stampPipe(pipe, 'node-stream')

  // See https://vike.dev/head
  const { documentProps } = pageContext
  const title = (documentProps && documentProps.title) || 'Vite SSR app'
  const description = (documentProps && documentProps.description) || 'App using Vite + vike'

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
        ${dangerouslySkipEscape(generateHydrationScript())}
      </head>
      <body>
        <div id="page-view">${pipe}</div>
      </body>
    </html>`
}
