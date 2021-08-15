import ReactDOM from "react-dom";
import React from "react";
import { getPage } from "vite-plugin-ssr/client";
import { PageWrapper } from "./PageWrapper";

hydrate();

async function hydrate() {
  const pageContext = await getPage();
  const { Page, pageProps } = pageContext;
  ReactDOM.hydrate(
    <PageWrapper>
      <Page {...pageProps} />
    </PageWrapper>,
    document.getElementById("page-view")
  );
}
