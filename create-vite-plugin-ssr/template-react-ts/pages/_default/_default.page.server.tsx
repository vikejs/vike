import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageLayout } from "./PageLayout";
import { html } from "vite-plugin-ssr";

type InitialProps = {
  title?: string;
};

export { render };

function render(
  Page: (initialProps: InitialProps) => JSX.Element,
  initialProps: InitialProps
) {
  const pageHtml = ReactDOMServer.renderToString(
    <PageLayout>
      <Page {...initialProps} />
    </PageLayout>
  );

  const { title } = initialProps || "My SSR Vite App";

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${html.sanitize(title)}</title>
      </head>
      <body>
        <div id="page-view">${html.dangerouslySetHtml(pageHtml)}</div>
      </body>
    </html>`;
}
