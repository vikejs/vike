import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageLayout } from "./PageLayout";
import { html } from "vite-plugin-ssr";
import { ContextProps, ReactComponent } from "./types";
import logoUrl from "./logo.svg";

export { render };
export { passToClient };

// See https://github.com/brillout/vite-plugin-ssr#data-fetching
const passToClient = ["pageProps"];

function render({
  Page,
  contextProps,
}: {
  Page: ReactComponent;
  contextProps: ContextProps;
}) {
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...contextProps.pageProps} />
    </PageLayout>
  );
  const title = "Vite SSR app";
  const description = "An app using Vite and vite-plugin-ssr.";
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
