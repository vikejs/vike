import { generateHydrationScript, renderToStream, renderToString } from 'solid-js/web'
import type { IPageContext } from 'types'
import { dangerouslySkipEscape, escapeInject, stampPipe } from 'vite-plugin-ssr/server'

import { AppHead } from './AppHead'
import { PageComponent } from './PageComponent'

async function onRenderHtml(pageContext: IPageContext): Promise<unknown> {
  const Head = pageContext?.exports?.Head || (() => <></>)

  const headHtml = renderToString(() => (
    <AppHead pageContext={pageContext}>
      <Head />
    </AppHead>
  ))
  const { pipe } = renderToStream(() => PageComponent(pageContext))
  stampPipe(pipe, 'node-stream')

  const lang = (pageContext.config.lang as string) || 'en'
  const documentHtml = escapeInject`<!DOCTYPE html>
  <html lang="${lang}">
    <head>
      ${dangerouslySkipEscape(headHtml)}
      ${dangerouslySkipEscape(generateHydrationScript())}
    </head>
    <body>
      <div id="page-view">${pipe}</div>
    </body>
  </html>`

  return {
    documentHtml
  }
}
export default onRenderHtml
