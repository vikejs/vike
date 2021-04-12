import React from "react";
import { html } from "vite-plugin-ssr";
import { getDataFromTree } from "@apollo/client/react/ssr";
import App from "../App";

export { render };
export { addContextProps };
export { passToClient };

const passToClient = ["apolloIntialState"];

function render({ contextProps }) {
  const { pageHtml } = contextProps;
  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-content">${html.dangerouslySetHtml(pageHtml)}</div>
      </body>
    </html>`;
}

async function addContextProps({ Page, contextProps }) {
  const { apolloClient } = contextProps;
  const tree = (
    <App apolloClient={apolloClient}>
      <Page />
    </App>
  );
  const pageHtml = await getDataFromTree(tree);
  const apolloIntialState = apolloClient.extract();
  return { pageHtml, apolloIntialState };
}
