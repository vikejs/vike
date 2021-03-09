import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { html } from "vite-plugin-ssr";

export { render };

async function render({ Page, pageProps, contextProps }) {
  const { url } = contextProps;
  const pageHtml = renderToString(
    <StaticRouter location={url}>
      <Page {...pageProps} />
    </StaticRouter>
  );
  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${html.dangerouslySetHtml(pageHtml)}</div>
      </body>
    </html>`;
}
