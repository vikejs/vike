import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";
import { PageLayout } from "./PageLayout";

export { render };
export { passToClient };

const passToClient = ["routeParams"];

function render(pageContext) {
  const { Page, routeParams } = pageContext;
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout>
      <Page routeParams={routeParams} />
    </PageLayout>
  );

  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
