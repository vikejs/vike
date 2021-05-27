import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";
import { PageLayout } from "./PageLayout";
import { PageContext } from "./types";

export { render };
export { passToClient };

const passToClient = ["pageProps", "documentProps"];

function render(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;
  const pageContent = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  );

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${pageContext.documentProps?.title || "Demo"}</title>
      </head>
      <body>
        <div id="page-view">${html.dangerouslySetHtml(pageContent)}</div>
      </body>
    </html>`;
}
