import ReactDOMServer from "react-dom/server";
import React from "react";
import { html } from "vite-plugin-ssr";
import { PageWrapper } from "./PageWrapper";
import { getPageTitle } from "./getPageTitle";
import type { PageContext } from "./types";
import type { PageContextBuiltIn } from "vite-plugin-ssr/types";

export { render };
export { passToClient };

const passToClient = ["pageProps", "documentProps", "urlPathname"] as const;

function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page, pageProps } = pageContext;
  const pageContent = ReactDOMServer.renderToString(
    <PageWrapper pageContext={pageContext}>
      <Page {...pageProps} />
    </PageWrapper>
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
