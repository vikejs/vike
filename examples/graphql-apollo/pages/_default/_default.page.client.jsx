import ReactDOM from "react-dom";
import React from "react";
import { getPage } from "vite-plugin-ssr/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import App from "../App";

hydrate();

async function hydrate() {
  const {
    Page,
    pageProps: { apolloIntialState, pageProps },
  } = await getPage();
  const apolloClient = makeApolloClient(apolloIntialState);
  ReactDOM.hydrate(
    <App apolloClient={apolloClient}>
      <Page {...pageProps} />
    </App>,
    document.getElementById("page-content")
  );
}

function makeApolloClient(apolloIntialState) {
  return new ApolloClient({
    uri: "https://countries.trevorblades.com",
    cache: new InMemoryCache().restore(apolloIntialState),
  });
}
