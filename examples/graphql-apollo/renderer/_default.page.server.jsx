import React from "react";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr";
import { getDataFromTree } from "@apollo/client/react/ssr";
import App from "./App";

export { render };
export { onBeforeRender };
export { passToClient };

const passToClient = ["apolloIntialState"];

function render(pageContext) {
  const { pageHtml } = pageContext;
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-content">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}

async function onBeforeRender(pageContext) {
  const { Page, apolloClient } = pageContext;
  const tree = (
    <App apolloClient={apolloClient}>
      <Page />
    </App>
  );
  const pageHtml = await getDataFromTree(tree);
  const apolloIntialState = apolloClient.extract();
  return {
    pageContext: {
      pageHtml,
      apolloIntialState,
    },
  };
}
