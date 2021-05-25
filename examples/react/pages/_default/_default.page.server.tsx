import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";
import { PageLayout } from "./PageLayout";

export { render };
export { passToClient };

const passToClient = ["pageProps", "docTitle"];

function render({
  Page,
  pageContext,
}: {
  Page: (pageProps: any) => JSX.Element;
  pageContext: Record<string, any>;
}) {
  const pageContent = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...pageContext.pageProps} />
    </PageLayout>
  );

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${pageContext.docTitle || "Demo"}</title>
      </head>
      <body>
        <div id="page-view">${html.dangerouslySetHtml(pageContent)}</div>
      </body>
    </html>`;
}
