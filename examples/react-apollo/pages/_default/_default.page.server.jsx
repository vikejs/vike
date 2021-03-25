import React from "react";
import { html } from "vite-plugin-ssr";
import { getDataFromTree } from "@apollo/client/react/ssr";
import App from "../App";

export { render, addContextProps, setPageProps };

function render({ contextProps }) {
  const title = contextProps.title || "Demo: vite-plugin-ssr";

  return html`<!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="page-content">${html.dangerouslySetHtml(contextProps.pageHtml)}</div>
      </body>
    </html>`;
}

async function addContextProps({ Page, pageProps, contextProps }) {
  let pageHtml, initialApolloState;

  const tree = <App client={contextProps.client}>
    <Page {...pageProps} />
  </App>;

  await getDataFromTree(tree).then((_pageHtml) => {
    pageHtml = _pageHtml;
    initialApolloState = contextProps.client.extract();
  });

  return { pageHtml, initialApolloState };
}

function setPageProps({ contextProps }) {
  return { initialApolloState: contextProps.initialApolloState };
}
