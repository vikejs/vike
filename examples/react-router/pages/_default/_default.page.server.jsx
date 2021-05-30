import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { html } from "vite-plugin-ssr";

export { render };
export { passToClient };

const passToClient = ["pageProps"];

async function render(pageContext) {
  const { Page, pageProps, url } = pageContext;
  const pageHtml = renderToString(
    <StaticRouter location={url}>
      <Page {...pageProps} />
    </StaticRouter>
  );
  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
