import React from "react";
import { escapeInjections } from "vite-plugin-ssr";
import { getDataFromTree } from "@apollo/client/react/ssr";
import App from "./App";

export { render };
export { addPageContext };
export { passToClient };

const passToClient = ["apolloIntialState"];

function render(pageContext) {
  const { pageHtml } = pageContext;
  return escapeInjections`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-content">${escapeInjections.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}

async function addPageContext(pageContext) {
  const { Page, apolloClient } = pageContext;
  const tree = (
    <App apolloClient={apolloClient}>
      <Page />
    </App>
  );
  const pageHtml = await getDataFromTree(tree);
  const apolloIntialState = apolloClient.extract();
  return { pageHtml, apolloIntialState };
}
