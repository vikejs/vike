import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";
import { PageLayout } from "./PageLayout";

export { render };

function render({
  Page,
  pageProps,
}: {
  Page: (pageProps: any) => JSX.Element;
  pageProps: Record<string, any>;
}) {
  const pageContent = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  );

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${pageProps.docTitle || "Demo"}</title>
      </head>
      <body>
        <div id="page-view">${html.dangerouslySetHtml(pageContent)}</div>
      </body>
    </html>`;
}
