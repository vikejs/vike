import ReactDOM from "react-dom";
import React from "react";
import { getPage } from "vite-plugin-ssr/client";
import { PageWrapper } from "./PageWrapper";
import type { PageContext } from "./types";
import type { PageContextBuiltInClient } from "vite-plugin-ssr/types";

hydrate();

async function hydrate() {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage<PageContextBuiltInClient & PageContext>();
  const { Page, pageProps } = pageContext;
  ReactDOM.hydrate(
    <PageWrapper pageContext={pageContext}>
      <Page {...pageProps} />
    </PageWrapper>,
    document.getElementById("page-view")
  );
}
