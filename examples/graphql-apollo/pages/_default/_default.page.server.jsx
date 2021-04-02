import React from "react";
import { html } from "vite-plugin-ssr";
import { getDataFromTree } from "@apollo/client/react/ssr";
import App from "../App";

export { render, addContextProps, setPageProps };

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
  const randomMessage = Math.floor(Math.random() * 1e16).toString(16);
  const pageProps = { randomMessage };
  const tree = (
    <App apolloClient={apolloClient}>
      <Page {...pageProps} />
    </App>
  );
  const pageHtml = await getDataFromTree(tree);
  const apolloIntialState = apolloClient.extract();
  return { pageHtml, pageProps, apolloIntialState };
}

function setPageProps({ contextProps }) {
  const { pageProps, apolloIntialState } = contextProps;
  return { pageProps, apolloIntialState };
}
