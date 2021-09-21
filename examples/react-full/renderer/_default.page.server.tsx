import ReactDOMServer from "react-dom/server";
import React from "react";
import { escapeInject } from "vite-plugin-ssr";
import { PageWrapper } from "./PageWrapper";
import { getPageTitle } from "./getPageTitle";
import type { PageContext } from "./types";
import type { PageContextBuiltIn } from "vite-plugin-ssr/types";

export { render };
export { passToClient };

const passToClient = ["pageProps", "documentProps", "urlPathname"] as const;

function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page, pageProps } = pageContext;
  const stream = ReactDOMServer.renderToNodeStream(
    <PageWrapper pageContext={pageContext}>
      <Page {...pageProps} />
    </PageWrapper>
  );

  const title = getPageTitle(pageContext);

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`;
}
