import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";
import { PageLayout } from "./PageLayout";

export { render };
export { passToClient };

// See https://github.com/brillout/vite-plugin-ssr#data-fetching
const passToClient = ["pageProps"];

function render(pageContext) {
  const { Page, pageProps } = pageContext;
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  );

  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
