import ReactDOM from "react-dom";
import React from "react";
import { getPage } from "vite-plugin-ssr/client";
import { PageContext } from "./types";

hydrate();

async function hydrate() {
  const pageContext: PageContext = await getPage();
  const { Page } = pageContext;
  ReactDOM.hydrate(<Page />, document.getElementById("page-view"));
}
