// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { escapeInject } from 'vike/server'
import type { OnRenderHtmlAsync } from 'vike/types'

// SPA mode: the HTML is static with an empty <div id="root">, see https://vike.dev/render-modes#spa
const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Solid App</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `
}
