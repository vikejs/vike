import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageLayout } from "./PageLayout";
import { html } from "vite-plugin-ssr";
import { PageContext, ReactComponent } from "./types";
import logoUrl from "./logo.svg";

export { render };
export { passToClient };

// See https://github.com/brillout/vite-plugin-ssr#data-fetching
const passToClient = ["pageProps"];

function render({
  Page,
  pageContext,
}: {
  Page: ReactComponent;
  pageContext: PageContext;
}) {
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...pageContext.pageProps} />
    </PageLayout>
  );

  // See https://github.com/brillout/vite-plugin-ssr#html-head
  const title = pageContext.documentProps?.title || "Vite SSR app";
  const description =
    pageContext.documentProps?.description ||
    "An app using Vite and vite-plugin-ssr.";

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${html.dangerouslySetHtml(pageHtml)}</div>
      </body>
    </html>`;
}
