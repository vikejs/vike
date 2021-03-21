import ReactDOM from "react-dom";
import React from "react";
import { getPage } from "vite-plugin-ssr/client";
import { ApolloClient, InMemoryCache } from '@apollo/client'
import App from '../App';

hydrate();

async function hydrate() {
  const { Page, pageProps } = await getPage();

  const client = new ApolloClient({
    uri: 'https://countries.trevorblades.com',
    cache: new InMemoryCache().restore(pageProps.initialApolloState),
  });

  ReactDOM.hydrate(
    <App client={client}>
      <Page {...pageProps} />
    </App>
    , document.getElementById("page-content")
  );
}
