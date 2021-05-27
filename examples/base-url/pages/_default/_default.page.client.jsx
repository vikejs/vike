import ReactDOM from "react-dom";
import React from "react";
import { getPage } from "vite-plugin-ssr/client";
import { PageLayout } from "./PageLayout";

hydrate();

async function hydrate() {
  const pageContext = await getPage();
  const { Page } = pageContext;

  ReactDOM.hydrate(
    <PageLayout>
      <Page {...pageContext.pageProps} />
    </PageLayout>,
    document.getElementById("page-view")
  );
}
