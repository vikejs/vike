import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";

const base = import.meta.env.BASE_URL;

import Layout from './Layout.svelte';

export default async function onRenderHtml(pageContent) {
  const app = Layout.render(pageContent);
  const { html, head, css} = app;

  return escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${base}logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${dangerouslySkipEscape(head)}
        <style>${css.code}</style>
      </head>
      <body>
        <div id="app">
          ${dangerouslySkipEscape(html)}
        </div>
      </body>
    </html>`
}
