export { render }

import { escapeInject } from "vite-plugin-ssr";
import type { PageContextServer } from './types'

// SPA mode: the HTML is static with an empty <div id="root">, see https://vite-plugin-ssr.com/render-modes#spa
function render(pageContext: PageContextServer) {
  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <title>Solid App</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
      </body>
    </html>
  `;
}
