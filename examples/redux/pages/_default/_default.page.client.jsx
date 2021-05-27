import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { getPage } from "vite-plugin-ssr/client";
import { getStore } from "./store";

hydrate();

async function hydrate() {
  const pageContext = await getPage();
  const { Page } = pageContext;
  const store = getStore(pageContext.PRELOADED_STATE);
  ReactDOM.hydrate(
    <Provider store={store}>
      <Page />
    </Provider>,
    document.getElementById("react-root")
  );
}
