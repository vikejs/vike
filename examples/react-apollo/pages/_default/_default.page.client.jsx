import ReactDOM from "react-dom";
import React from "react";
import { getPage } from "vite-plugin-ssr/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import App from "../App";

hydrate();

async function hydrate() {
  const { Page, pageProps } = await getPage();

  ReactDOM.hydrate(
    <App client={makeApolloClient(pageProps)}>
      <Page {...pageProps} />
    </App>
    , document.getElementById("page-content")
  );
}

function makeApolloClient(pageProps) {
  // It's important to create an entirely new instance of Apollo Client for each request.
  // Otherwise, your response to a request might include sensitive cached query results
  // from a previous request. Source: https://www.apollographql.com/docs/react/performance/server-side-rendering/#example
  return new ApolloClient({
    uri: "https://countries.trevorblades.com",
    cache: new InMemoryCache().restore(pageProps.initialApolloState),
  });
}
