import ReactDOMServer from "react-dom/server";
import React from "react";
import { escapeInjections } from "vite-plugin-ssr";
import { PageLayout } from "./PageLayout";

export { render };
export { passToClient };

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ["pageProps"];

function render(pageContext) {
  const { Page, pageProps } = pageContext;
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  );

  return escapeInjections`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${escapeInjections.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
