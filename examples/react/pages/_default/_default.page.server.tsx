import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";
import { PageLayout } from "./PageLayout";

export { render };

function render({
  Page,
  pageProps,
  contextProps,
}: {
  Page: (pageProps: any) => JSX.Element;
  pageProps: any;
  contextProps: { title?: string };
}) {
  const pageContent = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...pageProps} />
    </PageLayout>
  );

  const title = contextProps.title || "Demo: vite-plugin-ssr";

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-content">${html.dangerouslySetHtml(pageContent)}</div>
      </body>
    </html>`;
}
