import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { getStore } from "./store";
import { html } from "vite-plugin-ssr";

export { render };
export { addContextProps };
export { setPageProps };

async function render({ contextProps }) {
  const { pageHtml } = contextProps;
  return html`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${html.dangerouslySetHtml(pageHtml)}</div>
      </body>
    </html>`;
}

async function addContextProps({ Page }) {
  const store = getStore();

  const pageHtml = renderToString(
    <Provider store={store}>
      <Page />
    </Provider>
  );

  // Grab the initial state from our Redux store
  const PRELOADED_STATE = store.getState();

  return {
    PRELOADED_STATE,
    pageHtml,
  };
}

function setPageProps({ contextProps }) {
  const { PRELOADED_STATE } = contextProps;
  return { PRELOADED_STATE };
}
