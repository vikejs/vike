import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";
import { PageLayout } from "./PageLayout";
import { PageContext } from "./types";
import { getPageTitle } from "./getPageTitle";

export { render };
export { passToClient };

const passToClient = ["pageProps", "documentProps", "urlPathname"];

function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;
  const pageContent = ReactDOMServer.renderToString(
    <PageLayout pageContext={pageContext}>
      <Page {...pageProps} />
    </PageLayout>
  );

  const title = getPageTitle(pageContext);

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${html.dangerouslySkipEscape(pageContent)}</div>
      </body>
    </html>`;
}
