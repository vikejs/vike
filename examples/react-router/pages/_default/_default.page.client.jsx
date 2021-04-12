import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { getPage } from "vite-plugin-ssr/client";

hydrate();

async function hydrate() {
  const { Page, contextProps } = await getPage();
  ReactDOM.hydrate(
    <BrowserRouter>
      <Page {...contextProps.pageProps} />
    </BrowserRouter>,
    document.getElementById("react-root")
  );
}
