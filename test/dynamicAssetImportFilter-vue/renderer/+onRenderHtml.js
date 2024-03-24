// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToString as renderToString_ } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { createApp } from './app'

async function onRenderHtml(pageContext) {
  // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
  // onRenderHtml() to support SPA
  if (!pageContext.Page) throw new Error('My render() hook expects pageContext.Page to be defined')

  const app = createApp(pageContext)

  const appHtml = await renderToString(app)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Example</title>
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`

  const dynamicAssetImportFilter = (importer) => {

    if (import.meta.env.DEV) {
      if (importer.startsWith('\0')) {
          return true;
      }

      if (importer.endsWith('+onRenderHtml.js')) {
          return true;
      }

      if (importer.endsWith('app.js')) {
          return true;
      }
    }

    return pageContext.loadedComponents.has(importer);
  }

  return {
    documentHtml,
    dynamicAssetImportFilter,
    pageContext: {
      // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
    }
  }
}

async function renderToString(app) {
  let err
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    err = err_
  }
  const appHtml = await renderToString_(app)
  if (err) throw err
  return appHtml
}
