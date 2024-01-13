// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToString as renderToString_ } from '@vue/server-renderer'
import type { App } from 'vue'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { createApp } from './app'
import logoUrl from './logo.svg'
import type { OnRenderHtmlAsync } from 'vike/types'
import { getPageTitle } from './getPageTitle'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
  // onRenderHtml() to support SPA
  if (!pageContext.Page) throw new Error('My render() hook expects pageContext.Page to be defined')

  const app = createApp(pageContext)

  const appHtml = await renderToString(app)

  // https://vike.dev/head
  const title = getPageTitle(pageContext)
  const desc = pageContext.data?.description || pageContext.config.description || 'Demo of using Vike'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
    }
  }
}

async function renderToString(app: App) {
  let err: unknown
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    err = err_
  }
  const appHtml = await renderToString_(app)
  if (err) throw err
  return appHtml
}
