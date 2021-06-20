import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageLayout } from "./PageLayout";
import { html } from "vite-plugin-ssr";
import logoUrl from "./logo.svg";

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

  // See https://github.com/brillout/vite-plugin-ssr#html-head
  const { documentProps } = pageContext;
  const title = documentProps?.title || "Vite SSR app";
  const description =
    documentProps?.description || "An app using Vite and vite-plugin-ssr.";

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
        <div id="page-view">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
